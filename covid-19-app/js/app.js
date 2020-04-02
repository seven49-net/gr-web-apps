(function($) {

  window.ca = (function() {

    var url = "https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=26&ID=g_1175d522_e609_4287_93af_d14c9efd5218&FORMAT=JSONRAW";

    var texts = {

      title: {
        de: "COVID-19 Entwicklung im Kanton Graubünden",
        it: "",
        rm: ""
      },
      ncumul_conf: {
        de: "Infiziert",
        it: "Casi confermati",
        rm: "Cas confermads"
      },
      ncumul_hosp: {
        de: "Hospitalisiert",
        it: "Persone in ospedale",
        rm: "Persunas ospitalisadas"
      },
      ncumul_deceased: {
        de: "Todesfälle",
        it: "Persone decedute",
        rm: "Persunas mortas"
      }

    };

    function getlangIsoCode() {

      var path = location.pathname;
      var pathArr = path.split("/");
      var langIso = pathArr[1];
      return langIso.length == 2 ? langIso.toLowerCase() : "de";
    }

    function getText(prop, langIso) {

      return texts[prop].hasOwnProperty(langIso) ? texts[prop][langIso] : texts[prop].de;

    }

    function renderDate(d, y) {

      var year = typeof y === undefined ? true : y;

      function leadingZero(t) {
        var o = (t < 10 ? '0' : '') + t;
        return o;
      }

      var date = new Date(d);

      return leadingZero(date.getDate()) + "." + leadingZero((date.getMonth() + 1)) + "." + (year ? date.getFullYear() : '');
    }

    function buildData(data) {

      var dates = [];
      var ncumul_conf = [];
      var ncumul_hosp = [];
      var ncumul_deceased = [];

      if (data.length) {
        $.each(data, function(k, v) {
          dates.push(renderDate(v.date, false));
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

    var langIso = getlangIsoCode();
    var title = getText("title", langIso);
    var conf = getText("ncumul_conf", langIso);
    var hosp = getText("ncumul_hosp", langIso);
    var deceased = getText("ncumul_deceased", langIso);

    function init() {

      var feed = $.getJSON(url);
      feed.done(function(data) {


        createChart(buildData(data), {
          title: title,
          conf: conf,
          hosp: hosp,
          deceased: deceased
        });
      });

    }

    function createChart(obj, params) {

      $("#chart").kendoChart({
        title: {
          text: params.title
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
          name: params.conf,
          data: obj.ncumul_conf
        }, {
          name: params.hosp,
          data: obj.ncumul_hosp
        }, {
          name: params.deceased,
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

  $(function() {
    ca.init();
  });

})(jQuery);