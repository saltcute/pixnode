import { Base } from ".";
import { IBookmarkAdd, IBookmarkDelete, IError, TVisibility } from "./type";

export default class Bookmark extends Base {
    public async detail(illustId: number) {
        return this.requestor.get<IBookmarkDelete>(
            "/v2/illust/bookmark/detail",
            {
                illust_id: illustId,
            }
        );
    }
    public async add(
        illustId: number,
        restrict: TVisibility = "public",
        tags: string[] = []
    ) {
        return this.requestor.post<IBookmarkAdd>("/v2/illust/bookmark/add", {
            illust_id: illustId,
            restrict,
            tags: tags.join(" "),
        });
    }
    public async delete(illustId: number) {
        return this.requestor.post<IBookmarkDelete>(
            "/v1/illust/bookmark/delete",
            {
                illust_id: illustId,
            }
        );
    }
}
