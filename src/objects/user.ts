import { IUser, IUserProfile } from "@ksm/API/endpoints/type";
import Base from ".";
import PixNode from "..";

export default class User extends Base {
    private _nickname?: string;
    private _username?: string;
    private _avatar?: string;
    private _bio?: string;
    private _isFollowing?: boolean;
    private _isBlacklisted?: boolean;

    public async nickname() {
        if (!this._nickname) await this.syncDetail();
        return this._nickname;
    }

    public async username() {
        if (!this._username) await this.syncDetail();
        return this._username;
    }

    public async avatar() {
        if (!this._avatar) await this.syncDetail();
        return this._avatar;
    }

    public async bio() {
        if (!this._bio) await this.syncDetail();
        return this._bio;
    }

    public async isFollowing() {
        if (!this._isFollowing) await this.syncDetail();
        return this._isFollowing;
    }

    public async isBlacklisted() {
        if (!this._isBlacklisted) await this.syncDetail();
        return this._isBlacklisted;
    }

    private async syncDetail() {
        const res = await this.parent.API.user.detail(this.id);
        if (this.parent.API.isSuccessData(res)) {
            this.applyProfile(res.user);
        }
    }

    private applyProfile(user: IUserProfile) {
        this._nickname = user.name;
        this._username = user.account;
        this._avatar = user.profile_image_urls.medium;
        this._bio = user.comment;
        this._isFollowing = user.is_followed;
        this._isBlacklisted = user.is_access_blocking_user;
    }

    public static fromProfile(parent: PixNode, user: IUserProfile) {
        const self = new User(parent, user.id);
        self.applyProfile(user);
        return self;
    }
}
