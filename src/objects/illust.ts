import { IIllust, ITag } from "@ksm/API/endpoints/type";
import Base from ".";
import PixNode from "..";
import User from "./user";

export enum EIllustType {
    ILLUST,
    MANGA,
    UGOIRA,
    NOVEL,
}

export enum EIllustRating {
    NORMAL,
    R18,
    R18G,
}

export default class Illust extends Base {
    private _author?: User;
    private _description?: string;
    private _title?: string;
    private _type?: EIllustType;
    private _imageUrl?: string;
    private _rating?: EIllustRating;
    private _tags?: ITag[] = [];

    public async dedescription() {
        if (!this._description) await this.syncDetail();
        return this._description;
    }
    public async title() {
        if (!this._title) await this.syncDetail();
        return this._title;
    }
    public async type() {
        if (!this._type) await this.syncDetail();
        return this._type;
    }
    public async imageUrl() {
        if (!this._imageUrl) await this.syncDetail();
        return this._imageUrl;
    }
    public async rating() {
        if (!this._rating) await this.syncDetail();
        return this._rating;
    }
    public async tags() {
        if (!this._tags) await this.syncDetail();
        return this._tags;
    }
    public async author() {
        if (!this._author) await this.syncDetail();
        return this._author;
    }

    public async comments() {
        const res = await this.parent.API.illust.comments(this.id);
        if (this.parent.API.isSuccessData(res)) {
            return res.comments;
        } else return [];
    }
    public async related() {
        const res = await this.parent.API.illust.related(this.id);
        if (this.parent.API.isSuccessData(res)) {
            return res.illusts.map((illust) =>
                Illust.fromDetail(this.parent, illust)
            );
        } else return [];
    }

    private async syncDetail() {
        const res = await this.parent.API.illust.detail(this.id);
        if (this.parent.API.isSuccessData(res)) {
            this.applyDetail(res.illust);
        }
    }
    private applyDetail(illust: IIllust) {
        this._description = illust.caption;
        this._title = illust.title;
        this._imageUrl = illust.image_urls.medium;
        this._rating = illust.restrict;
        this._tags = illust.tags;
        this._author = User.fromProfile(this.parent, illust.user);

        switch (illust.type) {
            case "illust":
                this._type = EIllustType.ILLUST;
                break;
            case "manga":
                this._type = EIllustType.MANGA;
                break;
            case "ugoira":
                this._type = EIllustType.UGOIRA;
                break;
            case "novel":
                this._type = EIllustType.NOVEL;
                break;
        }
    }

    public static fromDetail(parent: PixNode, illust: IIllust) {
        const self = new Illust(parent, illust.id);
        self.applyDetail(illust);
        return self;
    }
}
