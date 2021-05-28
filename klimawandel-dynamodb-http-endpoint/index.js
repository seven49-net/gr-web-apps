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
      //console.log('Received event:', JSON.stringify(event, null, 2));

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
          case 'DELETE':
            body = await dynamo.delete(JSON.parse(event.body)).promise();
            break;
          case 'GET':
            if (qs.hasOwnProperty("tablename")) {
              if (qs.hasOwnProperty("searchterm")) {
                params = {
                  ExpressionAttributeValues: {
                    ':searchterm': qs.searchterm
                  },
                  FilterExpression: 'contains (SearchContent, :searchterm)',
                  TableName: qs.tablename
                };


              } else if (qs.hasOwnProperty("tag")) {

                if (qs.hasOwnProperty("language") && qs.tablename.match(/_content_/gmi)) {
                  params = {
                    ExpressionAttributeValues: {
                      ':tag': "#" + qs.tag,
                      ':l': "/" + qs.language + "/"
                    },
                    ExpressionAttributeNames: {
                      "#u": "Url",
                      "#k": "Keywords"
                    },
                    FilterExpression: 'contains (#u,:l) and contains (#k, :tag)',
                    TableName: qs.tablename

                  };
                } else {
                  params = {
                    ExpressionAttributeValues: {
                      ':tag': "#" + qs.tag
                    },
                    FilterExpression: 'contains (Keywords, :tag)',
                    TableName: qs.tablename
                  };
                }

                } else if (qs.hasOwnProperty("language")) {

                  if (qs.tablename.match(/_content_/gmi)) {
                    params = {
                      FilterExpression: "contains (#u,:l)",
                      ExpressionAttributeValues: {
                        ':l': "/" + qs.language + "/"
                      },
                      ExpressionAttributeNames: {
                        "#u": "Url"
                      },
                      TableName: qs.tablename
                    };
                  } else {
                    params = {
                      FilterExpression: "#l = :l",
                      ExpressionAttributeValues: {
                        ':l': qs.language
                      },
                      ExpressionAttributeNames: {
                        "#l": "language"
                      },
                      TableName: qs.tablename
                    };
                  }


                } else {
                  params = {
                    TableName: qs.tablename
                  };
                }

                body = await dynamo.scan(params).promise();
              }

              break;
              case 'POST':
              body = await dynamo.put(JSON.parse(event.body)).promise();
              break;
              case 'PUT':
              body = await dynamo.update(JSON.parse(event.body)).promise();
              break;
              default:
              throw new Error(`Unsupported method "${event.httpMethod}"`);
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