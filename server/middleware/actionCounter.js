const fs = require("fs");
const path = require("path");

// Path to the activity log file
const logFilePath = path.join(__dirname, "..", "logs", "activityLog.json");

const MAX_ACTIONS_PER_DAY = 10;

const actionCounter = async (req, res, next) => {
  // Only count POST, PUT, and DELETE methods towards the action limit
  if (!["POST", "PUT", "DELETE"].includes(req.method)) {
    return next();
  }

  const userId = req.user.id;
  const currentDate = new Date().toISOString().split("T")[0];

  fs.readFile(logFilePath, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading activity log", error: err.message });
    }

    let logs = data.length ? JSON.parse(data.toString()) : {};
    if (!logs[currentDate]) logs[currentDate] = {};
    if (!logs[currentDate][userId]) logs[currentDate][userId] = 0;

    if (logs[currentDate][userId] >= MAX_ACTIONS_PER_DAY) {
      return res
        .status(429)
        .json({
          message:
            "You have reached your daily action limit. Please try again tomorrow.",
        });
    }

    logs[currentDate][userId] += 1;

    const actionDetail = {
      userId: userId,
      action: req.originalUrl,
      method: req.method,
      timestamp: new Date(),
    };

    if (!logs["actions"]) logs["actions"] = [];
    logs["actions"].push(actionDetail);

    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
      if (writeErr) {
        return res
          .status(500)
          .json({
            message: "Error writing to activity log",
            error: writeErr.message,
          });
      }

      next();
    });
  });
};

module.exports = actionCounter;
