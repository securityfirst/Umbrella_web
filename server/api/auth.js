require("isomorphic-unfetch");

const express = require("express");
const router = express.Router();

router.get("/key", (req, res) => {
  if (!process.env.PASSWORD_AUTH_KEY) {
    console.error("[API] /auth error: Key is not set");
    res.statusMessage = "Failed to retrieve password key";
    return res.status(500).end();
  }

  return res.status(200).send(process.env.PASSWORD_AUTH_KEY);
});

module.exports = router;
