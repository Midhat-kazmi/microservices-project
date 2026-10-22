import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("📩 Event received at Event Bus:", event.type);

  events.push(event);

  const services = [
    "http://posts-clusterip-srv:4000/events",
    "http://comments-srv:4001/events",
    "http://query-srv:4002/events",
    "http://moderation-srv:4003/events",
  ];

  for (let url of services) {
    try {
      await axios.post(url, event);
      console.log(`✅ Sent event to ${url}`);
    } catch (err) {
      console.log(`❌ Could not deliver event to ${url}: ${err.message}`);
    }
  }

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event Bus is listening on port 4005");
});

export default app;
