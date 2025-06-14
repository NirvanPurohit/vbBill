import express from "express";

const router = express.Router();

router.route("/ping").get((req, res) => {
   res.status(200).json({ message: "Pong" });
});
export default router;