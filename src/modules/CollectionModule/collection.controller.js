import { json, Router } from "express";
import { createAuther, createBooksCollection, createLogsCapped, createTitleIndex } from "./collection.service.js";
const router = Router();



export const routes = {
    base: "/collection",
    books: "/books",
    authors: "/authors",
    logsCapped: "/logs/capped",
    booksIndex: "/books/index"
}
    
router.get(routes.collection,(req,res)=>{
     res.status(200).json({
        msg: "welcom to collection controller"
     })
})

router.post(routes.books, async (req,res)=>{
    const data = await createBooksCollection();
    res.status(201).json(data);
})

router.post(routes.authors, async (req,res)=>{
    const data = await createAuther(req.body)
    res.status(201).json(data);
})

router.post(routes.logsCapped, async (req, res) => {
    const data = await createLogsCapped();
    res.status(201).json(data);
});

router.post(routes.booksIndex, async (req, res) => {
    const data = await createTitleIndex();
    res.status(201).json(data);
});





export default router;