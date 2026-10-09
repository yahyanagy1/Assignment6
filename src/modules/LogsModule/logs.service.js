import { ObjectId } from "mongodb";
import { logModel } from "../../DB/models/logModel/log.model.js";

/*
============================================================
Q7 Explanation (simple)
============================================================

What does this code do?
It adds ONE log to the "logs" collection.
A log says what happened to a book (example: "borrowed").

{ book_id, action }
  We take these two fields out of the body sent from Postman.

new ObjectId(book_id)
  Postman sends book_id as text (string).
  MongoDB ids are ObjectId type, so we convert the text.
  Without this, the id would be saved as plain text.

logModel.insertOne(...)
  Adds one document to "logs".

Short version:
Same as insertOne before, but book_id is converted to ObjectId.
============================================================
*/

export const addLog = async ({ book_id, action }) => {
    const result = await logModel.insertOne({
        book_id: new ObjectId(book_id),
        action
    });
    return {
        acknowledged: result.acknowledged,
        insertedId: result.insertedId
    };
};


