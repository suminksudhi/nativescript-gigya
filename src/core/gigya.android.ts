import * as application from "tns-core-modules/application";
import {
    GIGYA_AUTH_STATUS, GIGYA_METHOD, GIGYA_SOCIAL_PROVIDERS,
    IGigyaService
} from "./interfaces/gigya.service.interface";
import {Common} from "./gigya.common";
import {ObservableProperty} from "./decorator/ObservableProperty";

const GIGYA_API_KEY="3_dq7csPgmwMO0X5Q7rvLewN4cBqqSDLo1dKgTJW1uSDqMqp3gvUh2m9SzzyRXOh-C";
const GIGYA_DATA_CENTER="eu1.gigya.com";
declare let com: any;


export class Gigya extends Common implements IGigyaService{

    private  androidApplication;

    @ObservableProperty()
    public gigyaListener$;

    private activity: android.app.Activity;
    constructor() {
        super();
        this.init();
        this.initListener();
    }

    init(gigyaApiKey?: string, dataCenter?: string){
        this.androidApplication = application.android;
        this.activity = this.androidApplication.startActivity || this.androidApplication.foregroundActivity;
        com.gigya.socialize.android.GSAPI
            .getInstance()
            .initialize(this.androidApplication.context.getApplicationContext(), (gigyaApiKey || GIGYA_API_KEY), (dataCenter || GIGYA_DATA_CENTER));
    }

    logout(){
        com.gigya.socialize.android.GSAPI
            .getInstance()
            .logout()
    }

    addConnection(options: { provider: GIGYA_SOCIAL_PROVIDERS, forceAuthentication?: boolean }){
        return new Promise((resolve,reject) => {
            let params = new com.gigya.socialize.GSObject();
            Object.keys(options).forEach((key)=>{
                params.put(key, options[key])
            });
            console.log("params", params);
            let gsapi = com.gigya.socialize.android.GSAPI.getInstance();
            com.gigya.socialize.android.GSAPI
                .getInstance()
                .addConnection(this.activity, params, new com.gigya.socialize.GSResponseListener({
                    onGSResponse: (method, response, context) => {
                        try {
                            console.log("addConnection response", response);
                            response = JSON.parse(response.getData().toJsonString());
                            if (response.errorCode) {
                                reject({status: GIGYA_AUTH_STATUS.LOGGED_ERR, data: response})
                            }
                            resolve({status: GIGYA_AUTH_STATUS.LOGGED_IN, data: response});
                        }catch(e){
                            console.log("addConnection err", e);
                            reject({status: GIGYA_AUTH_STATUS.LOGGED_ERR, data: e})
                        }
                    }
                }), null);
        });
    }

    private finalizeData(regToken){
        return new Promise((resolve,reject) => {
            this.requestApi(GIGYA_METHOD.FINALIZE_REGISTRATION, {
                regToken: regToken,
                preferences: JSON.stringify({privacy: {emirates: {isConsentGranted: true}}})
            })
                .then((finalizeResp) => {
                    resolve({status: GIGYA_AUTH_STATUS.REG_SUCCESS, data: finalizeResp});
                })
                .catch((errorInfo) => {
                    reject({status: GIGYA_AUTH_STATUS.REG_ERROR, data: errorInfo});
                });
        });
    }


    login(options: { provider: GIGYA_SOCIAL_PROVIDERS, loginID?: string, password?: string }){
        return new Promise((resolve,reject) => {
            let params = new com.gigya.socialize.GSObject();
            Object.keys(options).forEach((key)=>{
                params.put(key, options[key])
            });
            com.gigya.socialize.android.GSAPI
                .getInstance()
                .setLoginBehavior(com.gigya.socialize.android.GSAPI.LoginBehavior.BROWSER);

            switch(options.provider){
                case GIGYA_SOCIAL_PROVIDERS.SITE:  // if login is via site
                    this.requestApi(GIGYA_METHOD.LOGIN, {
                        loginID: options.loginID,
                        password: options.password
                    })
                        .then((response) => {
                            resolve({status: GIGYA_AUTH_STATUS.LOGGED_IN, data: response});
                        })
                        .catch((errorInfo) => {
                            reject({status: GIGYA_AUTH_STATUS.LOGGED_ERR, data: errorInfo.data})
                        });
                    break;
                default:  // if login is via social media
                    com.gigya.socialize.android.GSAPI
                        .getInstance()
                        .login(this.activity, params, new com.gigya.socialize.GSResponseListener({
                            onGSResponse: (method, response, context) => {
                                try {
                                    response = JSON.parse(response.getData().toJsonString());
                                    if (response.errorCode) {
                                        switch (response.errorCode) {
                                            case 206001: //finalize registartion
                                                console.log('do finalize');
                                                this.finalizeData(response.data.regToken).then((data) => {
                                                    reject({status: GIGYA_AUTH_STATUS.LOGGED_IN, data: response.data}) ;
                                                }).catch((err) => {
                                                    reject({status: GIGYA_AUTH_STATUS.LOGGED_ERR, data: response.data}) ;
                                                });
                                                break;
                                            default:
                                                reject({status: GIGYA_AUTH_STATUS.LOGGED_ERR, data: response})
                                        }
                                    }
                                    resolve({status: GIGYA_AUTH_STATUS.LOGGED_IN, data: response});
                                }catch(e){
                                    reject({status: GIGYA_AUTH_STATUS.LOGGED_ERR, data: e})
                                }
                            }
                        }), false, null);
                    break;
            }
        });
    }

    initListener(){
        com.gigya.socialize.android.GSAPI
            .getInstance()
            .addAccountsListener(new com.gigya.socialize.android.event.GSAccountsEventListener({
                onLogin: (user, context) => {
                    user = JSON.parse(user.getData().toJsonString());
                    this.gigyaListener$ = { status: GIGYA_AUTH_STATUS.LOGGED_IN, data: {
                        user: user
                    }};
                },
                onLogout: (context) => {
                    this.gigyaListener$ = { status: GIGYA_AUTH_STATUS.LOGGED_OUT };
                }
            }));

        com.gigya.socialize.android.GSAPI
            .getInstance()
            .addSocializeListener(new com.gigya.socialize.android.event.GSSocializeEventListener({
                onLogin: (provider: string, user, context) => {
                    user = JSON.parse(user.getData().toJsonString());
                    this.gigyaListener$ = { status: GIGYA_AUTH_STATUS.LOGGED_IN, data: {
                        provider: provider,
                        user: user
                    }};
                },
                onLogout: (context) => {
                    this.gigyaListener$=({ status: GIGYA_AUTH_STATUS.LOGGED_OUT });
                },
                onConnectionAdded: (provider, user, context) => {
                    user = JSON.parse(user.getData().toJsonString());
                    this.gigyaListener$=({ status: GIGYA_AUTH_STATUS.CONNECTION_ADDED,  data: {
                        provider: provider,
                        user: user
                    }});
                },
                onConnectionRemoved: (provider, context) => {
                    console.log('Social connection was removed from the user', provider);
                    this.gigyaListener$=({ status: GIGYA_AUTH_STATUS.CONNECTION_REMOVED , data: {
                        provider: provider
                    }});
                }
            }));
    }

    getCurrentAccessToken(){
        return  com.gigya.socialize.android.GSAPI
            .getInstance().getSession();
    }

    requestApi(methodName:GIGYA_METHOD, options: Object){
        return new Promise((resolve,reject) => {
            // Step 1 - Defining request parameters
            let params = new com.gigya.socialize.GSObject();
            Object.keys(options).forEach((key) => {
                params.put(key, options[key])
            });
            // Step 2 - Defining response listener. The response listener will handle the request's response.
            let resListener = new com.gigya.socialize.GSResponseListener({
                onGSResponse: (method, response, context) => {
                    try {
                        response = JSON.parse(response.getData().toJsonString());
                        if (response.errorCode == 0) { // SUCCESS! response status = OK
                            console.log("Success in setStatus operation.", response);
                            resolve({ status: GIGYA_AUTH_STATUS.API_SUCCESS , data: response});
                        } else {  // Error
                            console.log("Got error on setStatus: " , response);
                            reject({ status: GIGYA_AUTH_STATUS.API_ERROR , data: response});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });

            // Step 3 - Sending the request
            com.gigya.socialize.android.GSAPI
                .getInstance()
                .sendRequest(methodName, params, resListener, null);
        });
    }
}