const lambdaLocal = require("lambda-local");
const path = require("path");

var markPayload = {
  Records: [
    {
      eventVersion: '2.1',
      eventSource: 'aws:s3',
      awsRegion: 'eu-west-1',
      eventTime: '2020-06-17T06:56:05.685Z',
      eventName: 'ObjectCreated:Put',
      userIdentity: { principalId: 'AWS:AIDAJOVLSFJ4CPZS2ROLQ' },
      requestParameters: { sourceIPAddress: '83.78.67.128' },
      responseElements: {
        'x-amz-request-id': '6624EB55FA2DCD17',
        'x-amz-id-2': 'u+MJEq50jhTBA4n+pyVa3RO8D1KVw28azfCeeIrLpmtwwSQKpqlG2wjJ0HFmlSYPL5inkg/RWPfQhJ8W8Omaw/NR0V7uoa9J'
      },
      s3: {
        s3SchemaVersion: '1.0',
        configurationId: '4e37c017-1a7a-4b08-9398-7a12f2320d3d',
        bucket: {
          name: 'public-audio.gr.ch',
          ownerIdentity: { principalId: 'A2YKXP2ZFSAHOF' },
          arn: 'arn:aws:s3:::public-audio.gr.ch'
        },
        object: {
          key: 'lambda-test/test7/mark/seven49-test-mark-id-749.xml',
          size: 274,
          eTag: '07e687c4487217782f671ffd35d82bc3',
          sequencer: '005EE9BE8966C262B9'
        }
      }
    }
  ]
};

lambdaLocal.execute({
  event: markPayload,
  lambdaPath: path.join(__dirname, "../index.js"),
  profilePath: "~/.aws/credentials",
  profileName: "default",
  timeoutMs: 3000
}).then(function (done) {
  console.log(done);
}).catch(function (err) {
  console.log(err);
});