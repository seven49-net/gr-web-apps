const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    let params;
    let qs = event.queryStringParameters;


    try {
        switch (event.httpMethod) {
          case "GET":
          if (qs.hasOwnProperty("index_name")) {
            let indexName = qs.index_name.toUpperCase();
            // let key = qs.key.toUpperCase();
            let search = qs.search;
            params = {
              TableName: "gr_post_adressdaten",
              IndexName: "INDEX-POSTLEITZAHL",
              KeyConditionExpression: "#rec = :r and #plz = :s",
              ExpressionAttributeNames:{
                "#rec": "REC_ART_NAME",
                "#plz": "POSTLEITZAHL"
            },
              ExpressionAttributeValues: {
                ":s": 3000,
                ":r": "PLZ1"
              }
            }
          }
          break;
            default:
              params = {
                TableName: "gr_post_adressdaten"
              }

        }
        body = await dynamo.query(params).promise();
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