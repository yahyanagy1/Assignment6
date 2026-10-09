import { Router } from "express";
import { addLog } from "./logs.service.js";

const router = Router();

export const routes = {
    base: "/logs",
    add: "/"
};

router.post(routes.add, async (req, res) => {
    const data = await addLog(req.body);
    res.status(201).json(data);
});

export default router;