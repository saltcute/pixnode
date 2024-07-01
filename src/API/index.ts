import Bookmark from "./endpoints/bookmark";
import User from "./endpoints/user";
import Tag from "./endpoints/tag";
import { Requestor } from "./requestor";
import Auth from "./endpoints/auth";
import Illust from "./endpoints/illust";

export class API {
    protected readonly requestor = new Requestor();

    public readonly auth = new Auth(this.requestor);
    public readonly bookmark = new Bookmark(this.requestor);
    public readonly illust = new Illust(this.requestor);
    public readonly tag = new Tag(this.requestor);
    public readonly user = new User(this.requestor);
}
