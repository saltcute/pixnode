import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get comments of illustration of specified ID
 * @param loginInfo Contains login credential and account information
 * @param illustID Illustration ID
 * @param offset (optional) Comment order offset (starting point)
 */
export default async (
    loginInfo: types.loginCredential,
    illustID: number,
    { offset, includeTotalComments = "false" }: {
        offset?: number,
        includeTotalComments?: "true" | "false"
    }
): Promise<types.comment[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/illust/comments`,
            method: 'GET',
            params: {
                illust_id: illustID,
                offset: offset,
                include_total_comments: includeTotalComments
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));

        let tmp = res.data.comments;
        let data = new Array<types.comment>();
        for (let val of tmp) {
            data.push(common.commentToTypes(val, JSON.stringify(val.parent_comment) == "{}" ? "false" : "true"));
        }
        return data;
    } catch (err) {
        return Promise.reject(err);
    }
}