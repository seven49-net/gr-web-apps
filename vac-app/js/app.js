(function($) {

  window.vacapp = (function() {

    var urls = {
      prod: "https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=30&ID=g_dbea8372_ed27_48e8_b2c8_b1f7a9643675&FORMAT=JSONRAW"
    };

    var defaults = {
      seriesColors: ["rgb(45, 148, 6)", "rgb(0, 175, 8)", "rgb(55, 110, 34)"]
    };
    var text = {
      apptitle: {
        de: "COVID-19 Impfungen Kanton Graubünden",
        rm: "vaccinaziuns COVID-19 chantun Grischun",
        it: "vaccinazioni COVID-19 nel Canton Grigioni"
      },
      dosis1: {
        de: "Dosis 1",
        it:"dose 1",
        rm: "dose 1"
      },
      dosis2: {
        de: "Dosis 2",
        it: "dose 2",
        rm: "dose 2"
      },
      total: {
        de: "Einwohner Kanton Graubünden Total 198'000",
        rm: "abitants chantun Grischun total 198’000",
        it: "totale abitanti Canton Grigioni 198'000"
      }
    };
    function getLanguage() {
      var lang = "de";
      var pathname = location.pathname;
      var pattern = /^\/[a-z]{2}\//gmi;
      if (pathname.match(pattern)) lang = pathname.match(pattern)[0].replace(/\//gm, "");
      return lang;
    }

    var langIso = getLanguage();
    console.log(langIso);
    function getText(prop, langIso) {
      return text[prop].hasOwnProperty(langIso) ? text[prop][langIso] : text[prop].de;
    }

    function makeIsoDate(d) {
      var pattern = /\d{2}\.\d{2}\.\d{4}/gm;
      var tempDate = d;
      if (d.match(pattern)) {
        var parts = d.split(".");
        tempDate = parts[2] + "-" + parts[1] + "-" + parts[0];
      }
      return tempDate;
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
      //console.log(date);
      var out = '';
      var day = date.getDay();
      // console.log(day, params.c, params.t);

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

    function buildData(data) {
      var dates = [];
      var dose1 = [];
      var dose2 = [];
      if (data.length) {
        var sorted = sortByDate(data);
        var count = 1;
        var total = sorted.length;
        $.each(sorted, function (i,v) {
          dates.push(renderDate(v.Stand, { y: false, c: count, t: total }));
          dose1.push(v.verimpft1);
          dose2.push(v.verimpft2);
          count++;
        });

      }
      console.log(dates);
      return {
        "dates": dates,
        "dose1": dose1,
        "dose2": dose2
      };
    }

    function init() {
      var feed = $.getJSON(urls.prod);
      feed.done(function(data) {
        console.log(data);
        var chartData = buildData(data);
        console.log(chartData);
        createChart({
          title: getText("apptitle", langIso),
          series: [{
            name: getText("dosis1", langIso),
            data: chartData.dose1
          }, {
            name: getText("dosis2", langIso),
            data: chartData.dose2
          }],
          seriesColors: defaults.seriesColors,
          categories: chartData.dates
        });

      });
    }

    function createChart(params) {

      $("#vac-chart").kendoChart({
        title: {
          text: params.title,
          color: "#000"
        },
        legend: {
          position: "bottom"
        },
        seriesDefaults: {
          type: "area",
          area: {
            line: {
              style: "normal"
            }
          }
        },
        seriesColors: params.seriesColors,
        series: params.series,
        plotArea: {
          background: "#fff"
        },
        chartArea: {
          background: "#fff"
        },
        axisDefaults: {
          background: "#fff"
        },
        valueAxis: {
          title: {
            text: getText("total", langIso)
          },
          labels: {
            format: "{0}",
            skip: 1,
            step: 0,

          },
          plotBands: [
            { from: 198000, to: 200000, color: "#e4e4e4" }
          ],
          // notes: {
          //   line: {
          //     color: "#aa00bb",
          //     length: 400

          //   },
          //   data: [{ value: 198000 }]
          // },
          min: 0,
          max: 200000,
          majorUnit: 10000,
          line: {
            visible: false
          },
          axisCrossingValue: -10
        },
        categoryAxis: {
          categories: params.categories,
          majorGridLines: {
            visible: true
          },
          labels: {
            rotation: "auto"
          }
        },
        tooltip: {
          visible: true,
          format: "{0}",
          template: "#= series.name #: #= value #"
        }
      });

    }

    return {
      init: init
    };

  })();
})(jQuery);