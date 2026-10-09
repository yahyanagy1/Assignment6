// import { bsonType } from "bson"
import { DB } from "../../DB/db.connection.js"
import { authorModel } from "../../DB/models/authorModel/author.model.js";
import { bookModel } from "../../DB/models/BookModel/book.model.js";


export const createBooksCollection = async ()=>{
     await DB.createCollection("books",
        {
            validator:{
                $jsonSchema:{
                    bsonType:"object",
                    required: ["title"],
                    properties: {
                        title : {bsonType: "string" , minLength: 1}
                    }
                }
            }
        }

     )
     return { ok : 1};
}

/*

============================================================
Q1 Explanation (simple)
============================================================

validator
  The rule for the collection.
  If a book breaks the rule, MongoDB says no.
  The rule works later, when we add books (Q5 and Q6).

$jsonSchema
  A way to describe what a good document looks like.
  Think of it like a form with fields to fill in.

bsonType: "object"
  The document must be an object.

required: ["title"]
  These fields must be there.
  No title = the book is rejected.

properties
  Here we say what each field must look like.

title: { bsonType: "string", minLength: 1 }
  bsonType "string" -> the title must be text, not a number.
  minLength 1       -> the title needs at least 1 letter.
  So an empty title "" is rejected.

return { ok: 1 }
  This is the answer we send back to Postman.

Short version:
"books" collection = every book needs a real title.
============================================================
*/



export const createAuther = async (body) => {
    const result = await authorModel.insertOne(body);
    return {
        acknowledged: result.acknowledged,
        insertedId: result.insertedId
    };
};

/*

============================================================
Q2 Explanation (simple)
============================================================

What does this code do?
It adds one author to the "authors" collection.
We never made "authors" before, so MongoDB makes it for us.
This is called an IMPLICIT collection.

insertOne(body)
  Adds one document. "body" is the data sent from Postman.

result.acknowledged
  true means MongoDB got the data and saved it.

result.insertedId
  The new id MongoDB gave to this author.

Short version:
First insert into a new collection = the collection is created.
============================================================
*/


export const createLogsCapped = async () => {
    await DB.createCollection("logs", {
        capped: true,
        size: 1048576
    });
    return { ok: 1 };
};

/*
============================================================
Q3 Explanation (simple)
============================================================

What does this code do?
It makes a new collection called "logs" with a fixed size.

capped: true
  The collection has a size limit.
  When it is full, MongoDB deletes the OLDEST documents
  to make room for new ones.

size: 1048576
  The size limit in bytes.
  1 MB = 1024 x 1024 = 1048576 bytes.

return { ok: 1 }
  The answer the assignment expects.

Short version:
"logs" = a collection with a 1MB limit that removes old data when full.
============================================================
*/



export const createTitleIndex = async () => {
    const indexName = await bookModel.createIndex({ title: 1 });
    return indexName;
};


/*
============================================================
Q4 Explanation (simple)
============================================================

What does this code do?
It makes an index on the "title" field of the "books" collection.

index
  Like the index page of a book.
  It helps MongoDB find a book by title faster.

createIndex({ title: 1 })
  title -> the field we want to search faster.
  1     -> sort A to Z (ascending). -1 would be Z to A.

return indexName
  MongoDB gives the index a name by itself: "title_1"
  (field name + _ + direction).
  We send this name back, because the assignment shows "title_1".

Short version:
Index on title = searching books by title becomes faster.
============================================================
*/


