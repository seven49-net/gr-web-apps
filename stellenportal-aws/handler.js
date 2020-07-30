'use strict';

const xml2js = require('xml2js');
const https = require('https');
const aws = require('aws-sdk');

aws.config.update({
  region: 'eu-west-1'
});
var dynamo = new aws.DynamoDB({
  apiVersion: '2012-08-10'
});

let url = 'https://pub.refline.ch/514915/internet-browser.xml';

var ddb = new aws.DynamoDB.DocumentClient();

module.exports.stellenportal_xml_to_dynamodb = async (event, context, callback) => {

  let dataString = '';
  const response = await new Promise((resolve, reject) => {
    const req = https.get(url, function (res) {
      res.on('data', chunk => {
        dataString += chunk;
      });
      res.on('end', () => {
        var body = getData(parser(dataString));
        resolve({
          statusCode: res.statusCode,
          body: JSON.stringify(body)
        });
      });
    });

    req.on('error', (e) => {
      reject({
        statusCode: 500,
        body: JSON.stringify(e)
      });
    });
  });
  console.log("xml - statuscode: " +  response.statusCode);

  if (response.statusCode !== 200) {
    console.log("xml error text: " + response.body);
  } else {
    console.log("new xml items: " + JSON.parse(response.body).length);
  }

  if (response.statusCode == 200) {
    console.log("got xml and start to put new items");
    var object = JSON.parse(response.body);
    var actions = object.map(putItem);
    var results = Promise.all(actions);
    var done = await results.then(data => {
      return data;
    });
    console.log(done.length + " written to dynamodb");
    if (done.length) {
      // console.log(done);
      let ts = done[0].body;
      console.log("timestamp of current update: " + ts);
      var query = await queryDb(ts);
      console.log("scan dynamo db for older items");
      if (query.statusCode == 200) {
        var itemsToDelete = query.body.Items;
        console.log("outdated items in dynamo db: " + query.body.Count);
        if (query.Count) {
          var actions2 = itemsToDelete.map(deleteItem);
          var results2 = Promise.all(actions2);
          var deleted = await results2.then(data => {
            return data;
          });
        console.log("deleted items: "+ JSON.stringify(deleted));
        }
      }
    }

  }
};

function deleteItem(obj) {
  var params = {
    TableName: "StellenPortal",
    Key: {
      ID: obj.ID
    }
  };
  var response = new Promise((resolve, reject) => {
    var responseText = 'nope';
    var statusCode = 0;
    ddb.delete(params, (err, data) => {
      if (err) {
        statusCode = err.statusCode;
        responseText = err;
        reject({
          statusCode: statusCode,
          body: responseText
        });
      } else {
        statusCode = 200;
        responseText = data;
        resolve({
          statusCode: statusCode,
          body: responseText
        });
      }
    });
  });
  return response;
}

function queryDb(timestamp) {
  var params = {
    TableName: "StellenPortal",
    FilterExpression: "#ts < :times",
    ExpressionAttributeNames: {
      "#ts": "timestamp"
    },
    ExpressionAttributeValues: {
      ":times": timestamp
    }
  };
  var response = new Promise((resolve, reject) => {
    var responseText = 'nope';
    var statusCode = 0;
    ddb.scan(params, function (err, data) {

      if (err) {
        statusCode = err.statusCode;
        responseText = err;
        reject({
          statusCode: statusCode,
          body: responseText
        });
      } else {
        statusCode = 200;
        responseText = data;
        resolve({
          statusCode: statusCode,
          body: responseText
        });
      }
    });
  });
  return response;
}

function putItem(obj) {
  var params = {
    TableName: "StellenPortal",
    Item: {
      "ID": {
        S: obj.adId
      },
      "AdLink": {
        S: obj.adLink
      },
      "Title": {
        S: obj.title
      },
      "Department": {
        S: obj.department
      },
      "pubStartDate": {
        S: obj.pubStartDate
      },
      "pubEndDate": {
        S: obj.pubEndDate
      },
      "language": {
        S: obj.language
      },
      "businessUnitId": {
        S: obj.businessUnitId
      },
      "businessUnitName": {
        S: obj.businessUnitName
      },
      "applyLink": {
        S: obj.applyLink
      },
      "timestamp": {
        S: obj.timestamp
      }
    },
    ReturnConsumedCapacity: "TOTAL"
  };

  const response = new Promise((resolve, reject) => {
    var responseText = 'nope';
    var statusCode = 0;
    dynamo.putItem(params, function (err, data) {
      if (err) {
        responseText = err;
        statusCode = err.statusCode;
        reject({
          statusCode: statusCode,
          body: responseText
        });
      } else {
        statusCode = 200;
        responseText = data;
        resolve({
          statusCode: statusCode,
          body: obj.timestamp
        });
      }
    });
  });
  return response;
}

function getData(obj) {
  let jobs = obj.jobs.publication;
  let data = [];
  let len = jobs.length;
  let i = 0;
  let now = new Date();
  let timestamp = now.toISOString();
  console.log("timestamp creating json object: " + timestamp);
  for (; i < len; i++) {
    let job = jobs[i];
    // TODO make it safe
    let ex = {
      "adId": job.advertisementId[0],
      "department": job.department[0],
      "title": job.title[0],
      "adLink": job.adLink[0],
      "pubStartDate": job.pubStartDate[0],
      "pubEndDate": job.pubEndDate[0],
      "language": job.language[0],
      "timestamp": timestamp,
      "businessUnitId": job.businessUnitId[0],
      "businessUnitName": job.businessUnit[0],
      "applyLink": job.applyLink[0]
    };

    data.push(ex);
  }
  return data;
}

function parser(str) {
  var parse = new xml2js.Parser();
  var out = '';
  parse.parseString(str, function (err, result) {
    //out += result;
    out = result;
  });
  return out;
}