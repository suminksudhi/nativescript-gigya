import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule, NSModuleFactoryLoader } from "nativescript-angular/router";
import { AppComponent } from "./app.component";
import { LoginModule } from "./pages/login/login.module";
import { HomeModule } from "./pages/home/home.module";
//import { NativeScriptFacebookModule } from "nativescript-facebook/angular";
import * as application from 'tns-core-modules/application';
import { routes } from "./app.routing";
import { NavigationService } from "./services/navigation.service";
//import { init, LoginBehavior } from "nativescript-facebook";
import { NativeScriptGigyaModule } from   "nativescript-gigya/angular";

/*const appId="1597304390323957"; //"1771472059772879"  1597304390323957
application.on(application.launchEvent, function (args) {
    init(appId, LoginBehavior.LoginBehaviorNative);
});*/

@NgModule({
    bootstrap:   [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptCommonModule,
        NativeScriptGigyaModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    providers: [
        NavigationService,
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
    ],
    declarations: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class  AppModule { }
