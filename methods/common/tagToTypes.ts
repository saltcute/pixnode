import { types } from "../../definition/types";

export function main(val: any): types.tag {
    return new types.tag(
        val.name,
        val.translated_name
    );
}