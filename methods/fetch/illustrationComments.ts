import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get comments of illustration of specified ID
 * @param loginInfo Contains login credential and account information
 * @param illustID Illustration ID
 * @param offset (optional) Comment order offset (starting point)
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    illustID: string,
    { offset, includeTotalComments = "false" }: {
        offset?: number,
        includeTotalComments?: "true" | "false"
    },
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/illust/comments`,
        type: 'GET',
        data: {
            illust_id: illustID,
            offset: offset,
            include_total_comments: includeTotalComments
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.ACCEPT_LANGUAGE
        },
        success: (data: string) => {
            let tmp = JSON.parse(data).comments;
            let res = new Array<types.comment>();
            for (let val of tmp) {
                res.push(common.commentToTypes(val, JSON.stringify(val.parent_comment) == "{}" ? "false" : "true"));
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    });
}