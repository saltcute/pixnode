import { types } from "../../constants/types";
import { common } from "../common";

/**
* Convert illustration to its coresponding type
* @param val Object contains illustration information from Pixiv responses
* @returns Illustration object
*/
export default (val: any): types.illustration => {
    return new types.illustration(
        val.id,
        val.title,
        val.type,
        val.caption,
        val.restrict,
        new types.userInformation(
            val.user.id,
            val.user.name,
            val.user.account
        ),
        (() => {
            let rt = new Array<types.tag>();
            for (let value of val.tags) {
                rt.push(common.tagToTypes(value));
            }
            return rt;
        })(),
        val.create_date,
        val.page_count,
        val.sanity_level,
        val.x_restrict,
        val.is_bookmarked,
        val.total_bookmarks,
        val.total_view,
        val.image_urls,
        val.meta_single_page,
        val.meta_pages
    );
}