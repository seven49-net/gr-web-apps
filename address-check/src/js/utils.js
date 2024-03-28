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



export {
  translateUmlaute,
  getStreetAndNumber,
  extend,
  apiRequest,
  postData,
  easyExtend
};