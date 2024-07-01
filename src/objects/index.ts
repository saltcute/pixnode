import PixNode from "..";

export default class Base {
    protected parent: PixNode;
    protected id: number;

    constructor(parent: PixNode, id: number) {
        this.parent = parent;
        this.id = id;
    }
}
