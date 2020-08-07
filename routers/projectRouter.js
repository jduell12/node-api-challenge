const express = require("express");
const ProjectData = require("../data/helpers/projectModel");

const router = express.Router();

//returns an array of all projects in database
router.get("/", (req, res) => {
  try {
    ProjectData.get().then((projects) => {
      res.status(200).json({ projects });
    });
  } catch {
    res.status(500).json({ errorMessage: "Unable to get projects" });
  }
});

//returns one project object with the id passed to it if it exists
router.get("/:id", validateProjectId, (req, res) => {
  try {
    const { id } = req.params;
    ProjectData.get(id).then((project) => {
      res.status(200).json({ project });
    });
  } catch {
    res.status(500).json({ errorMessage: "Unable to get project" });
  }
});

//custom middleware
function validateProjectId(req, res, next) {
  const projectId = req.params.id;

  ProjectData.get(projectId)
    .then((project) => {
      if (project === null) {
        res.status(400).json({ message: "Invalid project id" });
      } else {
        req.project = projectId;
        next();
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid project id" });
    });
}

module.exports = router;
