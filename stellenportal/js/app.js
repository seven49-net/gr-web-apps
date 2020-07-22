(function () {
  window.sp = (function () {
    var url = "https://k4cxuy5os6.execute-api.eu-west-1.amazonaws.com/default/DynamoDBHttpEndpoint/?TableName=StellenPortal";

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
          })
        });
      }
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

    function filterObjects(objects, prop,  ex) {
      var expression = decodeURIComponent(ex).trim().toLowerCase();
      var out = objects.filter(function (o) {
        return expression == o[prop].toLowerCase();
      });
      console.log(out);
      return out;
    }

    function init() {
      //console.log("init app");
      var json = axios.get(url);
      var query = getUrlParameter("department");
      var langQuery = getUrlParameter("language");
      if (query) query = query.toLowerCase();
      if (langQuery) langQuery = langQuery.toLowerCase();

      var vm = new Vue({
        el: "#sp-app",
        data: {
          data: [],
          options: [],
          languages: [],
          count: '',
          query: '',
          lquery: ''
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
            //console.log(query);
            location.href = updateQueryStringParameter(location.href, "language", encodeURIComponent(query));
          }
        },
        filters: {
          lowercase: function (str) {
            return str.toLowerCase();
          }
        }

      });


      json.then(function (response) {
        var data = response.data;
        var filteredData = data.Items;
        var departments = departmentList(data.Items);
        var languages = languageList(data.Items);
        console.log(departments);
        // vm.data = filteredData;
        vm.options = departments;
        vm.languages = languages;

        if (query) {
          filteredData = filterObjects(data.Items, "Department",  query);
          vm.query = query;
        }

        if (langQuery) {
          vm.lquery = langQuery;
          if (query) {
            filteredData = filterObjects(filteredData,"language", langQuery);
          } else {
            filteredData = filterObjects(data.Items, "language", langQuery);
          }
        }

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