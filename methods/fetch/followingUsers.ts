import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get an list of user that is followed by the given user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param visibility (Default: Public) Visibility of following user
 * @param offset (optional) User order number offset (starting point)
 * @returns Array of object container user detail and their illustration information
 */
export default async (
    loginInfo: types.loginCredential,
    userID: number,
    { visibility = "PUBLIC", offset }: {
        visibility?: keyof typeof enums.VISIBILITY,
        offset?: number
    }
): Promise<{ user: types.userInformation, illust: types.illustration[] }[]> => {
    try {
        const res = await (axios({
            url: `${enums.API_BASE_URL}/v1/user/following`,
            method: 'GET',
            params: {
                user_id: userID,
                restrict: enums.VISIBILITY[visibility],
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = res.data.user_previews;
        let data = new Array();
        for (let val of tmp) {
            data.push({
                user: new types.userInformation(
                    val.user.id,
                    val.user.name,
                    val.user.account
                ),
                illust: (() => {
                    let rt = new Array<types.illustration>();
                    for (let value of val.illusts) {
                        rt.push(common.illustToTypes(value));
                    }
                    return rt;
                })()
            })
        }
        return data;
    } catch (err) {
        return Promise.reject(err);
    }
}