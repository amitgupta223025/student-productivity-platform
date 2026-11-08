const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a task

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body || {};

    // Validate title, Title: maximum 100 characters.
    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 100
    ) {
      return res.status(400).json({
        message: "Title is required and must not exceed 100 characters",
      });
    }

    // Validate description , Description: maximum 500 characters.
    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > 500)
    ) {
      return res.status(400).json({
        message: "Description must not exceed 500 characters",
      });
    }

    // Validate priority
    const validPriorities = ["Low", "Medium", "High"];

    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Priority must be Low, Medium, or High",
      });
    }

    // Validate deadline
    if (deadline !== undefined && deadline !== null && deadline !== "") {
      if (typeof deadline !== "string" || Number.isNaN(Date.parse(deadline))) {
        return res.status(400).json({
          message: "Please provide a valid deadline",
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ?? "",
      priority: priority ?? "Medium",
      deadline: deadline || null,
      user: req.userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Task API error:", error);

    return res.status(500).json({
      message: "An internal server error occurred",
    });
  }
});

// Get the logged-in user's tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Task API error:", error);

    return res.status(500).json({
      message: "An internal server error occurred",
    });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "priority",
      "deadline",
      "completed",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body?.[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    // Validate title
    if (
      updates.title !== undefined &&
      (typeof updates.title !== "string" || !updates.title.trim())
    ) {
      return res.status(400).json({
        message: "A valid task title is required",
      });
    }

    // Validate description
    if (
      updates.description !== undefined &&
      typeof updates.description !== "string"
    ) {
      return res.status(400).json({
        message: "Description must be a string",
      });
    }

    // Validate priority
    const validPriorities = ["Low", "Medium", "High"];

    if (
      updates.priority !== undefined &&
      !validPriorities.includes(updates.priority)
    ) {
      return res.status(400).json({
        message: "Priority must be Low, Medium, or High",
      });
    }

    // Validate deadline
    if (
      updates.deadline !== undefined &&
      updates.deadline !== null &&
      updates.deadline !== ""
    ) {
      if (
        typeof updates.deadline !== "string" ||
        Number.isNaN(Date.parse(updates.deadline))
      ) {
        return res.status(400).json({
          message: "Please provide a valid deadline",
        });
      }
    }

    // Validate completed
    if (
      updates.completed !== undefined &&
      typeof updates.completed !== "boolean"
    ) {
      return res.status(400).json({
        message: "Completed must be true or false",
      });
    }

    if (typeof updates.title === "string") {
      updates.title = updates.title.trim();
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  console.error("Task API error:", error);

  return res.status(500).json({
    message: "An internal server error occurred",
  });
}
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  console.error("Task API error:", error);

  return res.status(500).json({
    message: "An internal server error occurred",
  });
}
});

module.exports = router;
