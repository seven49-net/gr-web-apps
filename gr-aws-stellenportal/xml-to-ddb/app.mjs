/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * Get job XML, transform to JSON and update dynamodb (delete outdated items)
 */
import https from "https";
import { XMLParser } from "fast-xml-parser";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DeleteCommand,
  ScanCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "StellenPortal";

const parseOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
  ignoreDeclaration: true,
};

const parser = new XMLParser(parseOptions);

export const lambdaHandler = async (event, context) => {
  const jobs = await getJobsList();
  // console.log(JSON.stringify(parser.parse(jobs)));
  // console.log(client);
  const data = getData(parser.parse(jobs));
  const response = {
    statusCode: 200,
    body: JSON.stringify(data),
  };
  // return response;
  if (response.statusCode === 200) {
    const object = JSON.parse(response.body);
    const actions = object.map(putItem);
    const results = Promise.all(actions);
    const done = await results.then((data) => {
      return data;
    });

    console.log(done.length + " written to dynamodb");

    // console.log("body", done.body);
    if (done.length) {
      console.log(done);
      const ts = done[0].body;
      console.log("timestamp of current update: " + ts);
      const query = await queryDb(ts);
      console.log("scan dynamo db for older items");
      if (query["$metadata"]["httpStatusCode"] == 200) {
        const itemsToDelete = query.Items;
        console.log("outdated items in dynamo db: " + query.Count);
        if (itemsToDelete.length) {
          const delActions = itemsToDelete.map(deleteItem);
          const delResults = Promise.all(delActions);
          const deleted = await delResults.then((data) => {
            return data;
          });
          console.log("deleted items: " + JSON.stringify(deleted));
        }
      }
    }
  }
};

async function getJobsList() {
  return new Promise((resolve, reject) => {
    const req = https.get("https://pub.refline.ch/514915/internet-browser.xml", (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }
      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        resolve(resString);
      });
    });
    req.on("error", (err) => {
      reject(err);
    });
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request time out"));
    });

    req.end();
  });
}

function getData(obj) {
  const jobs = obj.jobs.publication;
  const data = [];
  const len = jobs.length;
  let i = 0;
  const now = new Date();
  const timestamp = now.toISOString();
  console.log("timestamp creating json object: " + timestamp);
  for (; i < len; i++) {
    const job = jobs[i];
    const ex = {
      adId: job.advertisementId,
      department: job.department,
      title: job.title,
      adLink: job.adLink,
      pubStartDate: job.pubStartDate,
      pubEndDate: job.pubEndDate,
      language: job.language,
      timestamp: timestamp,
      businessUnitId: job.businessUnitId,
      businessUnitName: job.businessUnit,
      applyLink: job.applyLink,
      workplace: job.workplace,
    };

    data.push(ex);
  }
  return data;
}

async function putItem(obj) {
  const params = {
    TableName: tableName,
    Item: {
      ID: obj.adId,
      AdLink: obj.adLink,
      Title: obj.title,
      Department: obj.department,
      pubStartDate: obj.pubStartDate,
      pubEndDate: obj.pubEndDate,
      language: obj.language,
      businessUnitId: obj.businessUnitId,
      businessUnitName: obj.businessUnitName,
      applyLink: obj.applyLink,
      timestamp: obj.timestamp,
      workplace: obj.workplace,
    },
  };
  const command = new PutCommand(params);
  const response = await docClient.send(command);
  // console.log(response);
  // JSON.stringify(response).includes(":200,")
  if (response["$metadata"]["httpStatusCode"] == 200) {
    return {
      statusCode: 200,
      body: obj.timestamp,
    };
  }
}

async function queryDb(timestamp) {
  const params = {
    TableName: tableName,
    FilterExpression: "#ts < :times",
    ExpressionAttributeNames: {
      "#ts": "timestamp",
    },
    ExpressionAttributeValues: {
      ":times": timestamp,
    },
  };
  const command = new ScanCommand(params);
  const response = await docClient.send(command);
  return response;
}

async function deleteItem(obj) {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      ID: obj.ID,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}
