import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received:", type);

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status,
      },
    });

    // console.log("Moderated comment:", {
    //   id: data.id,
    //   status,
    // });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Moderation service is running on port 4003");
});
