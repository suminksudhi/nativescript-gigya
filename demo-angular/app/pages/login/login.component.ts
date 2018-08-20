import { Component, ChangeDetectorRef } from "@angular/core";
//import * as Facebook from "nativescript-facebook";
import { NavigationService } from "../../services/navigation.service";
import * as appSettings from "tns-core-modules/application-settings";
import {GigyaService} from "nativescript-gigya/angular";
import { GIGYA_SOCIAL_PROVIDERS, GIGYA_METHOD } from "nativescript-gigya";

@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})
export class LoginComponent {

    username: string;
    password: string;
    regToken: string;

    constructor(private ref: ChangeDetectorRef,
                private navigationService: NavigationService,
                private gigyaService: GigyaService) {

        this.username = "dev.sumin@yahoo.com";
        this.password = "password";

        /*this.gigyaService.gigyaListener$.subscribe((response) => {
            console.log('in subscription', response);
        })*/
    }

    sitelogin() {
        console.log('site login attempt');
        this.gigyaService.login({
            provider: GIGYA_SOCIAL_PROVIDERS.SITE,
            loginID: this.username,
            password: this.password
        })
        .then((data) => {
            console.log("loggin success", data);
        }).catch((err) => {
            console.log('login error', err)
            alert(err.data.errorMessage)
        });
    }

    fblogin(){
        this.gigyaService.login({
            provider: GIGYA_SOCIAL_PROVIDERS.FACEBOOK
        })
        .then((fbLoginResponse) => {
            console.log("fb logged in", JSON.stringify(fbLoginResponse, null, 4));
        })
        .catch((errorInfo) => {
            console.log("fb login error", errorInfo);
            switch(errorInfo.data.errorCode) {
                case 403043:
                    this.regToken=errorInfo.data.regToken;
                    break;
            }
        });
    }

    linkAccount(){
        this.gigyaService.requestApi(GIGYA_METHOD.LINK_ACCOUNT, {
            regToken: this.regToken,
            loginID: this.username,
            password: this.password
        })
        .then((data) => {
            console.log("account linked", data)
        }).catch((err) => {
            console.log("account err", err)
        });
    }

    login() {
        this.gigyaService.login({
            provider: GIGYA_SOCIAL_PROVIDERS.SITE,
            loginID: "dev.sumin@yahoo.com",
            password: "password"
        })
        .then((data) => {
            console.log("logged in", data);
            this.gigyaService.login({
                provider: GIGYA_SOCIAL_PROVIDERS.FACEBOOK
            })
            .then((fbLoginResponse) => {
                console.log("fb logged in", (fbLoginResponse as any).UID);
                this.gigyaService.requestApi(GIGYA_METHOD.LINK_ACCOUNT, {
                    UID: (fbLoginResponse as any).UID,
                    loginID: "dev.sumin@yahoo.com",
                    password: "password"
                })
                .then((data) => {
                    console.log("account linked", data)
                }).catch((err) => {
                      console.log("account err", err)
                })
            })
            .catch((errorInfo) => {
                 console.log("connection error", errorInfo)
                switch(errorInfo.data.errorCode){
                    case 403043:
                        this.gigyaService.requestApi(GIGYA_METHOD.LINK_ACCOUNT, {
                            regToken: errorInfo.data.regToken,
                            loginID: "dev.sumin@yahoo.com",
                            password: "password"
                        })
                            .then((data) => {
                                console.log("account linked", data)
                            }).catch((err) => {
                            console.log("account err", err)
                        })
                        break;
                }
            });
        }).catch((err) => {
        console.log('err', err)
        });
    }

    login1() {
        this.gigyaService.login({
            provider: GIGYA_SOCIAL_PROVIDERS.SITE ,
            loginID: "dev.sumin@yahoo.com",
            password: "password"
        })
        .then((data) => {
             console.log("logged in", data);
            console.log("now adding account");
            this.gigyaService.addConnection({
                provider: GIGYA_SOCIAL_PROVIDERS.FACEBOOK,
                forceAuthentication: true
            })
            .then((response) => {
                  console.log("connection added",response)
            })
            .catch((errorInfo) => {
                 console.log("connection error",errorInfo)
            });
        }).catch((err) => {
            console.log('err', err)
        });

        /*
                this.gigyaService.login({
                    provider: GIGYA_SOCIAL_PROVIDERS.FACEBOOK
                })
                    .then((data) => {
                         console.log("logged in", data);
                         console.log("now adding account");
                        this.gigyaService.addConnection({
                            provider: GIGYA_SOCIAL_PROVIDERS.FACEBOOK,
                            forceAuthentication: true
                        })
                            .then((response) => {
                                console.log("connection added",response)
                            })
                            .catch((errorInfo) => {
                                console.log("connection error",errorInfo)
                            });
            }).catch((err) => {
            console.log('err', err)
        });*/
    }

    public getCurrentAccessToken() {
        let accessToken = this.gigyaService.getCurrentAccessToken();

        alert("Current access token: " + JSON.stringify(accessToken, null, '\t'));
    }
}
