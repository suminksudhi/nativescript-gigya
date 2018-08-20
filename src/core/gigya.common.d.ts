import { Observable } from 'tns-core-modules/data/observable';
import { IConnectionOptions, IGigyaService, ILoginOptions } from "./interfaces";
export declare class Common extends Observable implements IGigyaService {
    constructor();
    init(gigyaApiKey?: string, dataCenter?: string): void;
    logout(): void;
    login(options: ILoginOptions): void;
    addConnection(options: IConnectionOptions): void;
}
export declare class Utils {
    static SUCCESS_MSG(): string;
}
