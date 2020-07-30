const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        switch (event.httpMethod) {
            case 'DELETE':
                body = await dynamo.delete(JSON.parse(event.body)).promise();
                break;
            case 'GET':
                // Tabelle marks laden mit Filter auf 15.6.2020 (query);
                // Filtern nach markobjecttype = speaker ;
                //loop durch mark items, dabei query auf Tabelle speakers, suchen nach speaker.id = mark.markobject_id;
                // ausgabe der sinnvollen spalten von marks und speakers;
                // body = await dynamo.scan({ TableName: event.queryStringParameters.table }).promise();
                let table = event.queryStringParameters.table;
                let params = {
                    TableName: table
                };

                if (event.queryStringParameters && event.queryStringParameters.method) {
                    let method = event.queryStringParameters.method;
                    console.log("method: " + method);
                    if (method == "marks_between_by_type") {
                        params = marks_between_by_type(params, event);
                        //let temp = await dynamo.scan(params).promise();
                        body = await dynamo.scan(params).promise();
                        //body = addSpeakers(temp);
                    }
                    if (method == "get_speaker_by_id") {
                        params.Key = {
                            "id": event.queryStringParameters.id
                        };
                        body = await dynamo.get(params).promise();
                    }

                } else {
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


function marks_between_by_type(obj, event) {
    obj.FilterExpression = "#ts between :start and :end and #t = :type";
    obj.ExpressionAttributeNames = {
        "#ts": "timestamp",
        "#t": "markobject_type"
    };

    obj.ExpressionAttributeValues = {
        ':start': event.queryStringParameters.start,
        ':end': event.queryStringParameters.end,
        ':type': event.queryStringParameters.type
    };
    return obj;
}

function getSpeaker(id) {
    var speaker =  dynamo.get({
        TableName: "verbalix-speakers",
        Key: {
            "id": id
        }}).promise();
        return speaker;
}
async function addSpeakers(obj) {
    //verbalix-speakers
    if (obj.Items.length) {
        return Promise.all(obj.Items.map(async (element) => {
            var speakerId = element.markobject_id;
               element.speaker_data = await dynamo.get({
                TableName: "verbalix-speakers",
                Key: {
                    "id": speakerId
                }}).promise();
        }));
        // for (const element of obj.Items) {
        //     var speakerId = element.markobject_id;
        //     element.speaker_data = await dynamo.get({
        //         TableName: "verbalix-speakers",
        //         Key: {
        //             "id": speakerId
        //         }}).promise();
        // }

    }

    return obj;

}