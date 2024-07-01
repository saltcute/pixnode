import { Base } from ".";
import { ITrendingTags } from "./type";

export default class Tag extends Base {
    public async trending() {
        return this.requestor.get<ITrendingTags>("/v1/trending-tags/illust");
    }
}
