const utils = (() => {
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    return uri + separator + key + "=" + value;
  }

  function getTableSuffix() {
    var host = location.hostname;
    var tablesuffix = "klimawandel_gr_ch";
    var url = location.href;
    if (host.indexOf("gr.ch") > -1) {
      if (host === "cdn.gr.ch") {
        if (/\/int\//gmi.test(url)) tablesuffix = "intklimawandel_gr_ch";
      } else {
        tablesuffix = host.replace(/\./gmi, "_");
      }
    }
    return tablesuffix;
  }

  function getTags(tags) {
    let patt = /#[0-9a-z-@]+/gmi;
    let tempTags = tags.match(patt);
    const tagsArray = [];
    if (tempTags && tempTags.length) {
      tempTags.forEach((tag) => {
        tag = tag.trim();
        tagsArray.push(tag.replace('#', ''));
      });
    }
    //const keywordsArray = tempTags.indexOf(";") > -1 ? tempTags.split(";") : [tempTags];

    return tagsArray;
  }
  function getLanguage() {
    var lang = "de";
    var pathname = location.pathname;
    var pattern = /^\/[a-z]{2}\//gmi;
    if (pathname.match(pattern)) lang = pathname.match(pattern)[0].replace(/\//gm, "");
    return lang;
  }

  function getLangIso(elem) {
    var embed = checkEmbed(elem);
    let langIso = getLanguage();
    let querylang = utils.getUrlParameter("language");
    if (querylang) langIso = querylang;
    if (embed) {
      let langAttr = getLangAttribute(elem);
      if (langAttr) {
        langIso = langAttr;
      }
    }
    return langIso;
  }
  function trimStringInArray(array) {
		return array = array.map(function (el) {
  			return el.trim();
		});
  }
  function getText(str, length) {
    let count = length === "undefined" ? 0 : length;
    let cleaned = str.replace(/(<([^>]+)>)/gi, "");
    let out = cleaned;
    if(count) {
      if (cleaned.length > count-1) {
        out = cleaned.substring(0, length) + "...";
      }
    }
    return out;
    }
    function collectionHas(a, b) { //helper function (see below)
      for(var i = 0, len = a.length; i < len; i ++) {
          if(a[i] == b) return true;
      }
      return false;
  }
    function findParentBySelector(elm, selector) {
      var all = document.querySelectorAll(selector);
      var cur = elm.parentNode;
      while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
          cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
  }

    function checkEmbed(elem) {
      var embed = findParentBySelector(document.querySelector(elem), ".EmbedExternalContent");
      if (embed) return true;
      return false;
    }
    function getLangAttribute(elem) {
      let parent = document.querySelector(elem).parentElement;
      return parent.getAttribute("data-language");
    }

  return {
    getUrlParameter: getUrlParameter,
    updateQueryStringParameter: updateQueryStringParameter,
    getTags: getTags,
    trimStringInArray: trimStringInArray,
    getText: getText,
    getTableSuffix: getTableSuffix,
    getLanguage: getLanguage,
    checkEmbed: checkEmbed,
    getLangAttribute: getLangAttribute,
    getLangIso: getLangIso
  }


})();

export default utils;