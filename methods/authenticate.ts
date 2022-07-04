import * as Refresh from "./authenticate/refresh";
import * as Login from './authenticate/login'

/**
 * Methods about authentication
 */
export namespace authenticate {
    export const refresh = Refresh.main;
    export const login = Login.main;
}