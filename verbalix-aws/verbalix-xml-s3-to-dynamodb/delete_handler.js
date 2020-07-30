const aws = require("aws-sdk");
const util = require("util");


aws.config.update({
  region: "eu-west-1"
});
aws.config.apiVersions = {
  dynamodb: '2012-08-10'
};
// const dynamo = new aws.DynamoDB({
//   apiVersion: "2012-08-10"
// });
const dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {

  const key = "lambda-test/test7/mark/seven49-test-mark-id-7490.xml";//event.Records[0].s3.object.key;
  console.log(key);
  const params = {
    "TableName": "verbalix-marks",
    // "FilterExpression": "objectkey = :this_key",
    // "ExpressionAttributeValues": {":this_key": key }
    "Key": {
      "id": getId(key)
    }
  };
  return deleteItem(params);
  // console.log(params);
  // dynamo.get(params, (err,data) => {
  //   if (err) console.log(err) {

  //   }
  //   else console.log(data);
  //   // if (err) {
  //   //   console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  //   // } else {
  //   //   console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
  //   // }
  // });
  // dynamo.scan(params, (err,data) => {
  //   if (err) {
  //     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  // } else {
  //     console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
  //     let id = data.Items[0].id;
  //     let deleteParams = {
  //       "TableName": "verbalix-marks",
  //       "Key": {
  //         "id": id
  //       }
  //     };
  //     dynamo.delete(deleteParams, (err,data) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log(data);
  //       }
  //     });
  // }
  // });

};


function getId(path) {
  var arr = path.split("/");
  var last = arr.length ? arr.pop() : null;
  var out = last ? last.replace(/\.xml/gi, "") : null;
  return out;
}
// function getItem(params) {
//   const ddb = new aws.DynamoDB();
//   ddb.getItem(params, function(err, data) {
//     if (err) {
//       console.log("error", err);
//     } else {
//       console.log(data);
//     }
//   });
// }
function deleteItem(params) {
  const ddb = new aws.DynamoDB.DocumentClient();
  ddb.get(params, (err, data) => {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      return;
    } else {
      console.log(data);
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