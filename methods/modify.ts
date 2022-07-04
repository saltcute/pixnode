import * as AddBookmark from "./modify/addBookmark";
import * as DeleteBookmark from "./modify/deleteBookmark";

/**
 * Methods to modify (bookmark, etc.)
 */
export namespace modify {
    export const addBookmark = AddBookmark.main;
    export const deleteBookmark = DeleteBookmark.main;
}