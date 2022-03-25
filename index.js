"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modify = exports.fetch = exports.authenticate = exports.enums = void 0;
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
var types;
(function (types) {
    class loginCredential {
        constructor(_access_token, _refresh_token, _expire_time, _user) {
            this.access_token = _access_token;
            this.refresh_token = _refresh_token;
            this.expire_time = _expire_time;
            this.user = _user;
        }
    }
    types.loginCredential = loginCredential;
    class userInformation {
        constructor(_uid, _name, _account) {
            this.uid = _uid;
            this.name = _name;
            this.account = _account;
        }
    }
    types.userInformation = userInformation;
    class accountInformation extends userInformation {
        constructor(_uid, _name, _account, _mail, _is_premium, _x_restrict, _language) {
            super(_uid, _name, _account);
            this.mail = _mail;
            this.is_premium = _is_premium;
            this.x_restrict = _x_restrict;
            this.language = _language;
        }
    }
    types.accountInformation = accountInformation;
    class tag {
        constructor(_name, _translated_name) {
            this.name = _name;
            this.translated_name = _translated_name;
        }
    }
    types.tag = tag;
    class illustration {
        constructor(_id, _title, _type, _caption, _restrict, _user, _tags, _create_date, _page_count, _sanity_level, _x_restrict, _is_bookmarked) {
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
    }
    types.illustration = illustration;
    class comment {
        constructor(_id, _comment, _date, _user, _parent_comment) {
            this.id = _id;
            this.comment = _comment;
            this.date = _date;
            this.user = _user;
            this.parent_comment = _parent_comment;
        }
    }
    types.comment = comment;
})(types || (types = {}));
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
    /**
     * Convert illustration to its coresponding type
     * @param val Object contains illustration information from Pixiv responses
     * @returns Illustration object
     */
    function illustToTypes(val) {
        return new types.illustration(val.id, val.title, val.type, val.caption, val.restrict, new types.userInformation(val.user.id, val.user.name, val.user.account), (() => {
            let rt = new Array();
            for (let value of val.tags) {
                rt.push(tagToTypes(value));
            }
            return rt;
        })(), val.create_date, val.page_count, val.sanity_level, val.x_restrict, val.is_bookmarked);
    }
    common.illustToTypes = illustToTypes;
    /**
     * Convert comment to its coresponding type
     * @param val Object contains comment information from Pixiv responses
     * @returns comment object
     */
    function commentToTypes(val, hasParentComment) {
        return new types.comment(val.id, val.comment, val.date, new types.userInformation(val.user.id, val.user.name, val.user.account), hasParentComment == "true" ? commentToTypes(val.parent_comment, "false") : undefined);
    }
    common.commentToTypes = commentToTypes;
    function tagToTypes(val) {
        return new types.tag(val.name, val.translated_name);
    }
    common.tagToTypes = tagToTypes;
})(common || (common = {}));
/**
 * Methods to authenticate user
 */
var authenticate;
(function (authenticate) {
    /**
     * Login with browser to a pixiv account
     * @param callback (optional) Callback function
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
                let tmp = JSON.parse(data);
                let res = new types.loginCredential(tmp.access_token, tmp.refresh_token, tmp.expires_in + Math.floor(Date.now() / 1000), new types.accountInformation(tmp.user.id, tmp.user.name, tmp.user.account, tmp.user.mail, tmp.user.is_premium, tmp.user.x_restrict, tmp.user.language));
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
     * @param callback (optional) Callback function
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
                let tmp = JSON.parse(data);
                let res = new types.loginCredential(tmp.access_token, tmp.refresh_token, tmp.expires_in + Math.floor(Date.now() / 1000), new types.accountInformation(tmp.user.id, tmp.user.name, tmp.user.account, tmp.user.mail_address, tmp.user.is_premium, tmp.user.x_restrict, "English"));
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
 * Methods to fetch information (ranking, illutration info, etc.)
 */
var fetch;
(function (fetch) {
    /**
     * Get most popular illustration in certain day, month, year, etc.
     * @param loginInfo Contains login credential and account information
     * @param mode (optional) Ranking mode
     * @param date (optional) Ranking date
     * @param offset (optional) Illustration ranking offset (starting point)
     * @param callback (optional) Callback function
     */
    function illustrationRanking(loginInfo, { mode = "DAY", date, offset }, callback) {
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
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
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
     * Search for illustration with the specified information
     * @param loginInfo Contains login credential and account information
     * @param keyword Search keyword
     * @param searchTarget (optional) Keyword matching rule
     * @param sort (optional) Sort criteria
     * @param duration (optional) Rank duration
     * @param offset (optional) Illustration order offset (starting point)
     * @param callback (optional) Callback function
     */
    function searchForIllustration(loginInfo, keyword, { searchTarget = "TAGS_PARTIAL", sort = "DATE_DESC", duration, offset }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
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
    /**
     * Get detail for a illustration of the specified ID
     * @param loginInfo Contains login credential and account information
     * @param illustID Illustration ID
     * @param callback (optional) Callback function
     */
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
                let tmp = JSON.parse(data).illust;
                let res = common.illustToTypes(tmp);
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.illustration = illustration;
    /**
     * Get comments of illustration of specified ID
     * @param loginInfo Contains login credential and account information
     * @param illustID Illustration ID
     * @param offset (optional) Comment order offset (starting point)
     * @param callback (optional) Callback function
     */
    function illustrationComments(loginInfo, illustID, { offset, includeTotalComments = "false" }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data).comments;
                let res = new Array();
                for (let val of tmp) {
                    res.push(common.commentToTypes(val, JSON.stringify(val.parent_comment) == "{}" ? "false" : "true"));
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.illustrationComments = illustrationComments;
    /**
     * Get related illustration of the illustration of the specified ID
     * @param loginInfo Contains login credentials and account information
     * @param illustID Illustration ID
     * @param offset (optional) Illustration order offset (starting point)
     * @param callback (optional) Callback function
     */
    function relatedIllustration(loginInfo, illustID, { offset }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.relatedIllustration = relatedIllustration;
    /**
     * Get new illustrations form following creators
     * @param loginInfo Contains login credentials and account information
     * @param visibility (Default: Public) Shows illustrations from publicly or privately followed creators
     * @param callback (optional) Callback function
     */
    function illustrationFromFollowingCreators(loginInfo, { visibility = "PUBLIC", offset }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.illustrationFromFollowingCreators = illustrationFromFollowingCreators;
    /**
     * Get recommended illustration
     * @param loginInfo Contains login credentials and account information
     * @param contentType (optional) Type of content (illustration, manga, etc.)
     * @param includeRankingIllustration (Defualt: false) Include top 10 illustration of the day in response
     * @param maxBookmarkIDForRecommend (optional)
     * @param minBookmarkIDForRecentIllustrations (optional)
     * @param offset (optional) Illustration offset (starting point)
     * @param bookmarkIllustIDs (optional) An array containing illustration IDs
     * @param includeRankingLabel (Default: true) Whether to include ranking label or not
     * @param callback (optional) Callback function
     */
    function recommendedIllustration(loginInfo, { contentType, includeRankingIllustration = "false", maxBookmarkIDForRecommend, minBookmarkIDForRecentIllustrations, offset, bookmarkIllustIDs, includeRankingLabel = "true" }, callback) {
        let bookmarkIllustID = bookmarkIllustIDs === null || bookmarkIllustIDs === void 0 ? void 0 : bookmarkIllustIDs.join(",");
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.recommendedIllustration = recommendedIllustration;
    /**
     * Get current trending tags
     * @param loginInfo Contains login credentials and account information
     * @param callback (optional) Callback function
     */
    function trendingTags(loginInfo, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.trend_tags) {
                    res.push({
                        tag: new types.tag(val.tag, val.translated_name),
                        illust: common.illustToTypes(val.illust)
                    });
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.trendingTags = trendingTags;
    /**
     * Check if a specified illustration is bookmarked by current user
     * @param loginInfo Contains login credentials and account information
     * @param illustID ID of the specified illustration
     * @param callback (optional) Callback function
     */
    function bookmark(loginInfo, illustID, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data).bookmark_detail;
                if (callback !== undefined)
                    callback({
                        is_bookmarked: tmp.is_bookmarked,
                        tags: (() => {
                            let res = new Array();
                            for (let val of tmp.tags) {
                                res.push(common.tagToTypes(val));
                            }
                            return res;
                        })(),
                        restrict: tmp.restrict
                    });
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.bookmark = bookmark;
    /**
     * Get detail of a user
     * @param loginInfo Contains login credentials and account information
     * @param userID ID of the user to be looked up
     * @param callback (optional) Callback function
     */
    function user(loginInfo, userID, callback) {
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
    fetch.user = user;
    /**
     * Get illustrations published by the specified user
     * @param loginInfo Contains login credentials and account information
     * @param userID User ID
     * @param contentType (optional) Content type
     * @param offset (optional) Response order offset
     * @param callback (optional) Callback function
     */
    function userIllustrations(loginInfo, userID, { contentType, offset }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.userIllustrations = userIllustrations;
    /**
     * Get bookmarked illustrations of the specified user
     * @param loginInfo Contains login credentials and account information
     * @param userID ID of the specified user
     * @param visibility (Default: PUBLIC) Visibility of bookmarks
     * @param maxBookmarkID (optional) Max ID number of bookmarks in response
     * @param tag (optional) Bookmark tag
     * @param callback (optional) Callback function
     */
    function userBookmarkIllustration(loginInfo, userID, { visibility = "PUBLIC", maxBookmarkID, tag }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.illusts) {
                    res.push(common.illustToTypes(val));
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.userBookmarkIllustration = userBookmarkIllustration;
    /**
     * Get bookmark tags of the specified user
     * @param loginInfo Contains login credentials and account information
     * @param userID ID of the specified user
     * @param visibility (Default: Public) Visibility of bookmarks
     * @param offset (optional) Bookmark tags order number offset
     * @param callback (optional) Callback function
     */
    function userBookmarkTags(loginInfo, userID, { visibility = "PUBLIC", offset }, callback) {
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
    fetch.userBookmarkTags = userBookmarkTags;
    /**
     * Get an list of user that is followed by the current user
     * @param loginInfo Contains login credentials and account information
     * @param userID ID of the specified user
     * @param visibility (Default: Public) Visibility of following user
     * @param offset (optional) User order number offset (starting point)
     * @param callback (optional) Callback function
     */
    function followingUser(loginInfo, userID, { visibility = "PUBLIC", offset }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data).user_previews;
                let res = new Array();
                for (let val of tmp) {
                    res.push({
                        user: new types.userInformation(val.user.id, val.user.name, val.user.account),
                        illust: (() => {
                            let rt = new Array();
                            for (let value of val.illusts) {
                                rt.push(common.illustToTypes(value));
                            }
                            return rt;
                        })()
                    });
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.followingUser = followingUser;
    /**
    * Get an list of user that is following the current user
    * @param loginInfo Contains login credentials and account information
    * @param userID ID of the specified user
    * @param offset (optional) User order number offset (starting point)
    * @param callback (optional) Callback function
    */
    function followers(loginInfo, { offset }, callback) {
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
            success: (data) => {
                let tmp = JSON.parse(data);
                let res = new Array();
                for (let val of tmp.user_previews) {
                    res.push({
                        user: new types.userInformation(val.user.id, val.user.name, val.user.account),
                        illust: (() => {
                            let rt = new Array();
                            for (let value of val.illusts) {
                                rt.push(common.illustToTypes(value));
                            }
                            return rt;
                        })()
                    });
                }
                if (callback !== undefined)
                    callback(res);
            }
        }).error((err) => {
            if (callback !== undefined)
                callback(err);
        });
    }
    fetch.followers = followers;
})(fetch = exports.fetch || (exports.fetch = {}));
var modify;
(function (modify) {
    /**
     * Add an illustration to bookmark
     * @param loginInfo Contains login credentials and account information
     * @param illustID ID of the illustration to be added to bookmark
     * @param visibility (Default: PUBLIC) Visibility of the specified illustration in bookmark
     * @param tags (optional) Bookmark tags of the specified illustration
     * @param callback (optional) Callback function
     */
    function addBookmark(loginInfo, illustID, { visibility = "PUBLIC", tags }, callback) {
        let tag = tags === null || tags === void 0 ? void 0 : tags.join(" ");
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
    modify.addBookmark = addBookmark;
    /**
     * Remove an illustration from bookmark
     * @param loginInfo Contains login credentials and account information
     * @param illustID ID of the illustration to be deleted
     * @param callback (optional) Callback function
     */
    function deleteBookmark(loginInfo, illustID, callback) {
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
    modify.deleteBookmark = deleteBookmark;
})(modify = exports.modify || (exports.modify = {}));
