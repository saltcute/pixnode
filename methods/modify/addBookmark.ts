import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
const najax = require('najax');

/**
 * Add an illustration to bookmark
 * @param loginInfo Contains login credentials and account information
 * @param illustID ID of the illustration to be added to bookmark
 * @param visibility (Default: PUBLIC) Visibility of the specified illustration in bookmark
 * @param tags (optional) Bookmark tags of the specified illustration
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    illustID: string,
    { visibility = "PUBLIC", tags }: {
        visibility: keyof typeof enums.VISIBILITY,
        tags?: Array<string>
    },
    callback?: (res: object, err?: object) => any
): void {
    let tag = tags?.join(" ");
    najax({
        url: `${enums.API_BASE_URL}/v2/illust/bookmark/add`,
        type: "POST",
        data: {
            illust_id: illustID,
            restrict: enums.VISIBILITY[visibility],
            "tags[]": tag
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": "English"
        },
        success: (data: string) => {
            let res = JSON.parse(data);
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    })
}