const lambdaLocal = require("lambda-local");
const path = require("path");

var jsonPayload = {
  "Records": [{
    "eventVersion": "2.1",
    "eventSource": "aws:s3",
    "awsRegion": "eu-west-1",
    "eventTime": "2020-06-11T13:47:38.089Z",
    "eventName": "ObjectCreated:Put",
    "userIdentity": {
      "principalId": "AWS:AIDAJOVLSFJ4CPZS2ROLQ"
    },
    "requestParameters": {
      "sourceIPAddress": "83.78.67.128"
    },
    "responseElements": {
      "x-amz-request-id": "526838D5B0366242",
      "x-amz-id-2": "DkCyZ6LCMmQAfo7GeYW7g94eWAgz1n/YPrtl94rQ3uUOiGSuUD+v9wNOD+fQy36EE/vrnBfgB3DomtfiFJWILUEj12HK6NeO"
    },
    "s3": {
      "s3SchemaVersion": "1.0",
      "configurationId": "ce4f6805-39ee-49d1-922d-1929a4b2ff4a",
      "bucket": {
        "name": "public-audio.gr.ch",
        "ownerIdentity": {
          "principalId": "A2YKXP2ZFSAHOF"
        },
        "arn": "arn:aws:s3:::public-audio.gr.ch"
      },
      "object": {
        "key": "lambda-test/test7/speaker/NSTAKARS075_1591271223016.xml",
        "size": 275,
        "eTag": "2ea83f42189b46175677dccf1b4f3245",
        "sequencer": "005EE235FBC33B9D08"
      }
    }
  }]
};
var markPayload = {
  "Records": [{
    "eventVersion": "2.1",
    "eventSource": "aws:s3",
    "awsRegion": "eu-west-1",
    "eventTime": "2020-06-11T13:47:29.321Z",
    "eventName": "ObjectCreated:Put",
    "userIdentity": {
      "principalId": "AWS:AIDAJOVLSFJ4CPZS2ROLQ"
    },
    "requestParameters": {
      "sourceIPAddress": "83.78.67.128"
    },
    "responseElements": {
      "x-amz-request-id": "B0E4A45C5BE4FFB2",
      "x-amz-id-2": "fBnTRVEk90Hy1Ncq9hB2DWzhFS8pFV4F84TgnK7r/rw5y+kinmWEZ0fbS7MeSUD8Ot0uVOxEv9Nx3nkyJQr1eDDytb8q5tbj"
    },
    "s3": {
      "s3SchemaVersion": "1.0",
      "configurationId": "ce4f6805-39ee-49d1-922d-1929a4b2ff4a",
      "bucket": {
        "name": "public-audio.gr.ch",
        "ownerIdentity": {
          "principalId": "A2YKXP2ZFSAHOF"
        },
        "arn": "arn:aws:s3:::public-audio.gr.ch"
      },
      "object": {
        "key": "lambda-test/test7/mark/NSTAKARS075_1591271208855.xml",
        "size": 275,
        "eTag": "c46da91ea3079669ce958e6d44ed29a1",
        "sequencer": "005EE235F2E0E781E7"
      }
    }
  }]
};

var deleteMarkPayload = {
  Records: [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "eu-west-1",
      "eventTime": "2020-06-15T14:36:47.604Z",
      "eventName": "ObjectRemoved:Delete",
      "userIdentity": { "principalId": "AWS:AIDAJOVLSFJ4CPZS2ROLQ" },
      "requestParameters": { "sourceIPAddress": "83.78.67.128" },
      "responseElements": {
        "x-amz-request-id": "1E7970DE0BE19CC9",
        "x-amz-id-2": "V5JFI5sDr3o82JRs+NyCEwz2Lq/ni9tqsuCa9e7/YAB3cyV+ouvcxxXkQdWL4fSKvRtHuBjR3ySvnevhv/uzmcPFWWAz+7Dg"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "a1406264-ca98-4aeb-a075-55691eedb510",
        "bucket": {
          "name": "public-audio.gr.ch",
          "ownerIdentity": { "principalId": "A2YKXP2ZFSAHOF" },
          "arn": "arn:aws:s3:::public-audio.gr.ch"
        },
        "object": {
          "key": "lambda-test/test7/mark/NSTAKARS075_1591271208855.xml",
          "sequencer": "005EE7878231CFB7E9"
        }
      }
    }
  ]
}

lambdaLocal.execute({
  event: deleteMarkPayload,
  lambdaPath: path.join(__dirname, "../delete_handler.js"),
  profilePath: "~/.aws/credentials",
  profileName: "default",
  timeoutMs: 3000
}).then(function (done) {
  console.log(done);
}).catch(function (err) {
  console.log(err);
});