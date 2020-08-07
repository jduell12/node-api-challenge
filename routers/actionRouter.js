const express = require("express");
const ActionData = require("../data/helpers/actionModel");
const ProjectData = require("../data/helpers/projectModel");

const router = express.Router();

//gets all the actions in the database
router.get("/", (req, res) => {
  try {
    ActionData.get().then((actions) => {
      res.status(200).json({ actions });
    });
  } catch {
    res
      .status(500)
      .json({ errorMessage: "Could not get actions from the database" });
  }
});

//gets an actions with a specific id that is passed in
router.get("/:id", validateActionId, (req, res) => {
  try {
    ActionData.get(req.action).then((action) => {
      res.status(200).json({ action });
    });
  } catch {
    res
      .status(500)
      .json({ errorMessage: "Unable to retrieve action from database" });
  }
});

//adds a new action to the project with the provided id
router.post("/:id", validateProjectId, validateAction, (req, res) => {
  try {
    ActionData.insert(req.body).then((newAction) => {
      res.status(201).json({ created: newAction });
    });
  } catch {
    res
      .status(500)
      .json({ errorMessage: "Could not add action to the database" });
  }
});

//edits an existing action using the provided id with the provided action information
router.put("/:id", validateActionId, validateAction, (req, res) => {
  try {
    ActionData.update(req.action, req.body).then((updatedAction) => {
      res.status(200).json({ updatedAction });
    });
  } catch {
    res
      .status(500)
      .json({
        errorMessage: "Could not edit the action for the provided project id",
      });
  }
});

//custom middleware
function validateActionId(req, res, next) {
  const actionId = req.params.id;

  ActionData.get(actionId)
    .then((action) => {
      if (action === null) {
        res.status(400).json({ message: "Invalid action id" });
      } else {
        req.action = actionId;
        next();
      }
    })
    .catch((err) => res.status(400).json({ message: "Invalid action id" }));
}

function validateAction(req, res, next) {
  const actionInfo = req.body;

  if (!actionInfo.description || !actionInfo.notes) {
    res.status(400).json({
      message: "Please enter a valid description and notes to the action",
    });
  } else {
    actionInfo.project_id = req.project;
    next();
  }
}

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
