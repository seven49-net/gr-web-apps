(function() {
  window.sp = (function() {
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

    function departmentList(objects) {
      var departments = [];
      objects.forEach(function(o) {
        var d = o.Department;
        if (departments.indexOf(d)) {
          departments.push(d);
        }
      });
      return departments;
    }

    function filterObjects(objects, ex) {
      var expression = decodeURIComponent(ex).trim().toLowerCase();
      var out = objects.filter(function(o) {
        return expression == o.Department.toLowerCase();
      });
      console.log(out);
      return out;
    }
    function init() {
      //console.log("init app");
      var json = axios.get(url);
      var query = getUrlParameter("department") ;
      if (query) query = query.toLowerCase();
      var optionlist = document.querySelector("#departments");

      var vm = new Vue({
        el: "#sp-app",
        data: {
          data: [],
          options: [],
          query: ''
        },
        methods: {
          applicationLink(link, title) {
            return "<a href='" + link + "' target='_blank'>" + title + "</a>";
          },
          changeDepartment: function(event) {
            var query = event.target.value;
            location.href = updateQueryStringParameter(location.href, "department",encodeURIComponent(query.toLowerCase()));
          }
        },
        filters: {
          lowercase: function(str) {
            return str.toLowerCase()
          }
        }

      });




      json.then(function(response) {
        var data = response.data;
        var filteredData = data.Items;
        var departments = departmentList(data.Items);
        console.log(departments);

        if (query) filteredData = filterObjects(data.Items, query);
        vm.data = filteredData;
        vm.options = departments;
        if (query) vm.query = query;
      });
    }

    return {
      init: init
    };
  })();

  window.sp.init();
})();