import crypto = require('crypto');
import base64url from 'base64url';
import { callbackify } from 'util';
import { off } from 'process';
const readlineSync = require('readline-sync');
const najax = require('najax');

export namespace enums {
    /**
     * Type of content returned by Pixiv
     */
    export const CONTENT_TYPE = {
        ILLUSTRATION: "illust",
        MANGA: "manga",
        UGOIRA: "ugoira",
        NOVEL: "novel"
    }
    /**
     * Max age of returned content
     */
    export const DURATION = {
        LAST_DAY: "within_last_day",
        LAST_WEEK: "within_last_week",
        LAST_MONTH: "within_last_month"
    }
    /**
     * Period of ranking
     */
    export const RANKING_MODE = {
        DAY: "day",
        WEEK: "week",
        MONTH: "month",
        DAY_MALE: "day_male",
        DAY_FEMALE: "day_female",
        WEEK_ORIGINAL: "week_original",
        WEEK_ROOKIE: "week_rookie",
        DAY_MANGA: "day_manga"
    }
    /**
     * Search option
     * - Match option of tags or search for title
     */
    export const SEARCH_TARGET = {
        TAGS_PARTIAL: "partial_match_for_tags",
        TAGS_EXACT: "exact_match_for_tags",
        TITLE_AND_CAPTION: "title_and_caption"
    }
    /**
     * Different size of returned image
     */
    export const SIZE = {
        LARGE: "large",
        MEDIUM: "medium",
        ORIGINAL: "original",
        SQUARE_MEDIUM: "square_medium"
    }
    /**
     * Sort method of returned contents
     */
    export const SORT = {
        DATE_DESC: "date_desc",
        DATE_ASC: "date_asc"
    }
    /**
     * Visibility of certain user feature (bookmark, etc.)
     */
    export const VISIBILITY = {
        PUBLIC: "public",
        PRIVATE: "private"
    }

    export const FILTER = "for_ios";
    export const AUTH_URL = "https://oauth.secure.pixiv.net/auth/token";
    export const API_BASE_URL = "https://app-api.pixiv.net";
    export const USER_AGENT = "PixivAndroidApp/5.0.234 (Android 11; Pixel 5)";
    export const CLIENT_ID = "MOBrBDS8blbauoSck0ZfDbtuzpyT";
    export const CLIENT_SECRET = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj";
}

namespace types {
    export class loginCredential {
        constructor(
            _access_token: string,
            _refresh_token: string,
            _expire_time: number,
            _user: accountInfomation
        ) {
            this.access_token = _access_token;
            this.refresh_token = _refresh_token;
            this.expire_time = _expire_time;
            this.user = _user;
        }
        access_token: string;
        refresh_token: string;
        expire_time: number;
        user: accountInfomation;
    }
    export class userInfomation {
        constructor(
            _uid: number,
            _name: string,
            _account: string
        ) {
            this.uid = _uid;
            this.name = _name;
            this.account = _account;
        }
        uid: number;
        name: string;
        account: string;
    }
    export class accountInfomation extends userInfomation {
        constructor(
            _uid: number,
            _name: string,
            _account: string,
            _mail: string,
            _is_premium: boolean,
            _x_restrict: number,
            _language: string
        ) {
            super(_uid, _name, _account);
            this.mail = _mail;
            this.is_premium = _is_premium;
            this.x_restrict = _x_restrict;
            this.language = _language;
        }
        mail: string;
        is_premium: boolean;
        x_restrict: number;
        language: string;
    }
    export class profileInfomation extends userInfomation {

    }
    export class tag {
        constructor(
            _name: string,
            _translated_name: string
        ) {
            this.name = _name;
            this.translated_name = _translated_name;
        }
        name: string;
        translated_name: string;
    }
    export class illustration {
        constructor(
            _id: number,
            _title: string,
            _type: string,
            _caption: string,
            _restrict: number,
            _user: userInfomation,
            _tags: Array<tag>,
            _create_date: string,
            _page_count: number,
            _sanity_level: number,
            _x_restrict: number,
            _is_bookmarked: boolean,
        ) {
            this.id = _id;
            this.title = _title;
            this.type = _type;
            this.caption = _caption;
            this.restrict = _restrict;
            this.user = _user;
            this.tags = _tags;
            this.create_date = _create_date;
            this.page_count = _page_count;
            this.sanity_level = _sanity_level;
            this.x_restrict = _x_restrict;
            this.is_bookmarked = _is_bookmarked;
        }
        id: number;
        title: string;
        type: string;
        caption: string;
        restrict: number;
        user: userInfomation;
        tags: Array<tag>;
        create_date: string;
        page_count: number;
        sanity_level: number;
        x_restrict: number;
        is_bookmarked: boolean;
    }
    export class comment {
        constructor(
            _id: number,
            _comment: string,
            _date: string,
            _user: userInfomation,
            _parent_comment?: comment
        ) {
            this.id = _id;
            this.comment = _comment;
            this.date = _date;
            this.user = _user;
            this.parent_comment = _parent_comment;
        }
        id: number;
        comment: string;
        date: string;
        user: userInfomation;
        parent_comment?: comment;
    }
}

/**
 * Common items shared between multiple methods
 * `CLIENT_ID`, `CLIENT_SECRET`, etc.
 */
namespace common {
    /**
     * Generate a safe base64 string token that is URL-safe
     * @param size Determines how many bytes of data is to be generated
     * @returns URL-safe base64 string
     */
    export function tokenBase64(size: number): string {
        return base64url(crypto.randomBytes(size));
    }
    /**
     * Convert illustration to its coresponding type
     * @param val Object contains illustration infomation from Pixiv responses
     * @returns Illustration object
     */
    export function illustToTypes(val: any): types.illustration {
        return new types.illustration(
            val.id,
            val.title,
            val.type,
            val.caption,
            val.restrict,
            new types.userInfomation(
                val.user.id,
                val.user.name,
                val.user.account
            ),
            val.tags,
            val.create_date,
            val.page_count,
            val.sanity_level,
            val.x_restrict,
            val.is_bookmarked
        );
    }
    /**
     * Convert comment to its coresponding type
     * @param val Object contains comment infomation from Pixiv responses
     * @returns comment object
     */
    export function commentToTypes(
        val: any, 
        hasParentComment: "true" | "false"
    ): types.comment {
        return new types.comment(
            val.id,
            val.comment,
            val.date,
            new types.userInfomation(
                val.user.id,
                val.user.name,
                val.user.account
            ),
            hasParentComment == "true" ? commentToTypes(val.parent_comment, "false") : undefined
        );
    }
    export function tagToTypes(val: any): types.tag {
        return new types.tag(
            val.name,
            val.translated_name
        );
    }
}
/**
 * Methods to authenticate user
 */
export namespace authenticate {
    /**
     * Login with browser to a pixiv account
     * @param callback (optional) Callback function
     */
    export function login(
        callback?: (res?: object, err?: object) => any
    ): void {
        let pullUpURL: string;
        let code_verifier = common.tokenBase64(32);
        let code_challenge = crypto.createHash('sha256').update(code_verifier).digest('base64').split('/').join('_').split('+').join('-').split('=').join('');
        let LOGIN_PARAMS = {
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "client": "pixiv-android"
        }
        console.log("Please copy the URL below to browser and proceed to login as you would usually do.");
        console.log(`${enums.API_BASE_URL}/web/v1/login?${new URLSearchParams(LOGIN_PARAMS).toString()}`);
        console.log("When you see a blank page page, press F12 or Ctrl + Shift + I (Command + Option + I on mac)");
        console.log(`Switch to "Console" tab and you will see an error shows:`);
        console.log(`"Failed to launch 'pixiv://...' because the scheme does not have a registered handler"`)
        while (true) {
            pullUpURL = readlineSync.question(`Copy the link starts with "pixiv://" and paste it here: `)
            if (pullUpURL.search("pixiv://account/login") == -1) {
                console.log(`The URL (${pullUpURL}) is not correct. Please try again.`);
            } else break;
        }
        let AUTH_CODE = new URLSearchParams(pullUpURL.substring(21)).get('code');
        // console.log(AUTH_CODE);
        najax({
            url: enums.AUTH_URL,
            type: 'POST',
            data: {
                'client_id': enums.CLIENT_ID,
                'client_secret': enums.CLIENT_SECRET,
                'code': AUTH_CODE,
                'code_verifier': code_verifier,
                'grant_type': "authorization_code",
                'include_policy': true,
                'redirect_uri': `${enums.API_BASE_URL}/web/v1/users/auth/pixiv/callback`
            },
            headers: {
                'User-Agent': enums.USER_AGENT
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data);
                let res = new types.loginCredential(
                    tmp.access_token,
                    tmp.refresh_token,
                    tmp.expires_in + Math.floor(Date.now() / 1000),
                    new types.accountInfomation(
                        tmp.user.id,
                        tmp.user.name,
                        tmp.user.account,
                        tmp.user.mail,
                        tmp.user.is_premium,
                        tmp.user.x_restrict,
                        tmp.user.language
                    )
                )
                if (callback !== undefined) callback(res);
            }
        }).error((err: object): void => {
            if (callback !== undefined) callback(err)
        });
    }
    /**
     * To get a new login session of current user
     * @param refresh_token Refresh token of user
     * @param callback (optional) Callback function
     */
    export function refresh(
        refresh_token: string,
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: enums.AUTH_URL,
            type: "POST",
            data: {
                'client_id': enums.CLIENT_ID,
                'client_secret': enums.CLIENT_SECRET,
                'grant_type': "refresh_token",
                'include_policy': true,
                'refresh_token': refresh_token
            },
            headers: {
                'User-Agent': enums.USER_AGENT
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data);
                let res = new types.loginCredential(
                    tmp.access_token,
                    tmp.refresh_token,
                    tmp.expires_in + Math.floor(Date.now() / 1000),
                    new types.accountInfomation(
                        tmp.user.id,
                        tmp.user.name,
                        tmp.user.account,
                        tmp.user.mail_address,
                        tmp.user.is_premium,
                        tmp.user.x_restrict,
                        "English"
                    )
                )
                if (callback !== undefined) callback(res);
            }
        }).error((err: any): void => {
            if (callback !== undefined) callback(err)
        });
    }
}

/**
 * Methods to fetch infomation (ranking, illutration info, etc.)
 */
export namespace fetch {
    /**
     * Get most popular illustration in certain day, month, year, etc.
     * @param loginInfo Contains login credential and account infomation 
     * @param mode (optional) Ranking mode
     * @param date (optional) Ranking date
     * @param offset (optional) Illustration ranking offset (starting point)
     * @param callback (optional) Callback function
     */
    export function illustrationRanking(
        loginInfo: types.loginCredential,
        { mode = "DAY", date, offset }: {
            mode: keyof typeof enums.RANKING_MODE,
            date?: string,
            offset?: string
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/illust/ranking`,
            type: "GET",
            data: {
                'mode': enums.RANKING_MODE[mode],
                'data': date,
                'offset': offset,
                'filter': enums.FILTER,
            },
            headers: {
                'User-Agent': enums.USER_AGENT,
                'Authorization': `Bearer ${loginInfo.access_token}`,
                'Accept-Language': "English"
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val))
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object): void => {
            if (callback !== undefined) callback(err)
        });
    }
    /**
     * Search for illustration with the specified infomation
     * @param loginInfo Contains login credential and account infomation
     * @param keyword Search keyword
     * @param searchTarget (optional) Keyword matching rule
     * @param sort (optional) Sort criteria
     * @param duration (optional) Rank duration
     * @param offset (optional) Illustration order offset (starting point)
     * @param callback (optional) Callback function
     */
    export function searchForIllustration(
        loginInfo: types.loginCredential,
        keyword: string,
        { searchTarget = "TAGS_PARTIAL", sort = "DATE_DESC", duration, offset }: {
            searchTarget: keyof typeof enums.SEARCH_TARGET,
            sort: keyof typeof enums.SORT,
            duration?: string,
            offset?: number
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/search/illust`,
            data: {
                word: keyword,
                search_target: enums.SEARCH_TARGET[searchTarget],
                sort: enums.SORT[sort],
                duration: duration,
                offset: offset,
                filter: enums.FILTER,
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val))
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        });
    };
    /**
     * Get detail for a illustration of the specified ID
     * @param loginInfo Contains login credential and account infomation
     * @param illustID Illustration ID
     * @param callback (optional) Callback function
     */
    export function illustration(
        loginInfo: types.loginCredential,
        illustID: string,
        callback?: (res?: object, err?: object) => any
    ) {
        najax({
            url: `${enums.API_BASE_URL}/v1/illust/detail`,
            type: 'GET',
            data: {
                illust_id: illustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data).illust;
                let res = common.illustToTypes(tmp);
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        });
    }
    /**
     * Get comments of illustration of specified ID
     * @param loginInfo Contains login credential and account infomation
     * @param illustID Illustration ID
     * @param offset (optional) Comment order offset (starting point)
     * @param callback (optional) Callback function
     */
    export function illustrationComments(
        loginInfo: types.loginCredential,
        illustID: string,
        { offset, includeTotalComments = "false" }: {
            offset: string,
            includeTotalComments: "true" | "false"
        },
        callback?: (res?: object, err?: object) => any
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
                "Accept-Language": "English"
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
            if (callback !== undefined) callback(err);
        });
    }
    /**
     * Get related illustration of the illustration of the specified ID
     * @param loginInfo Contains login credentials and account infomation
     * @param illustID Illustration ID
     * @param offset (optional) Illustration order offset (starting point)
     * @param callback (optional) Callback function
     */
    export function relatedIllustration(
        loginInfo: types.loginCredential,
        illustID: string,
        { offset }: { 
            offset?: string 
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v2/illust/related`,
            type: "GET",
            data: {
                illust_id: illustID,
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val))
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        });
    }
    /**
     * Get new illustrations form following creators
     * @param loginInfo Contains login credentials and account infomation
     * @param visibility (Default: Public) Shows illustrations from publicly or privately followed creators
     * @param callback (optional) Callback function
     */
    export function illustrationFromFollowingCreators(
        loginInfo: types.loginCredential,
        { visibility = "PUBLIC", offset }: {
            visibility: keyof typeof enums.VISIBILITY,
            offset?: string
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v2/illust/follow`,
            type: "GET",
            data: {
                restrict: enums.VISIBILITY[visibility],
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val))
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        });
    }
    /**
     * Get recommended illustration
     * @param loginInfo Contains login credentials and account infomation
     * @param contentType (optional) Type of content (illustration, manga, etc.)
     * @param includeRankingIllustration (Defualt: false) Include top 10 illustration of the day in response
     * @param maxBookmarkIDForRecommend (optional) 
     * @param minBookmarkIDForRecentIllustrations (optional) 
     * @param offset (optional) Illustration offset (starting point)
     * @param bookmarkIllustIDs (optional) An array containing illustration IDs
     * @param includeRankingLabel (Default: true) Whether to include ranking label or not
     * @param callback (optional) Callback function
     */
    export function recommendedIllustration(
        loginInfo: types.loginCredential,
        { contentType, includeRankingIllustration = "false", maxBookmarkIDForRecommend, minBookmarkIDForRecentIllustrations, offset, bookmarkIllustIDs, includeRankingLabel = "true" }: {
            contentType?: keyof typeof enums.CONTENT_TYPE,
            includeRankingIllustration: "false" | "true",
            maxBookmarkIDForRecommend?: number,
            minBookmarkIDForRecentIllustrations?: number,
            offset?: number,
            bookmarkIllustIDs?: [],
            includeRankingLabel: "false" | "true"
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        let bookmarkIllustID = bookmarkIllustIDs?.join(",");
        najax({
            url: `${enums.API_BASE_URL}/v1/illust/recommended`,
            type: "GET",
            data: {
                content_type: contentType,
                include_ranking_label: includeRankingLabel,
                max_bookmark_id_for_recommend: maxBookmarkIDForRecommend,
                min_bookmark_id_for_recent_illust: minBookmarkIDForRecentIllustrations,
                offset: offset,
                include_ranking_illusts: includeRankingIllustration,
                bookmark_illust_ids: bookmarkIllustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val))
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Get current trending tags
     * @param loginInfo Contains login credentials and account infomation
     * @param callback (optional) Callback function
     */
    export function trendingTags(
        loginInfo: types.loginCredential,
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/trending-tags/illust`,
            type: "GET",
            data: {
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data);
                let res = new Array()
                for (let val of tmp.trend_tags) {
                    res.push({
                        tag: new types.tag(
                            val.tag,
                            val.translated_name,
                        ),
                        illust: common.illustToTypes(val.illust)
                    })
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Check if a specified illustration is bookmarked by current user
     * @param loginInfo Contains login credentials and account infomation
     * @param illustID ID of the specified illustration
     * @param callback (optional) Callback function
     */
    export function bookmark(
        loginInfo: types.loginCredential,
        illustID: string,
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v2/illust/bookmark/detail`,
            type: "GET",
            data: {
                illust_id: illustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let tmp = JSON.parse(data).bookmark_detail;
                if (callback !== undefined) callback({
                    is_bookmarked: tmp.is_bookmarked,
                    tags: (() => {
                        let res = new Array<types.tag>();
                        for (let val of tmp.tags) {
                            res.push(common.tagToTypes(val));
                        }
                        return res;
                    })(),
                    restrict: tmp.restrict
                });
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Get detail of a user
     * @param loginInfo Contains login credentials and account infomation
     * @param userID ID of the user to be looked up
     * @param callback (optional) Callback function
     */
    export function user(
        loginInfo: types.loginCredential,
        userID: number,
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/user/detail`,
            type: "GET",
            data: {
                user_id: userID,
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string): void => {
                let res = JSON.parse(data);

                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Get illustrations published by the specified user
     * @param loginInfo Contains login credentials and account infomation
     * @param userID User ID
     * @param contentType (optional) Content type
     * @param offset (optional) Response order offset
     * @param callback (optional) Callback function
     */
    export function userIllustrations(
        loginInfo: types.loginCredential,
        userID: number,
        { contentType, offset }: {
            contentType?: keyof typeof enums.CONTENT_TYPE,
            offset?: string
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/user/illusts`,
            type: "GET",
            data: {
                user_id: userID,
                type: contentType,
                offset: offset,
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for(let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                } 
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Get bookmarked illustrations of the specified user
     * @param loginInfo Contains login credentials and account infomation
     * @param userID ID of the specified user
     * @param visibility (Default: PUBLIC) Visibility of bookmarks
     * @param maxBookmarkID (optional) Max ID number of bookmarks in response
     * @param tag (optional) Bookmark tag 
     * @param callback (optional) Callback function
     */
    export function userBookmarkIllustration(
        loginInfo: types.loginCredential,
        userID: number,
        { visibility = "PUBLIC", maxBookmarkID, tag }: {
            visibility: keyof typeof enums.VISIBILITY,
            maxBookmarkID?: number,
            tag?: string
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/user/bookmarks/illust`,
            type: "GET",
            data: {
                user_id: userID,
                restrict: enums.VISIBILITY[visibility],
                max_bookmark_id: maxBookmarkID,
                tag: tag
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data);
                let res = new Array<types.illustration>();
                for(let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Get bookmark tags of the specified user
     * @param loginInfo Contains login credentials and account infomation
     * @param userID ID of the specified user
     * @param visibility (Default: Public) Visibility of bookmarks
     * @param offset (optional) Bookmark tags order number offset
     * @param callback (optional) Callback function
     */
    export function userBookmarkTags(
        loginInfo: types.loginCredential,
        userID: number,
        { visibility = "PUBLIC", offset }: {
            visibility: keyof typeof enums.VISIBILITY,
            offset?: number
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/user/bookmark-tags/illust`,
            type: "GET",
            data: {
                user_id: userID,
                restrict: enums.VISIBILITY[visibility],
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string): void => {
                let res = JSON.parse(data);

                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Get an list of user that is followed by the current user
     * @param loginInfo Contains login credentials and account infomation
     * @param userID ID of the specified user
     * @param visibility (Default: Public) Visibility of following user
     * @param offset (optional) User order number offset (starting point)
     * @param callback (optional) Callback function
     */
    export function followingUser(
        loginInfo: types.loginCredential,
        userID: number,
        { visibility = "PUBLIC", offset }: {
            visibility: keyof typeof enums.VISIBILITY,
            offset?: number
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/user/following`,
            type: "GET",
            data: {
                user_id: userID,
                restrict: enums.VISIBILITY[visibility],
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data).user_previews;
                let res = new Array();
                for(let val of tmp) {
                    res.push({
                        user: new types.userInfomation(
                            val.user.id,
                            val.user.name,
                            val.user.account
                        ),
                        illust: (() => {
                            let rt = new Array<types.illustration>();
                            for(let value of val.illusts) {
                                rt.push(common.illustToTypes(value));
                            }
                            return rt;
                        })()
                    })
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
     /**
     * Get an list of user that is following the current user
     * @param loginInfo Contains login credentials and account infomation
     * @param userID ID of the specified user
     * @param offset (optional) User order number offset (starting point)
     * @param callback (optional) Callback function
     */
    export function followers(
        loginInfo: types.loginCredential,
        { offset }: {
            offset?: number
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v1/user/follower`,
            type: "GET",
            data: {
                offset: offset,
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string): void => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for(let val of tmp.user_previews) {
                    res.push({
                        user: new types.userInfomation(
                                val.user.id,
                                val.user.name,
                                val.user.account
                            ),
                        illust: (() => {
                            let rt = new Array<types.illustration>();
                            for(let value of val.illusts) {
                                rt.push(common.illustToTypes(value));
                            }
                            return rt;
                        })()
                    });
                }
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
}
export namespace modify {
    /**
     * Add an illustration to bookmark
     * @param loginInfo Contains login credentials and account infomation
     * @param illustID ID of the illustration to be added to bookmark
     * @param visibility (Default: PUBLIC) Visibility of the specified illustration in bookmark
     * @param tags (optional) Bookmark tags of the specified illustration
     * @param callback (optional) Callback function
     */
    export function addBookmark(
        loginInfo: types.loginCredential,
        illustID: string,
        { visibility = "PUBLIC", tags }: {
            visibility: keyof typeof enums.VISIBILITY,
            tags?: Array<string>
        },
        callback?: (res?: object, err?: object) => any
    ): void {
        let tag = tags?.join(" ");
        najax({
            url: `${enums.API_BASE_URL}/v2/illust/bookmark/add`,
            type: "POST",
            data: {
                illust_id: illustID,
                restrict: enums.VISIBILITY[visibility],
                "tags[]": tag
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let res = JSON.parse(data);
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
    /**
     * Remove an illustration from bookmark
     * @param loginInfo Contains login credentials and account infomation
     * @param illustID ID of the illustration to be deleted
     * @param callback (optional) Callback function
     */
    export function deleteBookmark(
        loginInfo: types.loginCredential,
        illustID: string,
        callback?: (res?: object, err?: object) => any
    ): void {
        najax({
            url: `${enums.API_BASE_URL}/v2/illust/bookmark/delete`,
            type: "POST",
            data: {
                illust_id: illustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data: string) => {
                let res = JSON.parse(data);
                if (callback !== undefined) callback(res);
            }
        }).error((err: object) => {
            if (callback !== undefined) callback(err);
        })
    }
}