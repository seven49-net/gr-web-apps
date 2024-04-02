function translateUmlaute(str) {
 return str.replace(/\u00dc/g, "Ue")
  .replace(/\u00fc/g, "ue")
  .replace(/\u00c4/g, "Ae")
  .replace(/\u00e4/g, "ae")
  .replace(/\u00d6/g, "Oe")
  .replace(/\u00f6/g, "oe");
}

function getStreetAndNumber(str = '') {
  if (str.length) {
    str = str.trim();
    const s = str.split(' ');
    const regexStreet = /(.*?)(\s+\d+\s?[a-z]*)/gmi;
    // str.length && str.match(regexStreet) ? regexStreet.exec(str)[1] : str;
    let street = str;
    let streetNumber = "";
    if (str.match(regexStreet)) {
      const sArr = regexStreet.exec(str);
      console.log(sArr);
      street = sArr[1];
      streetNumber = sArr[2].trim();
    }
    return {"StreetName": translateUmlaute(street), "HouseNo": streetNumber};
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
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for ( var prop in obj ) {
			if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
				// If deep merge and property is an object, merge properties
				if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
					extended[prop] = extend( true, extended[prop], obj[prop] );
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for ( ; i < length; i++ ) {
		var obj = arguments[i];
		merge(obj);
	}

	return extended;

};

function easyExtend(objA) {
  return {...objA, ...objB};
}

function apiRequest(params = {}) {
  const request = {
    "ONRP": 0,
    "ZipCode": "",
    "ZipAddition": "",
    "TownName": "",
    "STRID": 0,
    "StreetName": "",
    "HouseKey": 0,
    "HouseNo": "",
    "HouseNoAddition": ""
  };

  for (let [key, value] of Object.entries(params)) {
    // console.log(key, value);
    if (request.hasOwnProperty(key)) request[key] = value;
  }

  return {
    "request": request,
    "zipOrderMode":0,
    "zipFilterMode":0
  }
}

async function postData(url= '', data = {}) {
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
  return response.json();
}

function turnOffBrowserAC(form) {
  const container = typeof form === "undefined" ? document.querySelector('body') : form;
  const inputs = container.querySelectorAll("input, textarea, select");
  if (inputs.length) {
    inputs.forEach(element => {
      element.setAttribute("autocomplete", "custom")
    });
  }
}

function deleteClasses() {
  const ac = document.querySelectorAll(".has-ac");
  if (ac.length) {
    ac.forEach(element => {
      const classes = element.classList;
      classes.remove('ac-on');
      classes.remove('has-ac');
    });
  }
}

function deleteAc() {
  const aca = document.querySelectorAll('.ac-autocomplete');
  if (aca.length) {
    aca.forEach(element => {
      element.classList.remove('ac-autocomplete');
    });
  }
  deleteClasses();
}

function testForCountriesList() {
  const dd = document.querySelectorAll("select");
  let out = null;
  if (dd.length) {
    dd.forEach(element => {
      const html = element.innerHTML;
      if (/value=["|']CH["|']/gmi.test(html)) out = element;
    });
  }
  return out;
}

function fill(input, value) {
  console.log(input, value)
  input.value = value;
  input.parentNode.classList.add("filled");
}

function empty(input) {
  input.value = '';
  input.parentNode.classList.remove('filled');
}
function removeAlerts() {
  const alerts  = document.querySelectorAll('input.ac-alert');
  const errors = document.querySelectorAll('ac-error');
  if (alerts.length) {
    alerts.forEach( element => {
      element.classList.remove('ac-alert');
    });
  }
  if (errors.length) {
    errors.forEach(element => {
      element.classList.remove("ac-alert");
    });
  }

}

function markFocus() {
  var inputs = document.querySelectorAll(".form-group > input, .form-group > textarea, .wai-text-box input, .wai-text-box textarea, .input-item input, .input-item textarea, .WaiTextBox > input");
  /*
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
  */
  inputs.forEach(el => {
    const parent = el.parentNode;
    const siblings  = [...parent.parentNode.children].filter((child) => child !== el);

    el.addEventListener('keyup', e => {
      if (el.value !== "") parent.classList.toggle('filled');
    });

    el.addEventListener('focus', e => {
      parent.classList.add('focused');
      if (parent.classList.contains('has-ac')) parent.classList.add('ac-on');
      if (siblings.length) {
        siblings.forEach(s => {
          s.classList.remove('ac-on');
        });
      }
    });

    el.addEventListener('blur', e => {
      parent.classList.remove('focused');
    });
  });

}




export {
  translateUmlaute,
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
  markFocus
};