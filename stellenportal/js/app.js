(function () {
  window.sp = (function () {
    var url = "https://k4cxuy5os6.execute-api.eu-west-1.amazonaws.com/default/DynamoDBHttpEndpoint/?TableName=StellenPortal";

    var translations = {
      "de": {
        "jobtitle": "Stellentitel",
        "department": "Amt",
        "application_due": "Anmeldefrist",
        "overview": "Übersicht",
        "open_jobs": "Offene Stellen:"
      },
      "it": {
        "jobtitle": "Posizione",
        "department": "Ufficio",
        "application_due": "Termine di annuncio",
        "overview": "Panoramica impieghi",
        "open_jobs": "Posizioni abierti:"
      },
      "rm": {
        "jobtitle": "Plazza",
        "department": "Uffizi",
        "application_due": "Termin d'annunzia",
        "overview": "Survista da las plazzas",
        "open_jobs": "Offene Stellen:"
      }
    };

    /*  getUrlParameter
          get parameter (name) of query string
      */
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    /*  updateQueryStringParameter
        update the query string with new value
    */
    function updateQueryStringParameter(uri, key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf('?') !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
      }
      return uri + separator + key + "=" + value;
    }

    function languageList(objects) {

      var languages = [];
      objects.forEach(function (o) {
        if (languages.indexOf(o.language) === -1) languages.push(o.language);
      });
      var out = [];
      if (languages.length) {
        languages.forEach(function (l) {
          var lo = objects.filter(function (e) {
            return e.language == l;
          });
          out.push({
            title: l,
            value: l.toLowerCase(),
            count: lo.length,
            data: lo
          });
        });
      }
      // console.log(out);
      return out;
    }

    function departmentList(objects) {
      // console.log(objects);
      var departments = [];
      objects.forEach(function (o) {
        var d = o.Department;
        if (departments.indexOf(d) === -1) {
          departments.push(d);
        }
      });
      var out = [];
      departments.forEach(function (o) {
        var obj = objects.filter(function (e) {
          return e.Department == o;
        });
        out.push({
          title: o,
          value: o.toLowerCase(),
          count: obj.length,
          data: obj
        });
      });

      return out;
    }

    function typeList(objects) {
      var types = [];
      objects.forEach(function (o) {
        if (types.indexOf(o.businessUnitId) == -1) types.push(o.businessUnitId);
      });
      return types;
    }

    function filterObjects(objects, prop, ex) {
      var expression = decodeURIComponent(ex).trim().toLowerCase();
      var out = objects.filter(function (o) {
        return expression == o[prop].toLowerCase();
      });
      // console.log(out);
      return out;
    }

    function init() {
      //console.log("init app");
      var json = axios.get(url);
      var query = getUrlParameter("department");
      var langQuery = getUrlParameter("language");
      var typeQuery = getUrlParameter("type");
      if (query) query = query.toLowerCase();
      var standalone = getUrlParameter("standalone");
      if (!standalone) document.querySelector("body").classList.add("build");
      if (langQuery) langQuery = langQuery.toLowerCase();

      var vm = new Vue({
        el: "#sp-app",
        data: {
          data: [],
          departments: [],
          languages: [],
          types: [],
          standalone: false,
          count: '',
          query: '',
          lquery: '',
          typequery: '',
          copylink: '',
          tooltip: '',
          selectedlanguage: "de",
          translations: translations
        },
        methods: {
          applicationLink(link, title) {
            return "<a href='" + link + "' target='_blank'>" + title + "</a>";
          },
          changeDepartment: function (event) {
            var query = event.target.value;
            query = (query) ? query.replace(/\(\d{1,}\)/gm, "").trim().toLowerCase() : '';
            //console.log(query);
            location.href = updateQueryStringParameter(location.href, "department", encodeURIComponent(query));
          },
          changeLanguage: function (event) {
            var query = event.target.value;
            query = (query) ? query.replace(/\(\d{1,}\)/gm, "").trim().toLowerCase() : '';
            var href = location.href.replace(/\?.{1,}$/gi, "");
            location.href = updateQueryStringParameter(href, "language", encodeURIComponent(query));
            this.selectedlanguage = query;
          },
          changeType: function (event) {
            var query = event.target.value;
            query = (query) ? query.replace(/\(\d{1,}\)/gm, "").trim().toLowerCase() : '';
            //console.log(query);
            location.href = updateQueryStringParameter(location.href, "type", encodeURIComponent(query));
          },
          copyLinkToClipord: function () {
            var input = document.querySelector("#copy-link-input");
            input.select();
            document.execCommand("copy");
            // console.log("copied: " + link);
            this.tooltip = input.value;
          },
          getTranslation(prop, lang) {
            var trans = this.translations;
            var out = trans["de"].hasOwnProperty(prop) ? trans["de"][prop] : "missing translation for " + prop;
            if (trans.hasOwnProperty(lang) && trans[lang].hasOwnProperty(prop)) out = trans[lang][prop];
            return out;
          }
        },
        filters: {
          lowercase: function (str) {
            return str.toLowerCase();
          },
          date: function (str) {
            var arr = str.split("-");
            return arr[2] + "." + arr[1] + "." + arr[0];
          }
        }

      });


      json.then(function (response) {
        var data = response.data;
        var all = data.Items;
        var filteredData = [];
        var languages = languageList(all);
        var departments = [];
        var types = [];
        vm.standalone = standalone ? true : false;
        vm.languages = languages;

        if (langQuery) {
          vm.lquery = langQuery;
          vm.selectedlanguage = langQuery;
          filteredData = filterObjects(all, "language", langQuery);
          //console.log(filteredData);
          departments = departmentList(filteredData);
          console.log(typeList(all));
          vm.departments = departments;
          vm.copylink = updateQueryStringParameter(location.href, "standalone", "1")
          if (query) {
            vm.query = query;
            filteredData = filterObjects(filteredData, "Department", query);
            types = typeList(filteredData);
            if (types.length > 1) vm.types = types;
            vm.typequery = '';
            vm.copylink = updateQueryStringParameter(location.href, "standalone", "1");
            if (typeQuery) {
              vm.typequery = typeQuery;
              filteredData = filterObjects(filteredData, "businessUnitId", typeQuery);
              vm.copylink = updateQueryStringParameter(location.href, "standalone", "1");
            }
          }
        }


        console.log(filteredData);
        vm.count = filteredData.length;
        vm.data = filteredData;
      });
    }

    return {
      init: init
    };
  })();

  window.sp.init();
})();