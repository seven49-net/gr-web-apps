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
    if (host.indexOf("gr.ch") > -1) {
      tablesuffix = host.replace(/\./gmi, "_");
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

  return {
    getUrlParameter: getUrlParameter,
    updateQueryStringParameter: updateQueryStringParameter,
    getTags: getTags,
    trimStringInArray: trimStringInArray,
    getText: getText,
    getTableSuffix: getTableSuffix
  }


})();

export default utils;