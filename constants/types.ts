export namespace types {
    export class loginCredential {
        constructor(
            _access_token: string,
            _refresh_token: string,
            _expire_time: number,
            _user: accountInformation
        ) {
            this.access_token = _access_token;
            this.refresh_token = _refresh_token;
            this.expire_time = _expire_time;
            this.user = _user;
        }
        access_token: string;
        refresh_token: string;
        expire_time: number;
        user: accountInformation;
    }
    export class userInformation {
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
    export class accountInformation extends userInformation {
        constructor(
            _uid: number,
            _name: string,
            _account: string,
            _mail: string,
            _is_premium: boolean,
            _x_restrict: number,
        ) {
            super(_uid, _name, _account);
            this.mail = _mail;
            this.is_premium = _is_premium;
            this.x_restrict = _x_restrict;
        }
        mail: string;
        is_premium: boolean;
        x_restrict: number;
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
            _user: userInformation,
            _tags: Array<tag>,
            _create_date: string,
            _page_count: number,
            _sanity_level: number,
            _x_restrict: number,
            _is_bookmarked: boolean,
            _total_bookmarks: number,
            _total_view: number,
            _image_urls: {
                large: string,
                medium: string,
                square_medium: string
            },
            _meta_single_page: {
                original_image_url: string
            }
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
            this.total_bookmarks = _total_bookmarks;
            this.total_view = _total_view;
            this.image_urls = _image_urls;
            this.meta_single_page = _meta_single_page
        }
        id: number;
        title: string;
        type: string;
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
        image_urls: {
            large: string,
            medium: string,
            square_medium: string
        };
        meta_single_page: {
            original_image_url: string
        };
    }
    export class comment {
        constructor(
            _id: number,
            _comment: string,
            _date: string,
            _user: userInformation,
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
        user: userInformation;
        parent_comment?: comment;
    }
}