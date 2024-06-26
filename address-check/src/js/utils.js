//import { checkAddress } from "./checkAddress";

const apiUrl = "https://02ds7tjzm7.execute-api.eu-west-1.amazonaws.com/Prod";
const apiUrlPost = apiUrl + "?method=autocomplete4";

function specialCharacters(str) {
  return str
    .replace(/\u00dc/g, "Ue")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00c4/g, "Ae")
    .replace(/\u00e4/g, "ae")
    .replace(/\u00d6/g, "Oe")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00C9/g, "E")
    .replace(/\u00E9/g, "e")
    .replace(/\u00C8/g, "E")
    .replace(/\u00E8/g, "e")
    .replace(/\u00C0/g, "A")
    .replace(/\u00E0/g, "a")
    .replace(/\u00C1/g, "A")
    .replace(/\u00E1/g, "a")
    .replace(/,/g, " ")
    .replace(/ç/g, "c")
    .replace(/ê/g, "e")
    .replace(/â/g, "a")
    .replace(/á/g, "a")
    .replace(/à/g, "a")
    .replace(/é/g, "e")
    .replace(/è/g, "e");
}
function clean(str = "") {
  return str.trim();
}

function getStreetAndNumber(str = "", raw = false) {
  if (str.length) {
    str = str.trim();
    const s = str.split(" ");
    const regexStreet = /(.*?)(\s+\d+\s?[a-z]*)/gim;
    // str.length && str.match(regexStreet) ? regexStreet.exec(str)[1] : str;
    let street = str;
    let houseNumber = "";
    if (str.match(regexStreet)) {
      const sArr = regexStreet.exec(str);
      //console.log(sArr);
      street = sArr[1];
      houseNumber = sArr[2].trim();
    }
    return raw
      ? [street, houseNumber]
      : {
          StreetName: specialCharacters(street),
          HouseNo: houseNumber,
        };
  }
  return false;
}
const extend = function () {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (
          deep &&
          Object.prototype.toString.call(obj[prop]) === "[object Object]"
        ) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

function easyExtend(objA) {
  return { ...objA, ...objB };
}

function apiRequest(params = {}) {
  const request = {
    ONRP: 0,
    ZipCode: "",
    ZipAddition: "",
    TownName: "",
    STRID: 0,
    StreetName: "",
    HouseKey: 0,
    HouseNo: "",
    HouseNoAddition: "",
  };

  for (let [key, value] of Object.entries(params)) {
    // console.log(key, value);
    if (request.hasOwnProperty(key)) request[key] = value;
  }

  return {
    request: request,
    zipOrderMode: 0,
    zipFilterMode: 0,
  };
}

async function postData(data = {}, url = apiUrlPost) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  //console.log(response.ok);
  if (response.ok) {
    return response.json();
  }
}

function turnOffBrowserAC(form) {
  const container =
    typeof form === "undefined" ? document.querySelector("body") : form;
  const inputs = container.querySelectorAll("input, textarea, select");
  if (inputs.length) {
    inputs.forEach((element) => {
      element.setAttribute("autocomplete", "custom");
    });
  }
}

function deleteClasses() {
  const ac = document.querySelectorAll(".has-ac");
  if (ac.length) {
    ac.forEach((element) => {
      const classes = element.classList;
      classes.remove("ac-on");
      classes.remove("has-ac");
    });
  }
}

function deleteAc() {
  const aca = document.querySelectorAll(".ac-autocomplete");
  if (aca.length) {
    aca.forEach((element) => {
      element.remove();
    });
  }
  deleteClasses();
}

function testForCountriesList(form) {
  const dd = form
    ? form.querySelectorAll("select")
    : document.querySelectorAll("select");
  let out = null;
  if (dd.length) {
    dd.forEach((element) => {
      const html = element.innerHTML;
      if (/value=["|']CH["|']/gim.test(html)) out = element;
    });
  }
  return out;
}

function selectCountries(form) {
  const select = testForCountriesList(form);
  if (select) select.value = "CH";
}

function resetCountries(form) {
  // const container =
  //   typeof form === "undefined" ? document.querySelector("body") : form;
  const select = testForCountriesList(form);
  //console.log("reset", select);
  if (select) select.value = "";
}

function fill(input, value, time = 0) {
  if (input) {
    const parent = input.parentNode;
    if (parent.classList.contains("drop-down-list") && value === "CH") {
      value = "204";
    }
    input.value = value;
    parent.classList.add("filled");
    const err = parent.querySelector("label.error");
    if (err) {
      err.style = "display: none";
    }

    return;
  }
}

function addAlert(el) {
  el.classList.add("ac-alert");
}

function empty(input) {
  input.value = "";
  input.parentNode.classList.remove("filled");
}
function removeAlerts() {
  const alerts = document.querySelectorAll("input.ac-alert");
  const errors = document.querySelectorAll("ac-error");
  if (alerts.length) {
    alerts.forEach((element) => {
      element.classList.remove("ac-alert");
    });
  }
  if (errors.length) {
    errors.forEach((element) => {
      element.classList.remove("ac-alert");
    });
  }
}

function markFocus() {
  var inputs = document.querySelectorAll(
    ".form-group > input, .form-group > textarea, .wai-text-box input, .wai-text-box textarea, .input-item input, .input-item textarea, .WaiTextBox > input",
  );

  inputs.forEach((el) => {
    const parent = el.parentNode;
    const siblings = [...parent.parentNode.children].filter(
      (child) => child !== el,
    );

    el.addEventListener("keyup", (e) => {
      if (el.value !== "") {
        parent.classList.add("filled");
      } else {
        parent.classList.remove("filled");
      }
    });

    el.addEventListener("focus", (e) => {
      parent.classList.add("focused");
      //console.log(el.value);
      if (parent.classList.contains("has-ac")) parent.classList.add("ac-on");
      if (el.value < 4) parent.classList.toggle("filled");
      if (siblings.length) {
        siblings.forEach((s) => {
          s.classList.remove("ac-on");
        });
      }
    });

    el.addEventListener("blur", (e) => {
      parent.classList.remove("focused");
    });
  });
}

function getParents(el, selector) {
  const parents = [];
  while ((el = el.parentNode) && el !== document) {
    if (!selector || el.matches(selector)) parents.push(el);
  }
  return parents;
}

function testZipCode(str) {
  var regex = /^[1-9]\d{3}$/gm;
  return regex.test(str);
}

export {
  specialCharacters,
  getStreetAndNumber,
  extend,
  apiRequest,
  postData,
  easyExtend,
  turnOffBrowserAC,
  deleteAc,
  fill,
  empty,
  removeAlerts,
  markFocus,
  getParents,
  selectCountries,
  testZipCode,
  apiUrl,
  apiUrlPost,
  clean,
  resetCountries,
  addAlert,
  testForCountriesList,
};
