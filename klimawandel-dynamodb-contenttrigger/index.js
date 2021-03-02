const aws = require("aws-sdk");
// const util = require("util");

aws.config.update({
  region: "eu-west-1"
});

const dynamo = new aws.DynamoDB();
var docclient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  // console.log("Reading options from event:\n", util.inspect(event, {
  //   depth: 5
  // }));

  // console.log("event records: ");
  // console.log(event.Records);
  for (const record of event.Records) {
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
    const eventname = record.eventName;
    const source = record.eventSourceARN;
    const tagTable = setTableName(source);
    const url = record.dynamodb.Keys.Url.S;
    const language = getLanguage(url);
    const modifiedOn = new Date();
    let pagetitle = '';
    let keywords = null;
    let eventmode = "update";
    if (eventname == "REMOVE") eventmode = "delete";
    console.log(eventmode);
    if (eventmode == "update") {
      pagetitle = record.dynamodb.NewImage.Title.S;
      if (record.dynamodb.NewImage.hasOwnProperty("Keywords")) {
        keywords = record.dynamodb.NewImage.hasOwnProperty("Keywords") ? record.dynamodb.NewImage.Keywords.S : null;
      }
    }
    if (eventmode == "delete") {
      pagetitle = record.dynamodb.OldImage.Title.S;
      keywords = record.dynamodb.OldImage.hasOwnProperty("Keywords") ? record.dynamodb.OldImage.Keywords.S : null;
    }
    const tags = keywords ? getTags(keywords) : [];
    console.log(tags);

    if (tagTable && tags.length) {
      // looping through tags array
      for (var tag of tags) {
        console.log(`handle ${tag}`);
        try {
          const getitem = await getItem({
            "TableName": tagTable,
            "Key": {
              "name": {
                "S": tag
              },
              "language": {
                "S": language
              }
            }
          });
          if (getitem.statusCode === 200) {
            // check if entry exist
            if (getitem.body.hasOwnProperty("Item")) {
              const item = getitem.body.Item;
              const pages = item.hasOwnProperty("pages") ? JSON.parse(item.pages.S) : [];
              let update = true;
              //console.log("Pages:");
              //console.log(pages);
              const filter = pages.filter(o => {
                return o.url == url;
              });
              if (eventmode == "update") {
                let tempPages = pages;
                if (filter.length == 0) {
                  tempPages.push({
                    title: pagetitle,
                    url: url
                  });
                  // console.log("Temp Pages");
                  // console.log(tempPages);

                } else {

                  let fpos = pages.map(function (item) { return item.url; }).indexOf(url);
                  console.log(fpos);
                  let lpos = pages.map(function (item) { return item.url; }).lastIndexOf(url);
                  console.log(lpos);
                  if (fpos != lpos) {
                    while (tempPages.map(function (item) { return item.url }).lastIndexOf(url) > fpos) {
                      let p = tempPages.map(function (item) { return item.url }).lastIndexOf(url);
                      console.log(p);
                      tempPages.splice(p, 1);
                    }
                  }

                  console.log(tempPages)
                  console.log(tempPages[fpos])
                  if (tempPages[fpos].title == pagetitle) {
                    update = false;
                    console.log(`${tag} with  url: ${url} + title: ${pagetitle} is already in ${tagTable}`);
                  } else {

                    tempPages[fpos].title = pagetitle;
                  }

                }
                if (update) {
                  // try catch
                  try {
                    const updateItem = await putItem({
                      TableName: tagTable,
                      Item: {
                        "name": {
                          "S": tag
                        },
                        "language": {
                          "S": language
                        },
                        "pages": {
                          "S": JSON.stringify(tempPages)
                        },
                        "modifiedOn": {
                          "S": modifiedOn.toISOString()
                        }
                      }
                    });
                    if (updateItem == "put item success") console.log(`update ${tag} success`);
                  } catch (error) {
                    console.log(`Error updating  ${tag}`);
                  }
                }

              } else if (eventmode == "delete") {
                console.log("if delete");
                let del = false;
                // console.log(tag, url);
                let pos = pages.map(function (item) { return item.url; }).indexOf(url);
                // console.log(tag, pos);
                // console.log(tag, pages);
                // console.log("filter", filter);
                if (pages.length == 0) {
                  del = true;
                  // no other pages with this tag - delete item
                  console.log("no other")
                } else if (filter.length == 1 && pages.length == 1) {
                  // it's the only page with this tag
                  del = true;
                } else if (pages.length > 1) {
                  let tempP = pages;
                  tempP.splice(pos, 1);
                  //console.log(tag, tempP, tempP.length);

                  if (tempP.length >= 1) {
                    try {
                      const updateItemOnDelete = await putItem({
                        TableName: tagTable,
                        Item: {
                          "name": {
                            "S": tag
                          },
                          "language": {
                            "S": language
                          },
                          "pages": {
                            "S": JSON.stringify(tempP)
                          },
                          "modifiedOn": {
                            "S": modifiedOn.toISOString()
                          }
                        }
                      });
                      if (updateItemOnDelete == "put item success") console.log(`update on delete ${tag} success`);
                    } catch (error) {
                      console.log(`Error updating on delete ${tag}`);
                    }
                  } else {
                    del = true;
                    console.log("there was only one and now delete tag item");
                  }
                }

                // delete item
                if (del) {
                  console.log("delete", del)
                  try {
                    const delItem = await deleteItem({
                      TableName: tagTable,
                      Key: {
                        "name": tag,
                        "language": language
                      }
                    });
                    console.log(delItem.body);
                  } catch (error) {
                    console.log(`Error deleting  ${tag} from ${tagTable}`);
                    console.log(error);
                  }
                }
              }
            } else if (!getitem.body.hasOwnProperty("Item") && eventmode == "update") {
              // no entry in dynamodb for this tag
              console.log(`${tag} is not in ${tagTable}`);
              try {
                const newItem = await putItem({
                  TableName: tagTable,
                  Item: {
                    "name": {
                      "S": tag
                    },
                    "language": {
                      "S": language
                    },
                    "pages": {
                      "S": JSON.stringify([{
                        title: pagetitle,
                        url: url
                      }])
                    },
                    "modifiedOn": {
                      "S": modifiedOn.toISOString()
                    }
                  }
                });
                if (newItem == "put item success") console.log(`${tag} put success`);
              } catch (error) {
                console.log("Error putting item " + error);
              }
            }
          }
        } catch (error) {
          console.log("something went wrong with getting item from tag table");
          console.log(error);
        }
      }
    }

  }
  return `Successfully processed ${event.Records.length} records.`;
};
function getTags(tags) {
  let patt = /#[0-9a-z-@]+/gmi;
  let tempTags = tags.match(patt);
  const tagsArray = [];
  if (tempTags && tempTags.length) {
    tempTags.forEach((tag) => {
      tag = tag.trim();
      tagsArray.push(tag.replace('#', ''));
    });
  }
  //const keywordsArray = tempTags.indexOf(";") > -1 ? tempTags.split(";") : [tempTags];

  return tagsArray;
}

function setTableName(src) {

  const tagTableWWW = "gr_tags_www_gr_ch";
  const tagTableInt = "gr_tags_intwww_gr_ch";
  const tagTableClimate = "gr_tags_klimawandel_gr_ch";
  const tagTableIntClimate = "gr_tags_intklimawandel_gr_ch";
  let out = null;
  if (src.indexOf("gr_content_www_gr_ch") > -1) out = tagTableWWW;
  else if (src.indexOf("gr_content_intwww_gr_ch") > -1) out = tagTableInt;
  else if (src.indexOf("gr_content_klimawandel_gr_ch") > -1) out = tagTableClimate;
  else if (src.indexOf("gr_content_intklimawandel_gr_ch") > -1) out = tagTableIntClimate;
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
        //console.log("put item in db");
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
        //console.log(data);
        resolve({
          statusCode: statusCode,
          body: data
        });
      }
    });
  });
  return response;
}

function deleteItem(obj) {
  var params = obj;
  const response = new Promise((resolve, reject) => {
    var responseText = "nope";
    var statusCode = 0;
    docclient.delete(params, function (err, data) {
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
        //console.log(data);
        resolve({
          statusCode: statusCode,
          body: data
        });
      }
    });
  });
  return response;
}