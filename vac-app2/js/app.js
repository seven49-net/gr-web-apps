(function($) {
  window.vacapp = (function() {
    var url = "https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=30&ID=g_7da68a84_b1f4_4053_947d_39770d86889e&FORMAT=JSONRAW";

    function makeIsoDate(d) {
      var pattern = /\d{2}\.\d{2}\.\d{4}/gm;
      var tempDate = d;
      if (d.match(pattern)) {
        var parts = d.match(pattern)[0].split(".");
        tempDate = parts[2] + "-" + parts[1] + "-" + parts[0];
      }
      console.log(tempdate);
      return tempDate;
    }
    function renderStand(str) {
      var pattern = /\d{2}\.\d{2}\.\d{4}/gm;
      var out = str;
      if (str.match(pattern)) out = str.match(pattern)[0];
      return out;
    }
    function renderDate(d, params) {
      //console.log(d);
      var tempDate = makeIsoDate(d);

      var year = typeof params.y === undefined ? true : params.y;

      function leadingZero(t) {
        var o = (t < 10 ? '0' : '') + t;
        return o;
      }

      var date = new Date(tempDate);
      console.log(date);
      var out = '';
      var day = date.getDay();
      if (params.c == 1 || day == 1 || params.c == params.t) out = leadingZero(date.getDate()) + "." + leadingZero((date.getMonth() + 1)) + "." + (year ? date.getFullYear() : '');
      return out;
    }

    function sortByDate(data) {
      var sorted = data.sort(function(a,b) {
        var dateA = new Date(makeIsoDate(a.Stand));
        var dateB = new Date(makeIsoDate(b.Stand));
        return   dateA - dateB;
      });

      return sorted;
    }
    function buildData(item) {
      var date = renderStand(item.Stand);
      var dose1 = parseFloat(item.verimpft1);
      var dose2 = parseFloat(item.verimpft2);
      var total = parseFloat(item.Bevoelkerung.replace("float;#", ""));
      return {

          date: date,
          dose1: dose1,
          dose2: dose2,
          total: total,
          percents: {
            dose1: parseFloat(dose1/total*100).toFixed(2),
            dose2: parseFloat(dose2/total*100).toFixed(2),
            total: 100
          }
      }
    }
    function renderChart(data) {
      console.log(data);

      var container = $(".covid-19-vac-app-2");
      console.log(container);
      if (container.length) {
        var chart = $("<div class='chart'></div>");
        var noNumber = data.total - data.dose1 - data.dose2;
        var noPercent = data.percents.total - data.percents.dose1;
        var vac1 = "<div class='vac-1' style='width:" + data.percents.dose1 + "%;'><span class='percents'>" + data.percents.dose1 + "%" + "</span><span class='number'>" + data.dose1 + "</span></div>";
        var vac2 = "<div class='vac-2' style='width:" + data.percents.dose2 + "%;'><span class='percents'>" + data.percents.dose2 + "%" + "</span><span class='number'>" + data.dose2 + "</span></div>";
        var noVac = "<div class='no-vac' style='width:" + noPercent + "%;'><span class='percents'>" + noPercent + "%" + "</span><span class='number'>" + noNumber + "</span></div>";
        chart.append(vac1 + vac2 + noVac);
        console.log(chart);
        container.append(chart[0].outerHTML);
      }
    }
    function init() {
      console.log("init");
      var feed = $.getJSON(url);
      feed.done(function(data) {
        if (data.length) {
          var sorted = sortByDate(data);
          var item = sorted[0];
          var build = buildData(item);
          console.log(build);
          renderChart(build);
        }
      });
    }

    return {
      init: init
    }
  })();
  $(function() {
    window.vacapp.init();
  });
})(jQuery);