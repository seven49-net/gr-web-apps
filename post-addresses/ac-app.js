(function () {
  window.autocomplete = (function () {
    function init() {
      console.log("autocomplete check");
    }

    return {
      init: init,
    };
  })();
  autocomplete.init();
})();
