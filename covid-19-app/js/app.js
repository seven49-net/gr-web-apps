(function ($) {
  window.ca = (function () {
    var url = "https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=26&ID=g_1175d522_e609_4287_93af_d14c9efd5218&FORMAT=JSONRAW";

    function renderDate(d) {
      function leadingZero(t) {
        var o = (t < 10 ? '0' : '') + t;
        return o;
      };
      var date = new Date(d);
      return leadingZero(date.getDate()) + "." + leadingZero((date.getMonth() + 1)) + "." + date.getFullYear();
    }

    function buildData(data) {

      var dates = [];
      var ncumul_conf = [];
      var ncumul_hosp = [];
      var ncumul_deceased = [];

      if (data.length) {
        $.each(data, function (k, v) {
          dates.push(renderDate(v.date));
          ncumul_conf.push(v.ncumul_conf);
          ncumul_hosp.push(v.ncumul_hosp);
          ncumul_deceased.push(v.ncumul_deceased);
        });
        return {
          "dates": dates,
          "ncumul_conf": ncumul_conf,
          "ncumul_hosp": ncumul_hosp,
          "ncumul_deceased": ncumul_deceased
        };
      }
    }

    function init() {
      var feed = $.getJSON(url);
      feed.done(function (data) {


        createChart(buildData(data));
      });
    }

    function createChart(obj) {
      $("#chart").kendoChart({
        title: {
          text: "COVID-19 Entwicklung im Kanton Graubünden"
        },
        legend: {
          position: "bottom"
        },
        seriesDefaults: {
          type: "area",
          area: {
            line: {
              style: "smooth"
            }
          }
        },
        seriesColors: ["rgb(255, 202, 21)", "rgb(255, 179, 21)", "rgb(187, 0, 0)"],
        series: [{
          name: "Infiziert",
          data: obj.ncumul_conf
        }, {
          name: "Hospitalisiert",
          data: obj.ncumul_hosp
        }, {
          name: "Todesfälle",
          data: obj.ncumul_deceased
        }],
        valueAxis: {
          labels: {
            format: "{0}"
          },
          line: {
            visible: false
          },
          axisCrossingValue: -10
        },
        categoryAxis: {
          categories: obj.dates,
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

  $(function () {
    ca.init();
  });

})(jQuery);