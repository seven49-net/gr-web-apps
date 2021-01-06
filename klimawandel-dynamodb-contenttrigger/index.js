// console.log('Loading function');
const aws = require("aws-sdk");
const util = require("util");

aws.config.update({
  region: "eu-west-1"
});

const dynamo = new aws.DynamoDB();

exports.handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

  // console.log("Reading options from event:\n", util.inspect(event, {
  //   depth: 5
  // }));
 
  // console.log("event records: ");
  // console.log(event.Records);
    for (const record of event.Records) {
        //const record = event.Records[0];
        /*
        console.log(record);
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
        console.log('Item Keywords value: %j', record.dynamodb.NewImage.Keywords.S);
        // loopen durch keywords. wenn es ein tag ist (#), dann prüfe tabelle gr_tags_www_gr_ch, 
        // ob tag vorhanden ist. wenn nein, dann item mit neuem einfügen. 
        // später: delete handeln 
        */
        
        const url = record.dynamodb.NewImage.Url.S;
        const language = getLanguage(url);
        const pagetitle = record.dynamodb.NewImage.Title.S
        const page = JSON.stringify([{"title": pagetitle, "url": url }]);
        const modifiedOn = new Date();
        const params = {language: language, url: url, pages: page, modifiedOn: modifiedOn, name: ''};
        var tags =  getTags(event.Records[0].dynamodb.NewImage.Keywords.S);
        console.log(tags);
        /*
        if (tags.length) {
            // for (var tag of tags) {
            //     console.log(tag);
            //    // try {
            //       // await getItem({
            //       //   "TableName": "gr_tags_www_gr_ch",
            //       //   "Key": {
            //       //     name: {
            //       //       "S": tag
            //       //     },
            //       //     language: {
            //       //       "S": language
            //       //     }
            //       //   }
            //       // });

            //   //       let params = {
            //   //       TableName: "gr_tags_www_gr_ch",
            //   //       Item: {
            //   //           "name": {
            //   //               "S": tag
            //   //           },
            //   //           "language": {
            //   //             "S": language
            //   //           },
            //   //           "pages": {
            //   //             "S": page
            //   //           },
            //   //           "modifiedOn": {
            //   //             "S": modifiedOn.toISOString()
            //   //           }
            //   //       }
            //   //   };
            //   //   let put = putItem(params);
            //   //  put.then(data => {
            //   //    console.log(data);
            //   //  });
            //     // } 
            //     // catch (error) {
            //     //     console.log(error)
            //     // }
                
                
                
            // }
            
        }
        */
    }
    //return `Successfully processed ${event.Records.length} records.`;
};

function getTags(tags) {
    const keywordsArray =  tags.split(";");
    const tagsArray = [];
    keywordsArray.forEach((tag) => {
      tag = tag.trim();
        if (tag.indexOf("#") > -1) {     
          tagsArray.push(tag.replace('#',''));
          console.log(tagsArray);
         }  
    });  
    return tagsArray;    
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

function getLanguage(str) {
  var patt = new RegExp("\/([a-z]{1,2})\/", "gi");
  var out = "en";
  var res = patt.exec(str);
  //console.log(res);
  if (res) out = res[1];
  return out.toLowerCase();
}

function getItem(obj) {
  var params = obj;
  const response = new Promise((resolve, reject) => {
    var responseText = "nope";
    var statusCode = 0;
    dynamo.getItem(params, function (err, data) {
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
        console.log(data);
        resolve("get item success");
      }
    });
  });
  return response;
}