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

  function getTags(tags) {
    let tempTags = tags.replace(/,/gmi, ";")
    const keywordsArray = tempTags.indexOf(";") > -1 ? tempTags.split(";") : [tempTags];
    const tagsArray = [];
    keywordsArray.forEach((tag) => {
      tag = tag.trim();
      if (tag.indexOf("#") > -1) {
        tagsArray.push(tag.replace('#', ''));
        //console.log(tagsArray);
      }
    });
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
    getText: getText
  }

  
})();

export default utils;