import { apiUrl, getStreetAndNumber, clean, addAlert } from "./utils";
import {
  messages,
  renderMsg,
  successMsg,
  replace,
  alertMsg,
  deleteAllMessages,
  errorMsg,
} from "./messages";

const method = "buildingverification4";

async function getVerification(data) {
  const response = await fetch(apiUrl + "?" + new URLSearchParams(data), {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  if (response.ok) return response.json();
}

function requestData(params) {
  const body = {
    method: method,
    streetname: "",
    houseno: "",
    zipcode: "",
    townName: "",
  };
  for (let [key, value] of Object.entries(params)) {
    if (body.hasOwnProperty(key)) body[key] = value;
  }
  return body;
}

async function checkAddress(params, values = false) {
  const street = getStreetAndNumber(params.street.value, true);
  const streetField = params.street;
  const zipcode = !values ? params.zipcode.value : params.zipcodeVal;
  const zipcodeField = params.zipcode;
  const city = !values ? clean(params.city.value) : clean(params.cityVal);
  const cityField = params.city;
  const canton = !values ? clean(params.canton.value) : clean(params.cantonVal);
  const country = !values
    ? params.country.value
      ? clean(params.country.value)
      : ""
    : clean(params.countryVal);
  const streetName = !values ? street[0] : params.streetname;
  const houseNumber = !values ? street[1] : params.housenumber;
  if (zipcode && zipcode.length > 4) {
    console.log("no verfication");
  } else if (streetName && zipcode && city) {
    deleteAllMessages();
    const address = await getVerification(
      requestData({
        streetname: streetName,
        houseno: houseNumber,
        zipcode: zipcode,
        townName: city,
        canton: canton,
        countrycode: country,
      }),
    );

    console.log(streetName, houseNumber, zipcode, city, canton, country);

    const result =
      address.QueryBuildingVerification4Result.BuildingVerificationData;
    console.log(result);
    const status = Number(result.PSTAT);
    if (status < 3) {
      if (result.Canton.toLowerCase() !== canton.toLowerCase()) {
        params.canton.value = result.Canton;
      }
      renderMsg(successMsg(messages.de.valid_address), true);
    } else if (status === 3 || status === 4 || status === 5) {
      if (result.ZipCode !== zipcode) {
        addAlert(params.zipcode);
        // "Bitte korrigieren Sie die PLZ von {uzipcode} auf {pzipcode}."
        renderMsg(
          alertMsg(
            replace(messages.de.check_zipcode, {
              uzipcode: zipcode,
              pzipcode: result.ZipCode,
            }),
            "ac-zipcode",
          ),
        );
        fixValue({
          fix: ".ac-zipcode",
          zipcode_value: zipcode,
          zipcode_value_fixed: result.ZipCode,
          zipcode: zipcodeField,
          params: params,
        });
      }
      if (result.TownName.toLowerCase() !== city.toLowerCase()) {
        addAlert(params.city);
        //"Bitte die Schreibweise der Ortschaft von {utownname})  auf {ptownname} anpassen."
        renderMsg(
          alertMsg(
            replace(messages.de.check_townname, {
              utownname: city,
              ptownname: result.TownName,
            }),
            "ac-city",
          ),
        );
        fixValue({
          fix: ".ac-city",
          cityname: city,
          cityname_fixed: result.TownName,
          city: cityField,
          params: params,
        });
      }
      if (result.StreetName.toLowerCase() !== streetName.toLowerCase()) {
        addAlert(params.street);
        //"Bitte die Schreibweise der Strasse von {ustreetname})  auf {pstreetname} anpassen."
        renderMsg(
          alertMsg(
            replace(messages.de.check_streetname, {
              ustreetname: streetName,
              pstreetname: result.StreetName,
            }),
            "ac-street",
          ),
        );
        fixValue({
          fix: ".ac-street",
          streetname: streetName,
          streetname_fixed: result.StreetName,
          street: streetField,
          params: params,
        });
      }
    } else {
      if (
        zipcode === result.ZipCode &&
        city.toLowerCase() === result.TownName.toLowerCase() &&
        result.StreetName.toLowerCase().includes(
          streetName.toLowerCase().replace(/\./gim, ""),
        ) &&
        result.STRID.length
      ) {
        // Um die Adresse zu verifizieren, wird noch die Hausnummer benötigt
        if (result.HouseNo === "") {
          console.log(params.street);
          addAlert(params.street);
          renderMsg(alertMsg(messages.de.house_no_missing));
         } else if (result.HouseNo.length && result.HouseKey === "0") {
          addAlert(params.street);

          // "In der {streetname} wurde keine Hausnummer {housenumber} gefunden."
          renderMsg(alertMsg(replace(messages.de.no_housenumber_in_street, {
            streetname: result.StreetName,
            housenumber: result.HouseNo
          })));
         }

      } else {
        renderMsg(
          errorMsg(
            replace(messages.de.no_verfication, {
              streetName: streetName,
              houseNumber: houseNumber,
              zipcode: zipcode,
              city: city,
            }),
          ),
          true,
        );
      }
    }
  }
}

function fixValue(params) {
  const fix = params.fix;
  document.activeElement.blur();
  const clickField = document.querySelector(fix + " ins");
  if (clickField) {
    if (fix === ".ac-street") {
      replaceValue(
        clickField,
        params.street,
        params.streetname,
        params.streetname_fixed,
        params.params,
      );
    } else if (fix === ".ac-city") {
      replaceValue(
        clickField,
        params.city,
        params.cityname,
        params.cityname_fixed,
        params.params,
      );
    } if (fix === ".ac-zipcode") {
      replaceValue(
        clickField,
        params.zipcode,
        params.zipcode_value,
        params.zipcode_value_fixed,
        params.params,
      );
    }
  }

}

function replaceValue(cf, input, val, fix, params) {
  const replaceValue = input.value.replace(new RegExp(val, "g"), fix);
  cf.addEventListener("click", () => {
    input.value = replaceValue;
    input.classList.remove("ac-alert");
    cf.parentNode.parentNode.remove();
    checkAddress(params);
  });
}

export { checkAddress };
