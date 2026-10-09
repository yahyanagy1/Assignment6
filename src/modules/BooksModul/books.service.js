import { bookModel } from "../../DB/models/BookModel/book.model.js";
import { logModel } from "../../DB/models/logModel/log.model.js";

export const addBook = async (body) => {
    const result = await bookModel.insertOne(body);
    return {
        acknowledged: result.acknowledged,
        insertedId: result.insertedId
    };
};

/*
============================================================
Q5 Explanation (simple)
============================================================

What does this code do?
It adds ONE book to the "books" collection.

insertOne(body)
  Adds one document.
  "body" is the book data we send from Postman.

The validator from Q1 checks the book now.
  Has a title      -> saved.
  No title / ""    -> MongoDB rejects it (error).

result.acknowledged
  true means MongoDB received and saved the data.

result.insertedId
  The new id MongoDB gave to this book.

Short version:
Add one book. The Q1 rule checks that it has a title.
============================================================
*/

export const addBooksBatch = async (body) => {
    const result = await bookModel.insertMany(body);
    return {
        acknowledged: result.acknowledged,
        insertedIds: result.insertedIds
    };
};


/*


============================================================
Q6 Explanation (simple)
============================================================

What does this code do?
It adds MANY books to the "books" collection at once.

insertMany(body)
  Adds many documents in one go.
  "body" must be an ARRAY of books: [ {...}, {...}, {...} ]

The validator from Q1 checks every book.
  A book with no title is rejected.

result.insertedIds
  An object with the new id of each book:
  { "0": id1, "1": id2, "2": id3 }

Short version:
insertOne = one book. insertMany = an array of books.
============================================================
*/

export const updateBookYear = async (title) => {
    const result = await bookModel.updateOne(
        { title },
        {
            $set: { year: 2022 }
        }
    );
    return {
        acknowledged: result.acknowledged,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
    };
};


/*

============================================================
Q8 Explanation (simple)
============================================================

What does this code do?
It finds the book with the given title and changes its year to 2022.

updateOne(filter, update)
  First part  -> { title }: which book to find.
  Second part -> { $set: { year: 2022 } }: what to change.
  $set changes the value of a field (you learned it before).

result.matchedCount
  How many books were found with this title.

result.modifiedCount
  How many books were really changed.
  If the year was already 2022, this will be 0.

Short version:
Find the book by title, set its year to 2022.
============================================================
*/


export const getBookByTitle = async (title) => {
    const book = await bookModel.findOne({ title });
    return book;
};


/*

============================================================
Q9 Explanation (simple)
============================================================

What does this code do?
It finds ONE book by its title.

findOne({ title })
  Looks for the first book with this title.
  You learned findOne before.

req.query.title
  The value after the "?" in the URL.
  /books/title?title=Brave New World
  -> req.query.title = "Brave New World"

Short version:
Read the title from the URL, find the book, send it back.
============================================================
*/

export const getBooksByYear = async (from, to) => {
    const books = await bookModel.find({
        year: {
            $gte: Number(from),
            $lte: Number(to)
        }
    }).toArray();
    return books;
};


/*
============================================================
Q10 Explanation (simple)
============================================================

What does this code do?
It finds all books published between two years.

find({ year: { $gte: from, $lte: to } })
  $gte -> greater than or equal (you learned it before).
  $lte -> less than or equal.
  So year must be between "from" and "to".

Number(from)
  The URL gives us text ("1990").
  year in the database is a number, so we convert the text.

.toArray()
  find gives many books, so we turn them into an array.

Short version:
Take from and to from the URL, find books with year in between.
============================================================
*/



export const getBooksByGenre = async (genre) => {
    const books = await bookModel.find({ genres: genre }).toArray();
    return books;
};


/*
============================================================
Q11 Explanation (simple)
============================================================

What does this code do?
It finds all books that have a given genre.

find({ genres: genre })
  "genres" is an ARRAY, like ["Dystopian", "Science Fiction"].
  When you search an array field with one value,
  MongoDB checks if the value is INSIDE the array.
  So you do not need any special operator.

.toArray()
  find gives many books, so we turn them into an array.

Short version:
Take the genre from the URL, find books whose genres array contains it.
============================================================
*/


export const getBooksSkipLimit = async () => {
    const books = await bookModel
        .find()
        .sort({ year: -1 })
        .skip(2)
        .limit(3)
        .toArray();
    return books;
};


/*
============================================================
Q12 Explanation (simple)
============================================================

What does this code do?
It sorts the books, skips 2, and returns the next 3.

find()
  No filter, so it takes ALL books.

sort({ year: -1 })
  Sort by year. -1 = newest first (descending).
  1 would be oldest first (ascending).

skip(2)
  Ignore the first 2 books in the sorted list.

limit(3)
  Return only 3 books after the skipped ones.

.toArray()
  Turn the result into an array.

Short version:
Sort newest first, jump over 2, take 3.
============================================================
*/


export const getBooksAggregate2 = async () => {
    const books = await bookModel.aggregate([
        {
            $match: {
                year: { $gt: 2000 }
            }
        },
        {
            $project: {
                _id: 0,
                title: 1,
                author: 1,
                year: 1
            }
        }
    ]).toArray();
    return books;
};


/*
============================================================
Q17 Explanation (simple)
============================================================

What does this code do?
It finds books published after 2000 and shows only 3 fields.

aggregate([...])
  A list of steps. The data goes through the steps in order.

$match
  The first step. It keeps only the books we want
  (like find, you learned it before).
  year: { $gt: 2000 } -> year is greater than 2000.

$project
  The second step. It chooses which fields to show.
  1 -> show this field.
  _id: 0 -> hide the id (MongoDB shows it by default).

.toArray()
  Turn the result into an array.

Short version:
Step 1: keep books after 2000. Step 2: show only title, author, year.
============================================================
*/



export const getBooksAggregate3 = async () => {
    const books = await bookModel.aggregate([
        {
            $unwind: "$genres"
        },
        {
            $project: {
                _id: 0,
                title: 1,
                genres: 1
            }
        }
    ]).toArray();
    return books;
};


/*
============================================================
Q18 Explanation (simple)
============================================================

What does this code do?
It breaks the genres array into separate documents.

$unwind: "$genres"
  Takes a book with genres: ["Fantasy", "Adventure"]
  and makes TWO documents:
  { title: "The Hobbit", genres: "Fantasy" }
  { title: "The Hobbit", genres: "Adventure" }
  The "$" before genres means "this is a field name".

$project
  Shows only title and genres, and hides the id.

Short version:
One book with 2 genres becomes 2 documents, one per genre.
============================================================
*/




export const getBooksAggregate4 = async () => {
    const logs = await logModel.aggregate([
        {
            $lookup: {
                from: "books",
                localField: "book_id",
                foreignField: "_id",
                as: "book_details"
            }
        },
        {
            $project: {
                _id: 0,
                action: 1,
                "book_details.title": 1,
                "book_details.author": 1,
                "book_details.year": 1
            }
        }
    ]).toArray();
    return logs;
};


/*
============================================================
Q19 Explanation (simple)
============================================================

What does this code do?
It joins the "logs" collection with the "books" collection.
Each log comes back with the details of its book.

logModel.aggregate
  We start from logs, because the result is a list of logs.

$lookup
  Joins data from another collection (you learned it before).
  from: "books"        -> the collection we join with.
  localField: "book_id"  -> the field in logs.
  foreignField: "_id"    -> the field in books that must match it.
  as: "book_details"     -> the name of the new array.

$project
  Shows only: action, and title/author/year inside book_details.
  _id: 0 hides the log id.

Short version:
For each log, find the book with the same id and put it in book_details.
============================================================
*/



export const getBooksYearInteger = async () => {
    const books = await bookModel.find({
        year: { $type: "int" }
    }).toArray();
    return books;
};


/*
============================================================
Q13 Explanation (simple)
============================================================

What does this code do?
It finds all books where the year is stored as an integer.

find({ year: { $type: "int" } })
  $type checks the TYPE of a field.
  "int" means a whole number like 1857.
  A year saved as text ("1857") will NOT match.

.toArray()
  Turn the result into an array.

Short version:
Keep only the books whose year is a whole number.
============================================================
*/



export const getBooksExcludeGenres = async () => {
    const books = await bookModel.find({
        genres: { $nin: ["Horror", "Science Fiction"] }
    }).toArray();
    return books;
};


/*
============================================================
Q14 Explanation (simple)
============================================================

What does this code do?
It finds books that do NOT have Horror or Science Fiction.

$nin
  Means "not in".
  genres is an ARRAY, so MongoDB checks every item inside it.
  A book is returned only if NONE of its genres
  is "Horror" or "Science Fiction".

.toArray()
  Turn the result into an array.

Short version:
Keep only the books that have neither Horror nor Science Fiction.
============================================================
*/




export const getBooksAggregate1 = async () => {
    const books = await bookModel.aggregate([
        {
            $match: {
                year: { $gt: 2000 }
            }
        },
        {
            $sort: { year: -1 }
        }
    ]).toArray();
    return books;
};


/*
============================================================
Q16 Explanation (simple)
============================================================

What does this code do?
It finds books published after 2000, newest first.

$match
  Step 1. Keep only books with year greater than 2000.

$sort
  Step 2. Sort the books by year.
  -1 = newest first (descending).
  1 would be oldest first.

Short version:
Step 1: keep books after 2000. Step 2: sort newest first.
============================================================
*/


export const deleteBooksBeforeYear = async (year) => {
    const result = await bookModel.deleteMany({
        year: { $lt: Number(year) }
    });
    return {
        acknowledged: result.acknowledged,
        deletedCount: result.deletedCount
    };
};


/*
============================================================
Q15 Explanation (simple)
============================================================

What does this code do?
It deletes all books published before a given year.

deleteMany({ year: { $lt: year } })
  deleteMany deletes ALL the books that match the filter
  (you learned it before).
  $lt means "less than".
  So every book with year smaller than the given year is deleted.

Number(year)
  The URL gives us text ("2000").
  year in the database is a number, so we convert the text.

result.deletedCount
  How many books were deleted.

Short version:
Take the year from the URL, delete every book older than it.
============================================================
*/