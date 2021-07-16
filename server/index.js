const needle = require("needle");
const config = require("dotenv").config();
const TOKEN = process.env.TWITTER_TOKEN;

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id";

const rules = [{ value: "coding" }];

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
const setRules = async () => {
  const data = {
    add: rules,
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "Content-type": "application/json",
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
    delete: { ids: ids },
  };
  const response = await needle("delete", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
};

const streamTweets = () => {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  stream.on("data", (data) => {
    try {
      const json = JSON.parse(data);
      console.log("HOLA", json);
    } catch (error) {}
  });
};

(async () => {
  let currentRules;
  try {
    //get all stream rules
    currentRules = await getRules();
    //delete strem rules
    await deleteRules(currentRules);
    // //set stream rules
    await setRules();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  streamTweets();
})();
