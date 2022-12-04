import CommentToTypes from "./common/commentToTypes";
import IllustToTypes from "./common/illustToTypes";
import TokenBase64 from "./common/tokenBase64";
import TagToTypes from "./common/tagToTypes";
import GetDate from './common/getDate'

import { enums } from '../constants/enums'

/**
 * Common items shared between multiple methods
 * `CLIENT_ID`, `CLIENT_SECRET`, etc.
 */
export namespace common {
    export const commentToTypes = CommentToTypes;
    export const illustToTypes = IllustToTypes;
    export const tokenBase64 = TokenBase64;
    export const tagToTypes = TagToTypes;
    export const getDate = GetDate;

    export function setLanguage(str: "zh-cn" | "zh-tw" | "en-us" | "ja-jp" | "ko-kr"): void {
        enums.ACCEPT_LANGUAGE = str;
    }
}