// import elasticsearch from "@elastic/elasticsearch";
const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: "http://localhost:9200",
  log: "trace",
  keepAlive: true,
});

module.exports = esClient;
