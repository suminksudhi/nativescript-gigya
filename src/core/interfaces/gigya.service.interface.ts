export enum GIGYA_METHOD{
    SET_STATUS="socialize.setStatus",
    FINALIZE_REGISTRATION="accounts.finalizeRegistration",
    LOGIN="accounts.login",
    ADD_CONNECTION="socialize.addConnection",
    LINK_ACCOUNT="accounts.linkAccounts"
}

export enum GIGYA_AUTH_STATUS{
    LOGGED_IN="LOGGED_IN",
    LOGGED_ERR="LOGGED_ERR",
    LOGGED_OUT="LOGGED_OUT",
    CONNECTION_ADDED="CONNECTION_ADDED",
    CONNECTION_REMOVED="CONNECTION_REMOVED",
    API_SUCCESS="API_SUCCESS",
    API_ERROR="API_ERROR",
    REG_ERROR="REG_ERROR",
    REG_SUCCESS="REG_SUCCESS"
}

export  enum GIGYA_SOCIAL_PROVIDERS{
    SITE="site",
    FACEBOOK="facebook",
    GOOGLE="googleplus"
}

export interface IConnectionOptions{
    provider: GIGYA_SOCIAL_PROVIDERS,
    forceAuthentication?: boolean
}

export interface ILoginOptions{
    provider: GIGYA_SOCIAL_PROVIDERS,
    loginID?: string,
    password?: string
}

export interface IGigyaService {
    /**
     * initializes the gigya instance
     */
    init(gigyaApiKey?: string, dataCenter?: string): void;

    /**
     * logs user out and clears the session
     */
    logout(): void;

    /**
     * used to logs user in
     * @param {ILoginOptions} options
     */
    login(options: ILoginOptions): void;

    /**
     * used to connect the user
     * @param {IConnectionOptions} options
     */
    addConnection(options: IConnectionOptions): void;
}