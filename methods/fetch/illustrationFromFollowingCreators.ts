import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get new illustrations form following creators
 * @param loginInfo Contains login credentials and account information
 * @param visibility (Default: Public) Shows illustrations from publicly or privately followed creators
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    { visibility = "PUBLIC", offset }: {
        visibility?: keyof typeof enums.VISIBILITY,
        offset?: number
    },
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v2/illust/follow`,
        type: "GET",
        data: {
            restrict: enums.VISIBILITY[visibility],
            offset: offset
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.acceptLanguage()
        },
        success: (data: string) => {
            let tmp = JSON.parse(data);
            let res = new Array<types.illustration>();
            for (let val of tmp.illusts) {
                res.push(common.illustToTypes(val))
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    });
}