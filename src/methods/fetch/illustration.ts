import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get detail for a illustration of the specified ID
 * @param loginInfo Contains login credential and account information
 * @param illustID Illustration ID
 * @returns Illustration detail
 */
export default async (
    loginInfo: types.loginCredential,
    illustID: number,
): Promise<types.illustration> => {
    try {
        const res = await (axios({
            url: `${enums.API_BASE_URL}/v1/illust/detail`,
            method: 'GET',
            params: {
                illust_id: illustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        console.dir(res.data, { depth: null });
        let tmp = res.data.illust;
        return common.illustToTypes(tmp);
    } catch (err) {
        return Promise.reject(err);
    }
}