(function ($) {

  window.autocomplete = (function () {
    var messages = {
      de: {
        street_not_found: 'Die Strasse "{street}" wurde nicht gefunden unter der PLZ {plz} - bitte prüfen Sie, ob die Adressdaten alle korrekt ausgefüllt sind.',
        no_ch_plz: '{plz} ist keine Schweizer Postleitzahl',
        success: 'Die Strasse "{street}" wurde unter der angegebenen PLZ {plz} gefunden!',
        enter_valid_plz: "Bitte geben Sie eine gültige Postleitzahl ein!",
        plz_city_not_conform: `Die Postleitzahl {plz} stimmt nicht mit dem Ort {city} überein!`,
        state_not_correct: `Bitte verwenden Sie für die Angabe des Kantons die Abkürzung.<br>Richtig: <i>{state}</i><br>Eingegeben: <i>{entered_state}</i>.`
      }
    };
    var styles = `.ac-autocomplete,
    .ac-autocomplete * {
      box-sizing: border-box;
    }

    .ac-autocomplete {
      background-color: #dadada;
      list-style: none;
      width: 320px;
      max-width: 100%;
      margin: 0;
      padding: 5px;
      border: 1px solid #dadada;
      position: absolute;
      z-index: 2000;
      display: none;
      font-size: 0.825rem;
    }

    input.ac-alert {
      color: #f05108 !important;
      border-color: #f05108 !important;
    }

    input.ac-error {
      color: #ac0909;
      border-color: #ac0909;
    }

    .has-ac.ac-on {
      position: relative;
      z-index: 2000;
    }

    .has-ac.ac-on .ac-autocomplete {
      display: block;
    }

    .filled.ac-on .ac-autocomplete {
      display: none;
    }

    .ac-autocomplete li {
      margin: 0 0 3px 0;
    }

    .ac-autocomplete[data-prop=POSTLEITZAHL] li {
      display: inline-block;
      margin: 0 5px 5px 0;
    }

    .ac-autocomplete[data-prop=ORTBEZ27] li {
      display: inline-block;
      margin: 0 5px 5px 0;
    }

    .ac-autocomplete .insert {
      cursor: pointer;
      display: inline-block;
      padding: 5px 10px;
      background: #0069B4;
      color: #fff;
    }

    .ac-autocomplete .insert:hover {
      background: #E6F0F8;
      color: #202020;
    }

    .ac-submit-text {
      margin-top: 30px;
      font-family: inherit;
      font-weight: bold;
      font-size: 0.825rem;
    }

    .ac-submit-text .inner {
      padding: 10px;
      border: 1px solid #dadada;
    }
    .ac-submit-text .inner + .inner {
      margin-top: 5px;
    }

    .ac-success {
      color: #065814;
    }

    .ac-alert {
      color: #f05108;
    }

    .ac-error {
      color: #ac0909;
    }`;

    function loadstyles(str) {
      var head = $('head');
      if (head.find("#ac-styles").length == 0) {
        head.append("<style id='ac-styles'>" + minifyCssString(str) + "</style>");
      }
    }

    function minifyCssString(css) {
      return css.replace(/\n/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(/\s?{\s?/gm, '{')
        .replace(/\s?}\s?/gm, '}')
        .replace(/\s?:\s?/gm, ':')
        .replace(/\s?;\s?/gm, ';')
        .replace(/\s?;\s?}/gm, '}');
    }

    function loadstylesheet(url) {
      var head = $('head');
      var css = "<link rel='stylesheet' id='autocomplete-styles' href='" + url + "' media='all' >"
      if (head.find("#autocomplete-styles").length == 0) {
        head.append(css);
      }
    }

    function replace(str, r) {
      console.log(r)
      var replacements = Object.entries(r);
      var out = str;
      for (var [key, value] of replacements) {
        var rep = new RegExp("\{" + key + "\}", "gm");
        // console.log(rep)
        // console.log(value)
        out = out.replace(rep, value);
      }
      return out;
    }

    function capitalize(str) {
      if (typeof str === 'string') {
        return str.replace(/^\w/, function (c) {
          return c.toUpperCase();
        });
      } else {
        return '';
      }
    }

    function buildAutoComplete(params) {
      var data = params.data;
      var prop = params.prop;
      var tempid = params.id;
      var plz = params.plz;
      var city = params.city;
      var state = params.state;
      var id = tempid.attr("id");
      var form = params.form;
      var out = [];
      if (data.length) {
        deleteAc();
        $("#" + id).parent("div").addClass("has-ac ac-on");
        out.push("<ul class='ac-autocomplete' data-prop='" + prop + "' data-id='" + id + "' id='ac-" + prop.toLowerCase() + "'>");
        var oIndex = 0;
        for (var d of data) {
          out.push("<li class='ac-item'><span class='insert' data-object='" + JSON.stringify(d) + "'>" + d[prop] + "</span></li>");
          oIndex++;
        }
        out.push("</ul>");
      }

      $(out.join("")).insertAfter("#" + id);
      select({
        city: city,
        plz: plz,
        state: state,
        form: form
      });
    }

    function select(params) {
      var $ac = $(".ac-autocomplete");
      var city = params.city;
      var plz = params.plz;
      var state = params.state;
      var form = params.form;
      $ac.each(function () {
        var $acl = $(this);
        var prop = $(this).attr("data-prop");
        $(".insert", $acl).each(function () {
          $(this).on("click", function () {
            var object = JSON.parse($(this).attr("data-object"));
            console.log(object);
            console.log(prop);
            fill(city, object.ORTBEZ27);
            fill(state, object.KANTON);
            if (prop === "POSTLEITZAHL") {
              fill(plz, object.POSTLEITZAHL);
            }

            selectCountries(form);
            // if (prop === "ORTBEZ27") {
            //   fill(city, object.ORTBEZ27);
            //   fill(state, object.KANTON);
            // }
            $acl.parents(".has-ac").removeClass("ac-on");
          });
        });
      });
    }

    function markFocus() {
      var inputClasses = ".form-group > input, .form-group > textarea, .wai-text-box input, .wai-text-box textarea, .input-item input, .input-item textarea, .WaiTextBox > input";
      $("body").on("keyup", inputClasses, function () {
        $(this).parent().toggleClass("filled", $(this).val() !== "");
      });
      $("body").on("focus", inputClasses, function () {
        $(this).parent().addClass("focused");
        $(this).parent().siblings(".has-ac").removeClass("ac-on");
      });
      $
      $("body").on("focus", inputClasses, function () {
        $(this).parent('.has-ac').addClass("ac-on");
      });
      $("body").on("blur", inputClasses, function (e) {
        $(this).parent().removeClass("focused");
      });
    }

    function deleteClasses() {
      return $('body').find(".has-ac").removeClass("ac-on").removeClass("has-ac");
    }

    function deleteAc() {
      $('body').find(".ac-autocomplete").remove();
      deleteClasses();
    }

    // function getFormData() {
    //   var out = {};
    //   var inputs = $("form input");
    //   $.each(inputs, function () {
    //     out[$(this).attr("name")] = $(this).val();
    //   });
    //   return out;
    // }

    function renderAddressData(obj) {
      var out = [];
      for (var key in obj) {
        if (key !== "count" && key !== "run") out.push(obj[key])
      }
      return out;
    }
    // function renderFormData(obj) {
    //   var out = [];
    //   var entries = Object.entries(obj);
    //   for (var [key, value] of entries) {
    //     out.push(`${key}: ${value}`);
    //   }
    //   return out;
    // }
    function execStreet(str) {
      var regexStreet = /(.*?)\s+\d+/gi;
      return str.length && str.match(regexStreet) ? regexStreet.exec(str)[1] : str;
    }

    function testPLZ(str) {
      var regex = /^[1-9]\d{3}$/gm;
      return regex.test(str);
    }

    function baseUrl() {
      return "https://vdk8qyhmsa.execute-api.eu-west-1.amazonaws.com/PROD/?";
    }

    function plzQuery(plz) {
      return baseUrl() + "index_name=index-postleitzahl&rec_art_name=plz1&searchterm=" + plz;
    }

    function strQuery(street) {
      return baseUrl() + "index_name=INDEX-STRBEZL&rec_art_name=STR&searchterm=" + capitalize(street);
    }

    function onrpQuery(onrp) {
      return baseUrl() + "index_name=INDEX-ONRP&rec_art_name=STR&searchterm=" + onrp;
    }

    function renderMsg(content, e) {
      var submitText = $(".ac-submit-text");
      var clean = typeof e === "undefind" ? true : e;
      if (clean) {
        submitText.html('');
        submitText.html("<div class='inner'>" + content + "</div>");
      } else {
        submitText.append("<div class='inner'>" + content + "</div>");
      }
    }

    function errorMsg(content) {
      return "<div class='error'>" + content + "</div>";
    }

    function alertMsg(content) {
      return "<div class='ac-alert'>" + content + "</div>";
    }

    function successMsg(content) {
      return "<div class='ac-success'>" + content + "</div>";
    }

    async function checkAddress(formdata, params) {
      //var formdata = getFormData();
      var plz = formdata.hasOwnProperty("plz") ? formdata.plz : null;
      var city = formdata.hasOwnProperty("city") ? capitalize(formdata.city) : null;
      var street = formdata.hasOwnProperty("street") ? formdata.street : null;
      var streetVal = street ? capitalize(execStreet(street)) : null;
      var state = formdata.hasOwnProperty("state") ? formdata.state : null;
      var valid = 0;
      var rendered = renderAddressData(formdata).join("<br>");

      if (plz) {
        valid = 1;
        if (testPLZ(plz)) {
          try {
            var plzr = await axios.get(plzQuery(plz));
            var plzd = plzr.data;
            console.log(`Check for ${plz}`);
            console.log(plzd);
            if (plzd.hasOwnProperty("Items") && plzd.Items.length) {
              var plzItems = plzd.Items;
              var onrpObj = plzItems.filter(function (o) {
                return o.POSTLEITZAHL == plz && o.ORTBEZ27 == city.trim();
              });
              if (onrpObj.length) {
                var onrp = onrpObj[0].ONRP;
                // 1717
                try {
                  var streetr = await axios.get(onrpQuery(onrp));
                  console.log(streetr);
                  var streetObj = Array.isArray(streetr.data) ? [] : streetr.data.Items.filter(function (o) {
                    return o.STRBEZ2L.replace(";", "") == streetVal.trim();
                  });
                  if (streetObj.length == 0) {
                    //`Die Strasse "${streetVal}" wurde nicht gefunden unter der PLZ ${plz} - bitte prüfen Sie, ob die Adressdaten alle korrekt ausgefüllt sind`
                    renderMsg(alertMsg(replace(messages.de.street_not_found, {
                      street: streetVal,
                      plz: plz
                    })), true);
                    $(params.street).addClass("ac-alert");
                  } else {
                    renderMsg(successMsg(replace(messages.de.success, {
                      street: streetVal,
                      plz: plz
                    })), true);
                  }
                } catch (error) {
                  console.log(error);
                }
                var tempState = onrpObj[0].KANTON;
                // console.log(tempState)
                if (state.toUpperCase() !== tempState) {
                  renderMsg(alertMsg(replace(messages.de.state_not_correct, {
                    entered_state: state,
                    state: tempState
                  })), false);
                  $(params.state).addClass("ac-alert");
                }
              } else {
                renderMsg(alertMsg(replace(messages.de.plz_city_not_conform, {
                  plz: plz,
                  city: city
                })));
                $(params.city).addClass("ac-alert");
                $(params.plz).addClass("ac-alert");
              }
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          renderMsg(alertMsg(replace(messages.de.no_ch_plz, {
            plz: plz
          })));
          $(params.plz).addClass("ac-error");
        }
      } else {
        renderMsg(errorMsg(messages.de.enter_valid_plz));
      }
    }

    function sortCities(c) {
      return c.sort(function (a, b) {
        var cityA = a.ORTBEZ27.toUpperCase();
        var cityB = b.ORTBEZ27.toUpperCase();
        if (cityA < cityB) return -1;
        if (cityA > cityB) return 1;
        return 0;
      });
    }

    function sortPlz(d) {
      return d.sort(function (a, b) {
        return a.POSTLEITZAHL - b.POSTLEITZAHL;
      });
    }

    function testForCountriesList() {
      var dd = $("body").find("select");
      var out = null;
      $.each(dd, function() {
        var html = $(this).html();
        if (/value=["|']CH["|']/gmi.test(html)) out = $(this);
      });
      return out;
    }
    function selectCountries(form) {
      var container = typeof form === "undefined" ? $("body") : form;
      var select = testForCountriesList();
      if (select) select.val("CH");
    }

    function checkPlz(params) {
      var plz = params.plz,
        city = params.city,
        state = params.state,
        form = params.form;
      plz.on("blur", function (e) {
        var plzVal = plz.val();
        if (testPLZ(plzVal)) {
          axios.get(plzQuery(plzVal)).then(function (response) {
            console.log("plz on blur");
            console.log(response);
            var items = Array.isArray(response.data) ? [] : response.data.Items;
            return items;
          }).then(function (items) {
            console.log("then work with the items");
            deleteAc();
            if (items.length == 1) {
              fill(city, items[0].ORTBEZ27);
              fill(state, items[0].KANTON);
              selectCountries(form);
            } else if (items.length > 1) {
              console.log("has more than one street")
              buildAutoComplete({
                data: sortCities(items),
                prop: "ORTBEZ27",
                id: city,
                city: city,
                plz: plz,
                state: state,
                form: form
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      });
    }

    function fill(input, value) {
      $(input).val(value).parent('div').addClass("filled");
    }

    function empty(input) {
      $(input).val("").parent("div").removeClass("filled");
    }

    function removeAlerts() {
      $("body").find("input.ac-alert").removeClass("ac-alert");
      $("body").find("input.ac-error").removeClass("ac-error");
    }

    function doCheck(params, values) {
      console.log(params.count + " check");
      $(params.submitText).html('');
      removeAlerts();
      var street = $(params.street).val(),
        plz = $(params.plz).val(),
        city = $(params.city).val(),
        state = $(params.state).val(),
        run = params.run;
      if (street && plz && city && state) run = 0;
      values = {
        count: params.count,
        run: run,
        street: street,
        plz: plz,
        city: city,
        state: state
      };
      return values;

    }

    function checkPeriodically(params) {
      var street = params.street,
        plz = params.plz,
        city = params.city,
        state = params.state,
        submitText = params.submitText;
      var c = 0;
      var run = params.run;
      var values = {
        count: 0,
        run: run,
        street: '',
        plz: '',
        city: '',
        state: ''
      };

      (function check() {
        setTimeout(() => {

          values = doCheck({
            count: c,
            street: street,
            run: run,
            plz: plz,
            city: city,
            state: state,
            submitText: submitText
          }, values);
          console.log(values);
          c++;
          run = values.run
          if (run == 1) {
            check();
          } else {
            checkAddress(values, {
              street: street,
              plz: plz,
              city: city,
              state: state,
              submitText: submitText
            });
          }
        }, 1000);
      })();
    }

    function startCheckOnBlur(options) {
      $(options.street).on("blur", function () {
        checkPeriodically(options);
      });
      $(options.plz).on("blur", function () {
        checkPeriodically(options);
      });
      $(options.city).on("blur", function () {
        checkPeriodically(options);
      });
      $(options.state).on("blur", function () {
        checkPeriodically(options);
      });
    }

    function turnOffAcAll(form) {
      var container = typeof form === "undefined" ? $("body") : $(form);
      var elements = $("input, textarea, select")
      var inputs = container.find(elements);
      if (inputs.length) {
        $.each(inputs, function() {
          $(this).attr("autocomplete", "custom")
        });
      }
    }
    function turnOffAc(params) {
      $(params.plz, params.city, params.state).attr("autocomplete", "custom");
    }

    function initAutoComplete(params) {
      var settings = $.extend({
        street: $("#street"),
        plz: $("#plz"),
        city: $("#city"),
        state: $("#state"),
        submitText: $(".ac-submit-text"),
        submit: $("#submit"),
        form: $("form")
      }, params);
      var street = settings.street,
        plz = settings.plz,
        city = settings.city,
        state = settings.state,
        submitText = settings.submitText,
        form = settings.form;

      turnOffAcAll(form);
      street.on("blur", function (e) {
        console.log(street.val());
        var value = street.val();

        deleteAc();
        var streetVal = execStreet(value);
        if (streetVal) {
          console.log(streetVal)
          axios.get(strQuery(streetVal)).then(function (response) {

            console.log(response);
            var data = response.data;
            return data;
          }).then(function (data) {
            console.log("then work with the data");
            console.log(data)
            if (data.length == 1) {
              var d = data[0];
              if (d.hasOwnProperty("noresult") && d.noresult == 1) {
                checkPlz({
                  plz: plz,
                  city: city,
                  state: state,
                  form: form
                });
              } else {
                fill(plz, d.POSTLEITZAHL);
                fill(city, d.ORTBEZ27);
                fill(state, d.KANTON);
                selectCountries(form);
              }

            } else if (data.length > 1) {
              buildAutoComplete({
                data: sortPlz(data),
                prop: "POSTLEITZAHL",
                id: plz,
                city: city,
                state: state,
                plz: plz,
                form: form
              });
            } else {
              checkPlz({
                plz: plz,
                city: city,
                state: state,
                form: form
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      });

      plz.on("keydown", function (e) {
        var keyCode = e.keyCode;
        console.log(keyCode);
        if (keyCode != 9 && keyCode != 13) {
          empty(city);
          empty(state);
          deleteAc();
        }
      });

      checkPlz({
        plz: plz,
        city: city,
        state: state,
        form: form
      });

      var options = {
        street: street,
        plz: plz,
        city: city,
        state: state,
        submitText: submitText,
        run: 1
      };
      startCheckOnBlur(options);

    }

    function submitText() {
      return $("<div class='ac-submit-text'></div>");
    }

    function getId(cl) {
      return "#" + $(cl + " > input").attr("id");
    }

    return {
      init: initAutoComplete,
      markFocus: markFocus,
      loadstylesheet: loadstylesheet,
      submitText: submitText,
      getId: getId,
      loadstyles: loadstyles,
      styles: styles
    }
  })();


  $(function () {
    console.log("document ready");
    var inapp = location.href.indexOf("localhost:") > -1 || location.href.indexOf('127.0.0.1:8080/') > -1 ? false : true;
    if (inapp) autocomplete.loadstyles(autocomplete.styles);
    autocomplete.markFocus();
    if (!inapp) autocomplete.init();
    var submitText = autocomplete.submitText();
    var digitalproduct = $(".digital-product-property-form");
    var profile = $(".ECRegisterManageAccount");
    var payment = $(".CheckOutWizardControlViewAddresses > .Payment");
    var delivery = $(".CheckOutWizardControlViewAddresses > .Delivery")
    if (digitalproduct.length) {
      digitalproduct.append(submitText);
      autocomplete.init({
        street: $("#addProp_BillingAddress"),
        plz: $("#addProp_BillingZipCode"),
        city: $("#addProp_BillingCity"),
        state: $("#addProp_BillingKanton"),
        form: digitalproduct
      });
    }
    if (profile.length) {
      profile.append(submitText);
      autocomplete.init({
        street: $(autocomplete.getId(".Address")),
        plz: $(autocomplete.getId(".ZipCode")),
        city: $(autocomplete.getId(".City")),
        state: $(autocomplete.getId(".State")),
        form: profile
      });
    }
    if (payment.length) {
      payment.append(submitText);
      autocomplete.init({
        street: $(autocomplete.getId(".PaymentAddress")),
        plz: $(autocomplete.getId(".PaymentPostalCode")),
        city: $(autocomplete.getId(".PaymentCity")),
        state: $(autocomplete.getId(".PaymentState")),
        form: payment
      });
    }
    if (delivery.length) {
      delivery.append(submitText);
      autocomplete.init({
        street: $(autocomplete.getId(".DeliveryAddress")),
        plz: $(autocomplete.getId(".DeliveryPostalCode")),
        city: $(autocomplete.getId(".DeliveryCity")),
        state: $(autocomplete.getId(".DeliveryState")),
        form: delivery
      });
    }
  });
})(jQuery);