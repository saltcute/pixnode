import Refresh from "./authenticate/refresh";
import Login from './authenticate/login'

/**
 * Methods about authentication
 */
export namespace authenticate {
    export const refresh = Refresh;
    export const login = Login;
}