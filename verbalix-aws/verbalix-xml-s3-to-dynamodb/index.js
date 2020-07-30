const aws = require("aws-sdk");
const util = require("util");
const s3 = new aws.S3();

aws.config.update({
  region: "eu-west-1"
});

const dynamo = new aws.DynamoDB();
aws.config.apiVersions = {
  dynamodb: '2012-08-10'
};

module.exports.handler = async (event, context, callback) => {
  // read options from the event parameter.
  /*
  console.log("Reading options from event:\n", util.inspect(event, {
    depth: 5
  }));
  */
  const srcBucket = event.Records[0].s3.bucket.name;
  // object key may have spaces or unicode non-ASCII characters.
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  console.log(srcKey);
  const eventName = event.Records[0].eventName;
  const eventTime = event.Records[0].eventTime;
  // infer the file type from the file suffix.
  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log("could not determine the file type.");
    return;
  }
  // check that the file type is supported
  const fileType = typeMatch[1].toLowerCase();
  //console.log(fileType);
  if (fileType != "xml") {
    console.log(`unsupported file type: ${fileType}`);
    return;
  }
  // check mark or speaker
  let mark = /mark/gi.test(srcKey);
  let speaker = /speaker/gi.test(srcKey);

  if (mark || speaker) {
    let tableName = speaker ? "verbalix-speakers" : "verbalix-marks";
    if (eventName === "ObjectCreated:Put") {
      // download the file from the S3 source bucket.
      try {
        const s3params = {
          Bucket: srcBucket,
          Key: srcKey
        };
        var file = await s3.getObject(s3params).promise();

      } catch (error) {
        console.log(error);
        return;
      }

      try {
        let xml = file.Body.toString();
        if (testXml(xml)) {
          let item = buildData(xml, srcKey, eventTime);

          let params = {
            TableName: tableName,
            Item: item
          };
          let put = await putItem(params);
          console.log("done");
          return {
            body: JSON.stringify(put)
          };
        } else {
          console.log("it's no xml, stupid!");
        }

      } catch (error) {
        console.log(error);
        return;
      }
    } else if (eventName === "ObjectRemoved:Delete") {
      console.log("delete item");
      console.log(srcKey, getId(srcKey));
      let deleteParams = {
        TableName: tableName,
        Key: {
          id: getId(srcKey)
        }
      };
      if (getId(srcKey)) {
        var del = await deleteItem(deleteParams);
      }

    }
  }

};

function testXml(str) {
  var regex = /^<\?xml(.{1,})\?>/gi;
  return regex.test(str);
}

function getData(str) {
  var regex = /\w+="([^"]+)"/gmi;
  var out = str.replace(/^<\?xml(.{1,})\?>/gi, "");
  return out.match(regex);
}

function buildData(str, key, event_time) {
  var data = getData(str);
  var out = data;
  if (data && data.length) {

    const regex = /\w+="([^"]+)"/gmi;

    out = {};
    data.forEach(function (d, i) {
      let c = [...d.matchAll(regex)];
      let prop = c[0][0].replace(/="([^"]+)"/gi, "");
      let val = c[0][1];
      if (prop !== "encoding") out[prop] = {
        S: val
      };
    });

    out.event_time = {
      S: event_time
    };
    out.objectkey = {
      S: key
    };
    out.xml = {
      S: str
    };
  }
  return out;
}

function getId(path) {
  var arr = path.split("/");
  var last = arr.length ? arr.pop() : null;
  var out = last ? last.replace(/\.xml/gi, "") : null;
  return out;
}

function putItem(obj) {
  var params = obj;
  const response = new Promise((resolve, reject) => {
    var responseText = "nope";
    var statusCode = 0;
    dynamo.putItem(params, function (err, data) {
      if (err) {
        responseText = err;
        statusCode = err.statusCode;
        console.log("Error", err);
        reject({
          statusCode: statusCode,
          body: responseText
        });
      } else {
        statusCode = 200;
        responseText = data;
        console.log("put item in db");
        resolve("put item success");
      }
    });
  });
  return response;
}

function deleteItem(params) {
  const ddb = new aws.DynamoDB.DocumentClient();
  ddb.get(params, (err, data) => {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      return;
    } else {
      //console.log(data);
      if (data.hasOwnProperty("Item")) {
        ddb.delete(params, (err,data) => {
          if (err) {
            console.log("error with deleting item", err);
            return;
          } else {
            console.log("item successfully deleted");
          }
        });
      } else {
        console.log("item not in data table");
        return;
      }
    }
  });
}