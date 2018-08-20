import {Observable} from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import {IConnectionOptions, IGigyaService, ILoginOptions} from "./interfaces";


export class Common extends Observable implements IGigyaService {


    constructor() {
        super();
    }

    init(gigyaApiKey?: string, dataCenter?: string) {
    }

    logout() {
    }

    login(options: ILoginOptions) {
    }

    addConnection(options: IConnectionOptions) {
    }


}

export class Utils {
    public static SUCCESS_MSG(): string {
        let msg = `Your plugin is working on ${app.android ? 'Android' : 'iOS'}.`;

        setTimeout(() => {
            dialogs.alert(`${msg} For real. It's really working :)`).then(() => console.log(`Dialog closed.`));
        }, 2000);

        return msg;
    }
}
