import { Singleton } from "typescript-ioc";
import { AppConfig } from "../config/AppConfig";

@Singleton
export class ConfigService {

    private appConfig: AppConfig;

    public init(appConfig: AppConfig) {
        this.appConfig = appConfig;
    }

    public close() {
        // do nothing.
    }

    public config(): AppConfig {
        return this.appConfig;
    }

    

}