import { GIGYA_METHOD, GIGYA_SOCIAL_PROVIDERS, IGigyaService } from "./interfaces/gigya.service.interface";
import { Common } from "./gigya.common";
export declare class Gigya extends Common implements IGigyaService {
    private androidApplication;
    gigyaListener$: any;
    private activity;
    constructor();
    init(gigyaApiKey?: string, dataCenter?: string): void;
    logout(): void;
    addConnection(options: {
        provider: GIGYA_SOCIAL_PROVIDERS;
        forceAuthentication?: boolean;
    }): Promise<{}>;
    private finalizeData(regToken);
    login(options: {
        provider: GIGYA_SOCIAL_PROVIDERS;
        loginID?: string;
        password?: string;
    }): Promise<{}>;
    initListener(): void;
    getCurrentAccessToken(): any;
    requestApi(methodName: GIGYA_METHOD, options: Object): Promise<{}>;
}
