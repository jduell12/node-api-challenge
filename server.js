const express = require("express");
const cors = require("cors");
const server = express();

const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.status(200).json({ message: "It's working!" });
});

server.use("/projects", projectRouter);
server.use("/actions", actionRouter);

module.exports = server;
