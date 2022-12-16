import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Search for illustration with the specified information
 * @param loginInfo Contains login credential and account information
 * @param keyword Search keyword
 * @param searchTarget (optional) Keyword matching rule
 * @param sort (optional) Sort criteria
 * @param duration (optional) Rank duration
 * @param offset (optional) Illustration order offset (starting point)
 * @param callback (optional) Callback function
 */
export default async (
    loginInfo: types.loginCredential,
    keyword: string,
    { searchTarget = "TAGS_PARTIAL", sort = "DATE_DESC", duration, offset, startDate, endDate }: {
        searchTarget?: keyof typeof enums.SEARCH_TARGET,
        sort?: keyof typeof enums.SORT,
        duration?: keyof typeof enums.DURATION,
        startDate?: string;
        endDate?: string;
        offset?: number,
    }
): Promise<types.illustration[]> => {
    const date = {
        LAST_DAY: 86400000,
        LAST_WEEK: 604800000,
        LAST_MONTH: 2592000000
    }
    var start_date = undefined, end_date = undefined;
    if (duration !== undefined) {
        start_date = common.getDate(Date.now() - date[duration]);
        end_date = common.getDate(Date.now())
    }
    if (startDate !== undefined) {
        start_date = startDate;
    }
    if (endDate !== undefined) {
        end_date = endDate;
    }
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/search/illust`,
            method: "GET",
            params: {
                word: keyword,
                search_target: enums.SEARCH_TARGET[searchTarget],
                sort: enums.SORT[sort],
                offset: offset,
                filter: enums.FILTER,
                start_date: start_date,
                end_date: end_date
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
};