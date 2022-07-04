import { types } from "../../definition/types";

/**
* Convert comment to its coresponding type
* @param val Object contains comment information from Pixiv responses
* @returns comment object
*/
export function main(
    val: any,
    hasParentComment: "true" | "false"
): types.comment {
    return new types.comment(
        val.id,
        val.comment,
        val.date,
        new types.userInformation(
            val.user.id,
            val.user.name,
            val.user.account
        ),
        hasParentComment == "true" ? main(val.parent_comment, "false") : undefined
    );
}