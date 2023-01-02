export namespace types {
    export class loginCredential {
        constructor(
            access_token: string,
            refresh_token: string,
            expire_time: number,
            user: accountInformation
        ) {
            this.access_token = access_token;
            this.refresh_token = refresh_token;
            this.expire_time = expire_time;
            this.user = user;
        }
        access_token: string;
        refresh_token: string;
        expire_time: number;
        user: accountInformation;
    }
    export class userInformation {
        constructor(
            uid: number,
            name: string,
            account: string
        ) {
            this.uid = uid;
            this.name = name;
            this.account = account;
        }
        uid: number;
        name: string;
        account: string;
    }
    export class accountInformation extends userInformation {
        constructor(
            uid: number,
            name: string,
            account: string,
            mail: string,
            is_premium: boolean,
            x_restrict: number,
        ) {
            super(uid, name, account);
            this.mail = mail;
            this.is_premium = is_premium;
            this.x_restrict = x_restrict;
        }
        mail: string;
        is_premium: boolean;
        x_restrict: number;
    }
    export class tag {
        constructor(
            name: string,
            translated_name: string
        ) {
            this.name = name;
            this.translated_name = translated_name;
        }
        name: string;
        translated_name: string;
    }
    export class illustration {
        constructor(
            id: number,
            title: string,
            type: string,
            caption: string,
            restrict: number,
            user: userInformation,
            tags: Array<tag>,
            create_date: string,
            page_count: number,
            sanity_level: number,
            x_restrict: number,
            is_bookmarked: boolean,
            total_bookmarks: number,
            total_view: number,
            image_urls: {
                large: string,
                medium: string,
                square_medium: string
            },
            meta_single_page: {
                original_image_url: string
            },
            meta_pages: Array<{
                image_urls: {
                    square_meduim: string,
                    medium: string,
                    large: string,
                    original: string
                }
            }>
        ) {
            this.id = id;
            this.title = title;
            this.type = type;
            this.caption = caption;
            this.restrict = restrict;
            this.user = user;
            this.tags = tags;
            this.create_date = create_date;
            this.page_count = page_count;
            this.sanity_level = sanity_level;
            this.x_restrict = x_restrict;
            this.is_bookmarked = is_bookmarked;
            this.total_bookmarks = total_bookmarks;
            this.total_view = total_view;
            this.image_urls = image_urls;
            this.meta_single_page = meta_single_page;
            this.meta_pages = meta_pages;
        }
        id: number;
        title: string;
        type: string;
        image_urls: {
            large: string,
            medium: string,
            square_medium: string
        };
        caption: string;
        restrict: number;
        user: userInformation;
        tags: Array<tag>;
        create_date: string;
        page_count: number;
        sanity_level: number;
        x_restrict: number;
        is_bookmarked: boolean;
        total_bookmarks: number;
        total_view: number;
        meta_single_page: {
            original_image_url?: string
        };
        meta_pages: {
            image_urls: {
                square_meduim: string,
                medium: string,
                large: string,
                original: string
            }
        }[];
    }
    export class comment {
        constructor(
            id: number,
            comment: string,
            date: string,
            user: userInformation,
            parent_comment?: comment
        ) {
            this.id = id;
            this.comment = comment;
            this.date = date;
            this.user = user;
            this.parent_comment = parent_comment;
        }
        id: number;
        comment: string;
        date: string;
        user: userInformation;
        parent_comment?: comment;
    }
}