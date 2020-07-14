/* global axios */

// https://cydsxru68e.execute-api.eu-west-1.amazonaws.com/prod/?table=verbalix-marks&method=marks_between_by_type&type=speaker&start=2020.06.15%2017.00.00&end=2020.06.15%2018.00.00

// https://cydsxru68e.execute-api.eu-west-1.amazonaws.com/prod/?table=verbalix-speakers&method=get_speaker_by_id&id=NSTAKARS071_1396939398205


(function() {
  window.sa = (function() {

    function marksUrl(start, end) {
      var url = "https://cydsxru68e.execute-api.eu-west-1.amazonaws.com/prod/?table=verbalix-marks&method=marks_between_by_type&type=speaker&start=" + encodeURIComponent(start) + "&end=" + encodeURIComponent(end);
      return url;
    }
    function speakerUrl(id) {
      return "https://cydsxru68e.execute-api.eu-west-1.amazonaws.com/prod/?table=verbalix-speakers&method=get_speaker_by_id&id=" + id;
    }
    function getAllSpeakers() {
      return "https://cydsxru68e.execute-api.eu-west-1.amazonaws.com/prod/?table=verbalix-speakers";
    }

    function buildData(marks, speakers) {
      var out = [];
      if (marks.length && speakers.length) {
        marks.forEach(function(mark) {
          var m = mark;
          var sid = mark.markobject_id;
          var speaker = speakers.find(function(s) {
            return s.id == sid;
          });
          m.speaker_data = [];
          if(typeof speaker !== "undefined") m.speaker_data.push(speaker);
          out.push(m);
        });
      }
      return out;
    }
    function init() {
      // var url = marksUrl("2020.06.15 00.00.00", "2020.06.15 18.00.00");
      // var marksbetween = axios.get(url);
      var allspeakers = axios.get(getAllSpeakers());
      var vm = new Vue({
        el: "#speakers-app",
        data: {
          marksto: "",
          marksfrom: "",
          marks: "",
          count: "",
          noresults: 1

        },
        methods: {
          getdata:   function() {
            var from = this.marksfrom;
            var to = this.marksto;
            var allMarks = axios.get("https://cydsxru68e.execute-api.eu-west-1.amazonaws.com/prod/?table=verbalix-marks&method=marks_between_by_type&type=speaker&start=" + encodeURIComponent(from) + "&end=" + encodeURIComponent(to));


            Promise.all([allMarks, allspeakers])
            .then(function(response) {

              var marks = response[0].data.Items;
              var speakers = response[1].data.Items;

              var updatedMarks = buildData(marks,speakers);
              console.log(updatedMarks);
              vm.marks = updatedMarks;
              vm.marksto = to;
              vm.marksfrom = from;
              vm.count = updatedMarks.length;
              vm.noresults = updatedMarks.length;
            }).catch(function(error) {
                console.log(error);
            });
          }
        }
      });
      // Promise.all([marksbetween, allspeakers]).then(function(response) {

      //   // console.log(response[0].data);
      //   // console.log(response[1].data);

      //   var marks = response[0].data.Items;
      //   var speakers = response[1].data.Items;

      //   var updatedMarks = buildData(marks,speakers);
      //   // console.log(updatedMarks);
      //   vm.marks = updatedMarks;
      // }).catch(function(error) {
      //   console.log(error);
      // });

    }

    return {
      init: init,
      mu: marksUrl,
      su: getAllSpeakers
    };
  })();


  window.sa.init();
})();