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
        de: "COVID-19 Impfungen Kanton Graubünden"
      },
      dosis1: {
        de: "Dosis 1",
        it:"dose 1"
      },
      dosis2: {
        de: "Dosis 2",
        it: "dose 2"
      },
      total: {
        de: "Einwohner Kanton Graubünden Total 198'000"
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
/*
  window.ca = (function() {

    var urls = {
      int: {
        "url_1": "https://intwww.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=26&ID=g_1175d522_e609_4287_93af_d14c9efd5218&FORMAT=JSONRAW",

        "url_2": "https://intwww.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=26&ID=g_f1de47a0_14a5_4e2a_a121_9b38b27dfd8d&FORMAT=JSONRAW"
      },
      prod: {
        "url_1": "https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=26&ID=g_1175d522_e609_4287_93af_d14c9efd5218&FORMAT=JSONRAW",

        "url_2": "https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/coronavirus/_layouts/15/GenericDataFeed/feed.aspx?PageID=26&ID=g_e8887880_c4ae_4448_8e24_833e8563e865&FORMAT=JSONRAW"
      }
    };

    var defaults = {
      seriesColors: ["rgb(255, 202, 21)", "rgb(255, 179, 21)", "rgb(187, 0, 0)"]
    };

    var texts = {

      title: {
        base_app: {
          de: "COVID-19 Entwicklung im Kanton Graubünden",
          it: "COVID-19: evoluzione nel Cantone dei Grigioni",
          rm: "COVID-19: svilup en il chantun Grischun"
        },
        hosp_app: {
          de: "COVID-19 Hospitalisationen im Kanton Graubünden",
          it: "COVID-19: evoluzione nel Cantone dei Grigioni",
          rm: "COVID-19: svilup en il chantun Grischun"
        }
      },
      ncumul_conf: {
        de: "Infiziert",
        it: "Casi confermati",
        rm: "cas confermads"
      },
      ncumul_hosp: {
        de: "Hospitalisiert",
        it: "Persone in ospedale",
        rm: "persunas ospitalisadas"
      },
      ncumul_deceased: {
        de: "Todesfälle",
        it: "Persone decedute",
        rm: "persunas mortas"
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



    function setUrl(pl, url) {
      var out = urls.prod.url_1;
      if (pl == "prod") {
        out = urls.prod[url];
      }
      if (pl == "int") {
        out = urls.int[url];
      }
      return out;
    }

    function renderDate(d, params) {

      var year = typeof params.y === undefined ? true : params.y;

      function leadingZero(t) {
        var o = (t < 10 ? '0' : '') + t;
        return o;
      }

      var date = new Date(d);
      var out = '';
      var day = date.getDay();
      if (params.c == 1 || day == 1 || params.c == params.t) out = leadingZero(date.getDate()) + "." + leadingZero((date.getMonth() + 1)) + "." + (year ? date.getFullYear() : '');
      return out;
    }

    function buildData(data) {

      var dates = [];
      var ncumul_conf = [];
      var ncumul_hosp = [];
      var ncumul_deceased = [];

      if (data.length) {
        var count = 1;
        var total = data.length;
        $.each(data, function(k, v) {

          dates.push(renderDate(v.date, { y: false, c: count, t: total }));
          ncumul_conf.push(v.ncumul_conf);
          ncumul_hosp.push(v.ncumul_hosp);
          ncumul_deceased.push(v.ncumul_deceased);

          count++;
        });
        return {
          "dates": dates,
          "ncumul_conf": ncumul_conf,
          "ncumul_hosp": ncumul_hosp,
          "ncumul_deceased": ncumul_deceased
        };
      }

    }

    function buildHospData(data) {
      var dates = [];
      var current_hosp = [];
      if (data.length) {
        var count = 1;
        var total = data.length;
        $.each(data, function(k, v) {

          dates.push(renderDate(v.date, { y: false, c: count, t: total }));
          current_hosp.push(v.current_hosp);

          count++;
        });
        return {
          "dates": dates,
          "current_hosp": current_hosp
        };
      }
    }


    var langIso = getlangIsoCode();
    //var title = getTitle("base_app", langIso);
    var conf = getText("ncumul_conf", langIso);
    var hosp = getText("ncumul_hosp", langIso);
    var deceased = getText("ncumul_deceased", langIso);

    function init(pl) {
      var platform = typeof pl == undefined ? "prod" : pl;
      var url = setUrl(platform, "url_1");
      var feed = $.getJSON(url);
      var title = getTitle("base_app", langIso);
      feed.done(function(data) {

        var chartData = buildData(data);

        createChart({
          title: title,
          series: [{
            name: conf,
            data: chartData.ncumul_conf
          }, {
            name: hosp,
            data: chartData.ncumul_hosp
          }, {
            name: deceased,
            data: chartData.ncumul_deceased
          }],
          seriesColors: defaults.seriesColors,
          categories: chartData.dates
        });
      });

    }

    function intithosp(pl) {
      var platform = typeof pl == undefined ? "prod" : pl;
      var url = setUrl(platform, "url_2");
      var feed = $.getJSON(url);
      var title = getTitle("hosp_app", langIso);
      feed.done(function(data) {
        var chartData = buildHospData(data);
        createChart({
          title: title,
          series: [{
            name: hosp,
            data: chartData.current_hosp
          }],
          seriesColors: defaults.seriesColors,
          categories: chartData.dates
        });
      });
    }

    function createChart(params) {

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
        seriesColors: params.seriesColors,
        series: params.series,
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
      init: init,
      inithosp: intithosp
    };
  })();
*/
})(jQuery);