import { Router } from "express";
import {
    addBook,
    addBooksBatch,
    deleteBooksBeforeYear,
    getBookByTitle,
    getBooksAggregate1,
    getBooksAggregate2,
    getBooksAggregate3,
    getBooksAggregate4,
    getBooksByGenre,
    getBooksByYear,
    getBooksExcludeGenres,
    getBooksSkipLimit,
    getBooksYearInteger,
    updateBookYear
} from "./books.service.js";

const router = Router();

export const routes = {
    base: "/books",
    add: "/",
    batch: "/batch",
    update: "/:title",
    byTitle: "/title",
    byYear: "/year",
    byGenre: "/genre",
    skipLimit: "/skip-limit",
    yearInteger: "/year-integer",
    excludeGenres: "/exclude-genres",
    beforeYear: "/before-year",
    aggregate1: "/aggregate1",
    aggregate2: "/aggregate2",
    aggregate3: "/aggregate3",
    aggregate4: "/aggregate4"
};

// Q5
router.post(routes.add, async (req, res) => {
    const data = await addBook(req.body);
    res.status(201).json(data);
});

// Q6
router.post(routes.batch, async (req, res) => {
    const data = await addBooksBatch(req.body);
    res.status(201).json(data);
});

// Q8
router.patch(routes.update, async (req, res) => {
    const data = await updateBookYear(req.params.title);
    res.status(200).json(data);
});

// Q9
router.get(routes.byTitle, async (req, res) => {
    const data = await getBookByTitle(req.query.title);
    res.status(200).json(data);
});

// Q10
router.get(routes.byYear, async (req, res) => {
    const data = await getBooksByYear(req.query.from, req.query.to);
    res.status(200).json(data);
});

// Q11
router.get(routes.byGenre, async (req, res) => {
    const data = await getBooksByGenre(req.query.genre);
    res.status(200).json(data);
});

// Q12
router.get(routes.skipLimit, async (req, res) => {
    const data = await getBooksSkipLimit();
    res.status(200).json(data);
});

// Q13
router.get(routes.yearInteger, async (req, res) => {
    const data = await getBooksYearInteger();
    res.status(200).json(data);
});

// Q14
router.get(routes.excludeGenres, async (req, res) => {
    const data = await getBooksExcludeGenres();
    res.status(200).json(data);
});

// Q15
router.delete(routes.beforeYear, async (req, res) => {
    const data = await deleteBooksBeforeYear(req.query.year);
    res.status(200).json(data);
});

// Q16
router.get(routes.aggregate1, async (req, res) => {
    const data = await getBooksAggregate1();
    res.status(200).json(data);
});

// Q17
router.get(routes.aggregate2, async (req, res) => {
    const data = await getBooksAggregate2();
    res.status(200).json(data);
});

// Q18
router.get(routes.aggregate3, async (req, res) => {
    const data = await getBooksAggregate3();
    res.status(200).json(data);
});

// Q19
router.get(routes.aggregate4, async (req, res) => {
    const data = await getBooksAggregate4();
    res.status(200).json(data);
});

export default router;