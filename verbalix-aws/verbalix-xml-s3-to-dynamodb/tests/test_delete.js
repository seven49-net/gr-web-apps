const lambdaLocal = require("lambda-local");
const path = require("path");

var deleteMarkPayload = {
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "eu-west-1",
      "eventTime": "2020-06-16T14:54:24.481Z",
      "eventName": "ObjectRemoved:Delete",
      "userIdentity": { "principalId": "AWS:AIDAJOVLSFJ4CPZS2ROLQ" },
      "requestParameters": { "sourceIPAddress": "83.78.67.128" },
      "responseElements": {
        "x-amz-request-id": "9FEF8A57A1EDA77A",
        "x-amz-id-2": "id1AbYlAuDEhXOFPNvsMwIhJAPtTdNp8H6MyGsCakdbVIXXpPd7QQr1zIOYqRQ6/niVYync8t563jyTRVM9ahbgpI5fwlFaO"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "19f06493-2a44-45d5-99fa-d08e8d571d9b",
        "bucket": {
          "name": "public-audio.gr.ch",
          "ownerIdentity": { "principalId": "A2YKXP2ZFSAHOF" },
          "arn": "arn:aws:s3:::public-audio.gr.ch"
        },
        "object": {
          "key": "lambda-test/test7/mark/seven49-test-mark-id-749.xml",
          "sequencer": "005EE8DD217C84303C"
        }
      }
    }
  ]
};

lambdaLocal.execute({
  event: deleteMarkPayload,
  lambdaPath: path.join(__dirname, "../index.js"),
  profilePath: "~/.aws/credentials",
  profileName: "default",
  timeoutMs: 3000
}).then(function (done) {
  console.log(done);
}).catch(function (err) {
  console.log(err);
});