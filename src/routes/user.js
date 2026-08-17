const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender about skills";

// Get all the pending connection requests for the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Get all accepted connections
// Get all accepted connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests
      .filter((row) => row.fromUserId && row.toUserId)
      .map((row) => {
        if (
          row.fromUserId._id.toString() ===
          loggedInUser._id.toString()
        ) {
          return row.toUserId;
        }

        return row.fromUserId;
      });

    res.json({ data });
  } catch (err) {
    console.error("CONNECTIONS ERROR:", err);

    res.status(400).send({
      message: err.message,
    });
  }
});

// Get feed users with cursor-based pagination
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Number of users to return
    const limit = Math.min(
      parseInt(req.query.limit) || 10,
      50
    );

    // ID of the last user received from the previous request
    const lastUserId = req.query.lastUserId;

    // Find all connection requests involving logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    // Store users that should not appear in feed
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Base query
    const query = {
      _id: {
        $nin: Array.from(hideUsersFromFeed),
        $ne: loggedInUser._id,
      },
    };

    // If this isn't the first request,
    // only get users after the last fetched user
    if (lastUserId) {
      query._id.$gt = lastUserId;
    }

    // Get users
    const users = await User.find(query)
      .select(USER_SAFE_DATA)
      .sort({ _id: 1 })
      .limit(limit);

    res.json({
      data: users,

      // true means there may be more users
      hasMore: users.length === limit,

      // ID of the last user in this response
      lastUserId:
        users.length > 0
          ? users[users.length - 1]._id
          : lastUserId,
    });
  } catch (err) {
    console.error("FEED ERROR:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;