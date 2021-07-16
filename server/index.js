const needle = require("needle");
const config = require("dotenv").config();
const TOKEN = process.env.TWITTER_TOKEN;

const rulesURL = "http://api.twitter.com/2/tweets/search/stream/rules";
const streamURL =
  "http://api.twitter.com/2/tweets/search/stream?tweet.field=public_metrics&expansions=author_id";

const rules = [{ values: "giveaway" }];
