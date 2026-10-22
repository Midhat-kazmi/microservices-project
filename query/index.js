import express from "express";
import bodyParse from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParse.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    if (post) {
      post.comments.push({ id, content, status });
    } else {
      console.warn(`⚠️ Skipped CommentCreated for missing postId: ${postId}`);
    }
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    if (post) {
      const comment = post.comments.find((c) => c.id === id);
      if (comment) {
        comment.status = status;
        comment.content = content;
      }
    }
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received:", type);

  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Query service listening on 4002");

  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing past event:", event.type);

      // Handle the event
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.error("⚠️ Failed to fetch past events:", err.message);
  }
});

export default app;
