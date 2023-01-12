import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';
import user from "./user";

/**
 * Get detail of a user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the user to be looked up
 */
export default async (
    loginInfo: types.loginCredential,
    username: string,
    sort: keyof typeof enums.SORT = 'POPULAR_DESC',
    duration: keyof typeof enums.DURATION = 'LAST_MONTH',
    offset?: number
): Promise<{
    user_previews: {
        user: {
            id: number,
            name: string,
            account: string,
            profile_image_urls: {
                medium: string
            },
            is_followed: true,
            is_Access_blocking_user: false
        },
        illusts: types.illustration[],
        novels: any[],
        is_muted: false
    }[],
    next_url: string | null
}> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/search/user`,
            method: 'GET',
            params: {
                word: username,
                sort: enums.SORT[sort],
                duration: enums.DURATION[duration],
                offset,
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