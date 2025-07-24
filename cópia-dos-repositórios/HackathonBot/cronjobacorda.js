import express from "express";

const router = express.Router();


router.get("/acordar", (req, res) => {
  console.log("PING OK");

  res.status(200).send("Bot está acordado");
});

export default router;