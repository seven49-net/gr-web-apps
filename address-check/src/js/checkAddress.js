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
  const zipcode = !values ? params.zipcode.value : params.zipcodeVal;
  const city = !values ? clean(params.city.value) : clean(params.cityVal);
  const canton = !values ? clean(params.canton.value) : clean(params.cantonVal);
  const country = !values
    ? clean(params.country.value)
    : clean(params.countryVal);
  const streetName = !values ? street[0] : params.streetname;
  const houseNumber = !values ? street[1] : params.housenumber;

  if (streetName && zipcode && city) {
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
          ),
        );
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
          ),
        );
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
          ),
        );
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
        console.log(params.street);
        addAlert(params.street);
        renderMsg(alertMsg(messages.de.house_no_missing));
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

export { checkAddress };
