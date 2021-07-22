const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  let body = [{Count: 0, Items: [], noresult: 1}];
  let statusCode = '200';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  let params;
  let qs = event.queryStringParameters;
  let indexName;
  let primaryKeyValue;
  let searchterm;
  // https://vdk8qyhmsa.execute-api.eu-west-1.amazonaws.com/PROD/?index_name=index-postleitzahl&rec_art_name=plz1&searchterm=3000

  try {
    switch (event.httpMethod) {
      case "GET":
        indexName = qs.hasOwnProperty("index_name") ? qs.index_name.toUpperCase() : null;
        primaryKeyValue = qs.hasOwnProperty("rec_art_name") ? qs.rec_art_name.toUpperCase() : null;
        searchterm = qs.hasOwnProperty("searchterm") ? qs.searchterm : null;


        if (indexName && primaryKeyValue) {
          params = buildParameters(indexName, primaryKeyValue, searchterm);
        }
        break;
      default:
        params = {
          TableName: "gr_post_adressdaten"
        }

    }
    let first = await dynamo.query(params).promise();
    if (indexName === "INDEX-STRBEZL") {
      if (first.Items.length) {
        let results = [];
        if (first.Items.length < 30) {
          for (const it of first.Items)  {
            let onrp = it.ONRP;
            let result = await dynamo.query(streetResultParameters(onrp)).promise();
            results.push(result.Items[0]);
          }
        } else {
          results.push({message: "there are too many records (" + first.Items.length + ")"});
        }

        body = results;
      }
    } else {

    if (first.Items.length) {
      body = first;
    } else {
      // if ortbez27 plz2 = no result -> second with plz1
      if (indexName === "INDEX-ORTBEZ27") {
        if (primaryKeyValue === "PLZ2") {
          params = buildParameters(indexName, "PLZ1", searchterm);
        } else {
          params = buildParameters(indexName, "PLZ2", searchterm);
        }
        var second = await dynamo.query(params).promise();
        body = second;
      }

      }
    }


  } catch (err) {
    statusCode = '400';
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
function streetResultParameters(onrp) {
  let s = parseInt(onrp);
  return {
    TableName: "gr_post_adressdaten",
    IndexName: "INDEX-ONRP",
    KeyConditionExpression: "#prim = :p and #sec = :s",
    ExpressionAttributeNames: {
      "#prim": "REC_ART_NAME",
      "#sec": "ONRP"
    },
    ExpressionAttributeValues: {
      ":s": s,
      ":p": "PLZ1"
    }
  };
}

function capitalize(str) {
  if(typeof str === 'string') {
      return str.replace(/^\w/, function(c) {
        return c.toUpperCase();
      });
  } else {
      return '';
  }
}
function capitalizeAll(phrase) {
  if (typeof phrase === 'string') {
    return phrase.replace(/\b\w/g, function(c) {
      return c.toUpperCase();
  });
  } else {
    return '';
  }
}
function buildParameters(iName, recArtName, value) {

  let keyConditionExpression = "#prim = :p and #sec = :s";
  let indexName = iName.toUpperCase();
  let secondaryKey = indexName.replace("INDEX-", "");
  let s = capitalize(value);
  let rec_art_name = recArtName.toUpperCase();

  switch (indexName) {
    case "INDEX-POSTLEITZAHL":
      keyConditionExpression = "#prim = :p and #sec = :s";
      s = parseInt(value);
      break;
    case "INDEX-ONRP":
      s = parseInt(value);
      break;

    case "INDEX-ORTBEZ27":
      keyConditionExpression = "#prim = :p and  begins_with(#sec,:s)";
      break;
    // case "INDEX-STRBEZ2L":
    // break;
    // case "INDEX-STRBEZL":
    //   break;
    case "INDEX-STRID":
      s = parseInt(value);
      break;
    default:
      keyConditionExpression = "#prim = :p and begins_with(#sec,:s)";
      break;
  }


  let params = {
    TableName: "gr_post_adressdaten",
    IndexName: iName.toUpperCase(),
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: {
      "#prim": "REC_ART_NAME",
      "#sec": secondaryKey
    },
    ExpressionAttributeValues: {
      ":s": s,
      ":p": rec_art_name
    }
  };
  return params;
}