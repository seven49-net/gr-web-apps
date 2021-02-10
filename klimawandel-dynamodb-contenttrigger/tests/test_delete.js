module.exports = {
  "Records": [
    {
      "eventID": "376327136f7f5792d79af8f0ebc6c096",
      "eventName": "REMOVE",
      "eventVersion": "1.1",
      "eventSource": "aws:dynamodb",
      "awsRegion": "eu-west-1",
      "dynamodb": {
        "ApproximateCreationDateTime": 1612799761,
        "Keys": {
          "Inhaltstyp": { "S": "WCAG Article Page" },
          "Url": {
            "S": "https://intwww.gr.ch/de/test-keywords-webbear.aspx"
          }
        },
        "OldImage": {
          "ArticleDate": { "S": "0001-01-01T00:00:00.000Z" },
          "Keywords": {
            "S": "#Tag2; #Tag4, Test3; #Tag10, #Tag12"
          },
          "Modified": { "S": "2021-01-22T14:48:54.266Z" },
          "User": { "S": "Hardegger Thomas" },
          "ArticleEndDate": { "S": "0001-01-01T00:00:00.000Z" },
          "Comments": { "S": "ds" },
          "UserHostAddress": { "S": "193.247.20.51" },
          "Title": {
            "S": "Dummy Title 1"
          },
          "Host": {
            "S": "https://intwww.gr.ch"
          },
          "Inhaltstyp": { "S": "WCAG Article Page" },
          "TTL": { "N": "0" },
          "Url": {
            "S": "https://intwww.gr.ch/de/test-keywords-webbear.aspx"
          },
          "Created": { "S": "2013-01-21T18:43:48.000Z" },
          "Content": {
            "S": "<p><strong>Achtung</strong>&#58; Seiten welche im Titel (Namen)&#160; auf &quot;<strong>TEST</strong>&quot;... beginnen werden nach kurzer Zeit gelöscht!</p>\n" +
              "<p>Test mit Candy 1</p>\n" +
              "<p>&#160;</p>"
          },
          "Referrer": {
            "S": "https://intwww.gr.ch/de/test-keywords-webbear.aspx"
          },
          "UserAgent": {
            "S": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
          },
          "ArticleStartDate": { "S": "0001-01-01T00:00:00.000Z" },
          "ID": { "N": "2" },
          "SearchContent": {
            "S": "aktuelles   achtung &#58; seiten welche im titel (namen)&#160; auf &quot; test &quot;... beginnen werden nach kurzer zeit gelöscht! \n" +
              " test mit candy 1 \n" +
              " &#160;  ds #tag4, #tag5, keyword7"
          }
        },
        "SequenceNumber": "100145400000000040737233388",
        "SizeBytes": 1082,
        "StreamViewType": "NEW_AND_OLD_IMAGES"
      },
      "eventSourceARN": "arn:aws:dynamodb:eu-west-1:322043043330:table/gr_content_klimawandel_gr_ch/stream/2021-01-18T15:21:59.806"
    }
  ]
};