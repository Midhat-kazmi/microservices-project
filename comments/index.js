import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[id] = comments;

  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: id,
        status: "pending",
      },
    })
    .catch((err) => {
      console.error("Error posting event:", err.message);
    });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received", type);

  if (type === "CommentModerated") {
    const { postId, id, content, status } = data;

    const comments = commentsByPostId[postId];
    if (!comments) {
      console.error("No comments found for postId:", postId);
      return res.send({});
    }

    const comment = comments.find((comment) => comment.id === id);
    if (comment) {
      comment.status = status;

      await axios
        .post("http://event-bus-srv:4005/events", {
          type: "CommentUpdated",
          data: {
            id,
            postId,
            content,
            status,
          },
        })
        .catch((err) => {
          console.error("Error posting event:", err.message);
        });
    }
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Comments service is running on port 4001");
});
