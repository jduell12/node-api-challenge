const express = require("express");
const server = express();

const projectRouter = require("./routers/projectRouter");

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "It's working!" });
});

server.use("/projects", projectRouter);

module.exports = server;
