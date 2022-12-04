import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get new illustrations form following creators
 * @param loginInfo Contains login credentials and account information
 * @param visibility (Default: Public) Shows illustrations from publicly or privately followed creators
 */
export default async (
    loginInfo: types.loginCredential,
    { visibility = "PUBLIC", offset }: {
        visibility?: keyof typeof enums.VISIBILITY,
        offset?: number
    }
): Promise<types.illustration[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v2/illust/follow`,
            method: 'GET',
            params: {
                restrict: enums.VISIBILITY[visibility],
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = new Array<types.illustration>();
        for (let val of res.data.illusts) {
            tmp.push(common.illustToTypes(val))
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}