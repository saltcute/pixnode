"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = exports.authenticate = exports.enums = void 0;
const crypto = require("crypto");
const base64url_1 = __importDefault(require("base64url"));
const readlineSync = require('readline-sync');
const najax = require('najax');
var enums;
(function (enums) {
    /**
     * Type of content returned by Pixiv
     */
    enums.CONTENT_TYPE = {
        ILLUSTRATION: "illust",
        MANGA: "manga",
        UGOIRA: "ugoira",
        NOVEL: "novel"
    };
    /**
     * Max age of returned content
     */
    enums.DURATION = {
        LAST_DAY: "within_last_day",
        LAST_WEEK: "within_last_week",
        LAST_MONTH: "within_last_month"
    };
    /**
     * Period of ranking
     */
    enums.RANKING_MODE = {
        DAY: "day",
        WEEK: "week",
        MONTH: "month",
        DAY_MALE: "day_male",
        DAY_FEMALE: "day_female",
        WEEK_ORIGINAL: "week_original",
        WEEK_ROOKIE: "week_rookie",
        DAY_MANGA: "day_manga"
    };
    /**
     * Search option
     * - Match option of tags or search for title
     */
    enums.SEARCH_TARGET = {
        TAGS_PARTIAL: "partial_match_for_tags",
        TAGS_EXACT: "exact_match_for_tags",
        TITLE_AND_CAPTION: "title_and_caption"
    };
    /**
     * Different size of returned image
     */
    enums.SIZE = {
        LARGE: "large",
        MEDIUM: "medium",
        ORIGINAL: "original",
        SQUARE_MEDIUM: "square_medium"
    };
    /**
     * Sort method of returned contents
     */
    enums.SORT = {
        DATE_DESC: "date_desc",
        DATE_ASC: "date_asc"
    };
    /**
     * Visibility of certain user feature (bookmark, etc.)
     */
    enums.VISIBILITY = {
        PUBLIC: "public",
        PRIVATE: "private"
    };
    enums.FILTER = "for_ios";
    enums.AUTH_URL = "https://oauth.secure.pixiv.net/auth/token";
    enums.API_BASE_URL = "https://app-api.pixiv.net";
    enums.USER_AGENT = "PixivAndroidApp/5.0.234 (Android 11; Pixel 5)";
    enums.CLIENT_ID = "MOBrBDS8blbauoSck0ZfDbtuzpyT";
    enums.CLIENT_SECRET = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj";
})(enums = exports.enums || (exports.enums = {}));
/**
 * Common items shared between multiple methods
 * `CLIENT_ID`, `CLIENT_SECRET`, etc.
 */
var common;
(function (common) {
    /**
     * Generate a safe base64 string token that is URL-safe
     * @param size Determines how many bytes of data is to be generated
     * @returns URL-safe base64 string
     */
    function tokenBase64(size) {
        return (0, base64url_1.default)(crypto.randomBytes(size));
    }
    common.tokenBase64 = tokenBase64;
})(common || (common = {}));
/**
 * Methods to authenticate user
 */
var authenticate;
(function (authenticate) {
    /**
     * Login with browser to a pixiv account
     * @param callback
     */
    function login(callback) {
        let pullUpURL;
        let code_verifier = common.tokenBase64(32);
        let code_challenge = crypto.createHash('sha256').update(code_verifier).digest('base64').split('/').join('_').split('+').join('-').split('=').join('');
        let LOGIN_PARAMS = {
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "client": "pixiv-android"
        };
        console.log("Please copy the URL below to browser and proceed to login as you would usually do.");
        console.log(`${enums.API_BASE_URL}/web/v1/login?${new URLSearchParams(LOGIN_PARAMS).toString()}`);
        console.log("When you see a blank page page, press F12 or Ctrl + Shift + I (Command + Option + I on mac)");
        console.log(`Switch to "Console" tab and you will see an error shows:`);
        console.log(`"Failed to launch 'pixiv://...' because the scheme does not have a registered handler"`);
        while (true) {
            pullUpURL = readlineSync.question(`Copy the link starts with "pixiv://" and paste it here: `);
            if (pullUpURL.search("pixiv://account/login") == -1) {
                console.log(`The URL (${pullUpURL}) is not correct. Please try again.`);
            }
            else
                break;
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
            success: (data) => {
                let res = JSON.parse(data);
                res = {
                    access_token: res.access_token,
                    refresh_token: res.refresh_token,
                    expire_time: res.expires_in + Math.floor(Date.now() / 1000),
                    user: res.user,
                };
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    authenticate.login = login;
    /**
     * To get a new login session of current user
     * @param refresh_token Refresh token of user
     * @param callback Callback function
     */
    function refresh(refresh_token, callback) {
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
            success: (data) => {
                let res = JSON.parse(data);
                res = {
                    access_token: res.access_token,
                    refresh_token: res.refresh_token,
                    expire_time: res.expires_in + Math.floor(Date.now() / 1000),
                    user: res.user,
                };
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    authenticate.refresh = refresh;
})(authenticate = exports.authenticate || (exports.authenticate = {}));
/**
 * Methods to fetch infomation (ranking, illutration info, etc.)
 */
var fetch;
(function (fetch) {
    /**
     * Get most popular illustration in certain day, month, year, etc.
     * @param loginInfo Contains login credential and user infomation
     * @param mode Ranking mode
     * @param date Ranking date
     * @param offset Illustration order offest
     * @param callback Callback function
     */
    function illustrationRanking(loginInfo, mode, date, offset, callback) {
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
            success: (data) => {
                let res = JSON.parse(data);
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.illustrationRanking = illustrationRanking;
    /**
     * Search for illustration with given infomation
     * @param loginInfo Contains login credential and user infomation
     * @param keyword Search keyword
     * @param searchTarget Keyword matching rule
     * @param sort Sort criteria
     * @param duration Rank duration
     * @param offset
     * @param callback
     */
    function searchForIllustration(loginInfo, keyword, searchTarget, sort, duration, offset, callback) {
        najax({
            url: `${enums.API_BASE_URL}/v1/search/illust`,
            data: {
                word: keyword,
                search_target: enums.SEARCH_TARGET[searchTarget],
                sort: enums.SORT[sort],
                duration: duration,
                offest: offset,
                filter: enums.FILTER,
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": "English"
            },
            success: (data) => {
                let res = JSON.parse(data);
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.searchForIllustration = searchForIllustration;
    ;
    function illustration(loginInfo, illustID, callback) {
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
            success: (data) => {
                let res = JSON.parse(data);
                // console.log(res);
                if (callback !== undefined)
                    callback(res.illust);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.illustration = illustration;
})(fetch = exports.fetch || (exports.fetch = {}));
