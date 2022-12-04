import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get detail of a user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the user to be looked up
 */
export default async (
    loginInfo: types.loginCredential,
    userID: number
): Promise<any> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/user/detail`,
            method: 'GET',
            params: {
                user_id: userID,
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        return res.data;
    } catch (err) {
        return Promise.reject(err);
    }
}