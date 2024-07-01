export interface IError {
    error: {
        user_message: string;
        message: string;
        reason: string;
        user_message_details: any;
    };
}

export interface IMultipage {
    next_url: string;
}

export type TAcceptedLanguages =
    | "zh-cn"
    | "zh-tw"
    | "en-us"
    | "ja-jp"
    | "ko-kr";
export type TVisibility = "public" | "private";
export type TIllustTypes = "illust" | "manga" | "ugoira" | "novel";
export type TSortOptions =
    | "date_desc"
    | "date_asc"
    | "popular_male_desc"
    | "popular_female_desc"
    | "popular_desc";

export type TIllustRankingModes =
    | "day"
    | "week"
    | "month"
    | "day_male"
    | "day_female"
    | "week_original"
    | "week_rookie"
    | "day_manga"
    | "day_ai";

export type TIllustSearchModes =
    | "partial_match_for_tags"
    | "exact_match_for_tags"
    | "title_and_caption";

export interface ITag {
    name: string;
    translated_name: string;
}

export interface IBookmarkDetail {
    bookmark_detail: {
        is_bookmarked: boolean;
        tags: {
            name: string;
            is_registered: boolean;
        }[];
        restrict: TVisibility;
    };
}

export interface IBookmarkAdd {}

export interface IBookmarkDelete {}

export interface IBookmarkTag {
    name: string;
    count: number;
}

export interface IUser {
    id: number;
    name: string;
    account: string;
    profile_image_urls: {
        medium: string;
    };
}

export interface IUserProfile extends IUser {
    comment: string;
    is_followed: boolean;
    is_access_blocking_user: boolean;
}

export interface IUserDetail {
    user: IUserProfile;
    profile: {
        webpage: string;
        gender: string;
        birth: string;
        birth_day: string;
        birth_year: number;
        region: string;
        address_id: number;
        country_code: string;
        job: string;
        job_id: number;
        total_follow_users: number;
        total_mypixiv_users: number;
        total_illusts: number;
        total_manga: number;
        total_novels: number;
        total_illust_bookmarks_public: number;
        total_illust_series: number;
        total_novel_series: number;
        background_image_url: string;
        twitter_account: string;
        twitter_url: string;
        pawoo_url: string | null;
        is_premium: boolean;
        is_using_custom_profile_image: boolean;
    };
    profile_publicity: {
        gender: TVisibility;
        region: TVisibility;
        birth_day: TVisibility;
        birth_year: TVisibility;
        job: TVisibility;
        pawoo: boolean;
    };
    workspace: {
        pc: string;
        monitor: string;
        tool: string;
        scanner: string;
        tablet: string;
        mouse: string;
        printer: string;
        desktop: string;
        music: string;
        desk: string;
        chair: string;
        comment: string;
        workspace_image_url: string | null;
    };
}

export interface IUserIllusts extends IMultipage {
    user: IUserProfile;
    illusts: IIllust[];
}

export interface IUserBookmarkTags extends IMultipage {
    bookmark_tags: IBookmarkTag[];
}

export interface IUserBookmarkIllusts extends IMultipage {
    illust: IIllust[];
}

export interface IUserSearch extends IMultipage {
    user_previews: {
        user: IUserProfile;
        illusts: IIllust[];
        novels: any[];
        is_muted: boolean;
    }[];
}

export interface ICurrentUserFollowers extends IUserSearch {}
export interface IUserFollowingList extends IUserSearch {}

export interface IIllust {
    id: number;
    title: string;
    type: TIllustTypes;
    image_urls: {
        square_medium: string;
        medium: string;
        large: string;
    };
    caption: "";
    restrict: 0;
    user: IUserProfile;
    tags: ITag[];
    tools: any[];
    /**
     * "2024-05-25T21:18:22+09:00"
     */
    create_date: string;
    page_count: number;
    width: number;
    height: number;
    /**
     * 2 is normal,
     * 1 cannot be viewed if not logged in (?)
     */
    sanity_level: number;
    /**
     * 0 is normal,
     * 1 is R-18,
     * 2 is R-18G
     */
    x_restrict: number;
    series: string | null;
    meta_single_page: {
        original_image_url?: string;
    };
    meta_pages: IIllustMetadata[];
    total_view: number;
    total_bookmarks: number;
    is_bookmarked: boolean;
    visible: boolean;
    is_muted: boolean;
    total_comments: number;
    /**
     * 1 is non-AI,
     * 2 is AI
     */
    illust_ai_type: number;
    illust_book_style: number;
}

export interface IIllustMetadata {
    image_urls: {
        square_medium: string;
        medium: string;
        large: string;
        original: string;
    };
}

export interface ITrendingTags {
    trend_tags: (ITag & {
        illust: IIllust;
    })[];
}

export interface IIllustDetail {
    illust: IIllust;
}

export interface IComment {
    id: number;
    comment: string;
    /**
     * "2024-06-17T13:09:19+09:00"
     */
    date: string;
    user: IUser;
    has_replies: boolean;
    stamp: {
        stamp_id: number;
        stamp_url: string;
    } | null;
}

export interface IIllustComments extends IMultipage {
    comments: IComment[];
    comment_access_control: number;
}

export interface INewIllustsFromFollowingUsers extends IMultipage {
    illusts: IIllust[];
}

export interface IIllustRanking extends IMultipage {
    illusts: IIllust[];
}

export interface IIllustRecommendation extends IMultipage {
    illusts: IIllust[];
    ranking_illusts: IIllust[];
    contest_exists: boolean;
    privacy_policy:
        | {
              version: string;
              message: string;
              url: string;
          }
        | {};
}

export interface IRelatedIllusts extends IMultipage {
    illusts: IIllust[];
}

export interface ISearchIllusts extends IMultipage {
    illusts: IIllust[];
    /**
     * Time in seconds.
     */
    search_span_limit: number;
    /**
     * True if have AI works.
     */
    show_ai: boolean;
}

export interface IAuth {
    access_token: string;
    /**
     * Time in seconds.
     */
    expires_in: number;
    /**
     * Should only be "bearer"
     */
    token_type: string;
    scope: string;
    refresh_token: string;
    user: IUser & {
        profile_image_urls: {
            px_16x16: string;
            px_50x50: string;
            px_170x170: string;
        };
        mail_address: string;
        is_premium: boolean;
        /**
         * Adult content filter option.
         *
         * 0 is only all ages,
         * 1 is only all ages and R-18,
         * 2 is all ages, R-18 and R-18G
         */
        x_restrict: number;
        is_mail_authorized: boolean;
        require_policy_agreement: boolean;
    };
}

export interface IOauthToken extends IAuth {
    response: IAuth;
}
