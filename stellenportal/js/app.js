(function () {
  window.sp = (function () {
    var url =
      "https://k4cxuy5os6.execute-api.eu-west-1.amazonaws.com/default/DynamoDBHttpEndpoint/?TableName=StellenPortal";

    var translations = {
      de: {
        jobtitle: "Stellentitel",
        department: "Amt",
        application_due: "Anmeldefrist",
        overview: "Übersicht",
        open_jobs: "Offene Stellen:",
        noresulttext:
          "Derzeit sind keine offenen Stellen ausgeschrieben, weitere Stellen finden Sie unter <a href='https://www.gr.ch/stellen'>www.gr.ch/stellen</a>.",
      },
      it: {
        jobtitle: "Posizione",
        department: "Ufficio",
        application_due: "Termine di annuncio",
        overview: "Panoramica impieghi",
        open_jobs: "Posti vacanti:",
        noresulttext:
          "Attualmente non sono pubblicati posti vacanti, altri posti vacanti si trovano su <a href='https://www.gr.ch/impieghi'>www.gr.ch/impieghi</a>.",
      },
      rm: {
        jobtitle: "Plazza",
        department: "Uffizi",
        application_due: "Termin d'annunzia",
        overview: "Survista da las plazzas",
        open_jobs: "Plazzas libras:",
        noresulttext:
          "Actualmain n'èn publitgadas naginas plazzas libras. Ulteriuras plazzas chattais Vus sut <a href='https://www.gr.ch/plazzas'>www.gr.ch/plazzas</a>.",
      },
    };

    /*  getUrlParameter
          get parameter (name) of query string
      */
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    async function fetchData(url) {
      var response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    }

    /*  updateQueryStringParameter
        update the query string with new value
    */
    function updateQueryStringParameter(uri, key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf("?") !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2");
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
            data: lo,
          });
        });
      }
      // console.log(out);
      return out;
    }

    function departmentList(objects, bi) {
      // console.log(objects);
      var bid = typeof bi === "undefined" ? null : bi;
      var departments = [];
      objects.forEach(function (o) {
        var d = o.Department;
        if (bid) {
          if (departments.indexOf(d) === -1 && o.businessUnitId === bid) {
            departments.push(d);
          }
        } else {
          if (departments.indexOf(d) === -1) {
            departments.push(d);
          }
        }
      });
      var out = [];
      departments.forEach(function (o) {
        var obj = objects.filter(function (e) {
          return e.Department == o;
        });
        if (bid) {
          obj = objects.filter(function (e) {
            return e.Department == o && e.businessUnitId === bid;
          });
        }
        out.push({
          title: o,
          value: o.toLowerCase(),
          count: obj.length,
          data: obj,
        });
      });

      return out;
    }
    function makeCopyLink(href) {
      var regex = /[a-z]{1,}=&/gim;
      var regex2 = /[a-z]{1,}=$/gim;
      var link = updateQueryStringParameter(
        updateQueryStringParameter(href, "standalone", "1"),
        "hidedepartment",
        "false",
      );
      return link.replace(regex, "").replace(regex2, "");
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

    async function init() {
      /*
        if used as embed the data attributes will be rendered on div.EmbedExternalContent => base
        $("body") as base will be only needed for direct use
      */
      var a = document.querySelector(".sp-app");
      var embed = a.parentNode.classList.contains("EmbedExternalContent") ? true : false;
      var base = embed ? a.parentNode : document.body;
      var json = await fetchData(url);
      var query =
        base.getAttribute("data-department") != undefined
          ? decodeURIComponent(base.getAttribute("data-department"))
          : ""; //getUrlParameter("department");
      //console.log(query);
      var langQuery =
        base.getAttribute("data-language") != undefined
          ? decodeURIComponent(base.getAttribute("data-language"))
          : ""; //getUrlParameter("language");
      console.log(langQuery);
      var typeQuery =
        base.getAttribute("data-type") != undefined
          ? decodeURIComponent(base.getAttribute("data-type"))
          : ""; // getUrlParameter("type");
      //console.log(typeQuery);
      var hideDepartment =
        base.getAttribute("data-hidedepartment") != undefined
          ? decodeURIComponent(base.getAttribute("data-hidedepartment"))
          : "";
      console.log(hideDepartment);
      var noResultText =
        base.getAttribute("data-noresulttext") != undefined
          ? decodeURIComponent(base.getAttribute("data-noresulttext"))
          : "";
      //console.log(noResultText)
      if (query) query = query.toLowerCase();
      var standalone = base.getAttribute("data-standalone"); //getUrlParameter("standalone");
      if (!standalone) document.querySelector("body").classList.add("build");
      if (embed) {
        $(".sp-app").addClass("embed");
      }
      if (langQuery) langQuery = langQuery.toLowerCase();
      // vm.noresulttext = noResultText;
      //   console.log(noResultText)
      var vm = new Vue({
        el: ".sp-app",
        data: {
          data: [],
          departments: [],
          languages: [],
          types: [],
          standalone: false,
          count: "",
          query: query ? query : "",
          lquery: "",
          typequery: "",
          copylink: "",
          tooltip: "",
          selectedlanguage: "de",
          noresulttext: "",
          translations: translations,
          hidedepartment: hideDepartment,
          toggle: false,
        },
        methods: {
          applicationLink(link, title) {
            return `<a data-fancybox data-type='iframe' data-width='100%' data-height='100%' data-src='${link}' href='${link}'>${title}</a>`;
          },

          changeDepartment: function (event) {
            var query = event.target.value;
            query = query
              ? query
                  .replace(/\(\d{1,}\)/gm, "")
                  .trim()
                  .toLowerCase()
              : "";
            //console.log(query);
            location.href = updateQueryStringParameter(
              location.href,
              "department",
              encodeURIComponent(query),
            );
          },
          changeLanguage: function (event) {
            var query = event.target.value;
            query = query
              ? query
                  .replace(/\(\d{1,}\)/gm, "")
                  .trim()
                  .toLowerCase()
              : "";
            var href = location.href.replace(/\?.{1,}$/gi, "");
            // var hrefPlus = updateQueryStringParameter(href, "noresulttext", encodeURIComponent(this.getTranslation("noresulttext",query)));
            // console.log(hrefPlus);
            location.href = updateQueryStringParameter(
              href,
              "language",
              encodeURIComponent(query),
            );
            this.selectedlanguage = query;
          },
          changeType: function (event) {
            var query = event.target.value;
            query = query
              ? query
                  .replace(/\(\d{1,}\)/gm, "")
                  .trim()
                  .toLowerCase()
              : "";
            //console.log(query);
            location.href = updateQueryStringParameter(
              location.href,
              "type",
              encodeURIComponent(query),
            );
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
            var out = trans["de"].hasOwnProperty(prop)
              ? trans["de"][prop]
              : "missing translation for " + prop;
            if (trans.hasOwnProperty(lang) && trans[lang].hasOwnProperty(prop))
              out = trans[lang][prop];
            return out;
          },
          getNoresultText(prop, lang) {
            console.log(lang);
            return this.getTranslation(prop, lang);
          },
          updateCopyLink() {
            var noResultText = this.noresulttext;
            var hide = vm.toggle;
            return (this.copylink = updateQueryStringParameter(
              updateQueryStringParameter(
                this.copylink,
                "noresulttext",
                encodeURIComponent(noResultText),
              ),
              "hidedepartment",
              hide,
            ));
          },
          updateonkeyup() {
            var link = this.copylink;
            this.copylink = updateQueryStringParameter(
              link,
              "noresulttext",
              encodeURIComponent(this.noresulttext),
            );
          },
          showEditor(e) {
            e.preventDefault();
            document.querySelector(".no-result-text-editor").classList.toggle("hidden");
          },
        },
        filters: {
          lowercase: function (str) {
            return str.toLowerCase();
          },
          date: function (str) {
            var arr = str.split("-");
            return arr[2] + "." + arr[1] + "." + arr[0];
          },
        },
      });

      /* process json */
      var all = json.Items;
      var filteredData = [];
      var languages = languageList(all);
      var departments = [];
      var types = [];
      vm.standalone = standalone ? true : false;
      vm.languages = languages;
      // console.log(vm.toggle);

      if (langQuery) {
        vm.lquery = langQuery;
        vm.selectedlanguage = langQuery;
        filteredData = filterObjects(all, "language", langQuery);
        //console.log(filteredData);
        departments = departmentList(filteredData);
        console.log(noResultText);
        vm.noresulttext =
          noResultText == ""
            ? vm.getTranslation("noresulttext", langQuery)
            : decodeURIComponent(noResultText);
        types = typeList(filteredData);
        if (types.length > 1) {
          vm.types = types;
        }
        vm.departments = departments;
        vm.copylink = makeCopyLink(location.href); //updateQueryStringParameter(location.href, "standalone", "1");
        vm.hidedepartment = hideDepartment;
        vm.copylink = vm.updateCopyLink();
        if (query && !typeQuery) {
          vm.query = query;
          filteredData = filterObjects(filteredData, "Department", query);
          types = typeList(filteredData);
          if (types.length > 1) vm.types = types;
          vm.typequery = "";
          vm.copylink = makeCopyLink(location.href); //updateQueryStringParameter(location.href, "standalone", "1");
          vm.copylink = vm.updateCopyLink();
        } else if (typeQuery && !query) {
          vm.typequery = typeQuery;
          vm.query = "";
          filteredData = filterObjects(filteredData, "businessUnitId", typeQuery);
          vm.departments = departmentList(filteredData, typeQuery);
          vm.copylink = makeCopyLink(location.href); // updateQueryStringParameter(location.href, "standalone", "1");
          vm.copylink = vm.updateCopyLink();
        } else if (query && typeQuery) {
          vm.query = query;
          filteredData = filterObjects(filteredData, "Department", query);
          vm.typequery = typeQuery;
          filteredData = filterObjects(filteredData, "businessUnitId", typeQuery);
          vm.departments = departmentList(filteredData, typeQuery);
          vm.copylink = makeCopyLink(location.href); // updateQueryStringParameter(location.href, "standalone", "1");
          vm.copylink = vm.updateCopyLink();
        }
      }

      //console.log(filteredData);
      vm.count = filteredData.length;
      vm.data = filteredData;
      // });
      //
      Fancybox.bind("[data-fancybox]", {});
    }

    return {
      init: init,
    };
  })();

  document.addEventListener("DOMContentLoaded", function (event) {
    window.sp.init();

    // $('#editor').trumbowyg({
    //               btns: [['strong', 'em',], ['link'],['viewHTML']],
    //               autogrow: true
    //           });
  });
})();
