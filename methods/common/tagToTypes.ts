import { types } from "../../constants/types";

export default (val: any): types.tag => {
    return new types.tag(
        val.name,
        val.translated_name
    );
}