import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get an list of user that is following the current user
 * @param loginInfo Contains login credentials and account information
 * @param offset (optional) User order number offset (starting point)
 * @returns Array of object container user detail and their illustration information
 */
export default async (
    loginInfo: types.loginCredential,
    { offset }: {
        offset?: number
    }
): Promise<{ user: types.userInformation, illust: types.illustration[] }[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/user/follower`,
            method: 'GET',
            params: {
                offset: offset,
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = new Array();
        for (let val of res.data.user_previews) {
            tmp.push({
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
            });
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}