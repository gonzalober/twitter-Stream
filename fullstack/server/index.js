const http = require("http");
const path = require("path");
const express = require("express");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const needle = require("needle");
const config = require("dotenv").config();
const TOKEN = process.env.TWITTER_TOKEN;

app.use(express.static("client"));

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id";

let rules = [{ value: "argentina" }];

//get stream rules
const getRules = async () => {
  const response = await needle("get", rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

//set stream rules
const addRules = async () => {
  //const rules = rules.data.map((rule) => rule.id);
  const data = {
    add: rules,
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

//delete stream rules
const deleteRules = async (rules) => {
  if (!Array.isArray(rules.data)) {
    return null;
  }
  const ids = rules.data.map((rule) => rule.id);
  const data = {
    delete: {
      ids: ids,
    },
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

const streamTweets = (socket) => {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  stream.on("data", (data) => {
    try {
      const json = JSON.parse(data);
      socket.emit("tweet", json);
    } catch (error) {}
  });
  return stream;
};

//run when client connects
const connections = new Map();
io.on("connection", async (clientSocket) => {
  console.log("Client connected...");
  let currentRules;
  try {
    //get all stream rules
    currentRules = await getRules();
    //delete strem rules
    await deleteRules(currentRules);
    // //set stream rules
    await addRules();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  clientSocket.on("changeFilter", async ({ value }) => {
    let currentRules;
    console.log("CHANGING RULES", value);

    currentRules = await getRules();
    await deleteRules(currentRules);
    connections.set(clientSocket, rules);
    //console.log("HERE", connections);
    let mapRules = [];
    for (let [key, value] of connections) {
      console.log("HHHHHHHHHHHH====>", value);
      mapRules.push(value);
    }
    console.log("CHANGING RULES", mapRules);
    rules = mapRules;
    console.log("-------->>>>>", rules);
    await addRules();
  });

  streamTweets(io);
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
