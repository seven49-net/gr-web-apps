import { checkAddress } from "./checkAddress";
import { removeAlerts, getStreetAndNumber } from "./utils";

function doCheck(params, values) {
  //console.log(params.count + " check");
  // $(params.submitText).html("");
  // removeAlerts();
  removeAlerts();
  const street = params.street,
    zipcode = params.zipcode,
    streetVal = getStreetAndNumber(params.street.value, true),
    city = params.city,
    canton = params.canton,
    country = params.country,
    streetname = streetVal[0],
    housenumber = streetVal[1];

  const zipcodeVal = zipcode.value,
    cityVal = city.value,
    cantonVal = canton.value,
    countryVal = country.value;
  let run = params.run;
  if (streetname && zipcodeVal && cityVal && cantonVal && countryVal) run = 0;
  values = {
    count: params.count,
    run: run,
    street: street,
    streetVal: streetVal,
    streetname: streetname,
    housenumber: housenumber,
    zipcode: zipcode,
    zipcodeVal: zipcodeVal,
    city: city,
    cityVal: cityVal,
    canton: canton,
    cantonVal: cantonVal,
    country: country,
    countryVal: countryVal,
  };
  return values;
}

function checkPeriodically(params) {
  const street = params.street,
    zipcode = params.zipcode,
    city = params.city,
    canton = params.canton,
    country = params.country ? params.country : "",
    submitText = params.submitText;
  let c = 0;
  let run = params.run;
  let values = {
    count: 0,
    run: run,
    street: street,
    streetVal: "",
    streetname: "",
    housenumber: "",
    zipcode: zipcode,
    zipcodeVal: "",
    city: city,
    cityVal: "",
    canton: canton,
    cantonVal: "",
    country: country,
    countryVal: "",
  };
  (function check() {
    setTimeout(() => {
      values = doCheck(
        {
          count: c,
          street: street,
          // streetname: streetname,
          // housenumber: housenaumber,
          run: run,
          zipcode: zipcode,
          city: city,
          canton: canton,
          country: country,
          submitText: submitText,
        },
        values,
      );
      //console.log("check", values);
      c++;
      run = values.run;
      if (run == 1) {
        check();
      } else {
        // console.log("ok - get verification", values);
        checkAddress(values, true);
      }
    }, 1000);
  })();
}

function initPeriodicallyCheck(settings) {
  settings.street.addEventListener("blur", () => {
    checkPeriodically(settings);
  });
  settings.zipcode.addEventListener("blur", () => {
    checkPeriodically(settings);
  });
  settings.city.addEventListener("blur", () => {
    checkPeriodically(settings);
  });
  settings.canton.addEventListener("blur", () => {
    checkPeriodically(settings);
  });
}
function initCheckOnce(params) {
  const street = params.street,
    zipcode = params.zipcode,
    city = params.city,
    canton = params.canton,
    country = params.country ? params.country : "";

  let run = 1;
  let values = {
    count: 0,
    run: run,
    street: street,
    streetVal: "",
    streetname: "",
    housenumber: "",
    zipcode: zipcode,
    zipcodeVal: "",
    city: city,
    cityVal: "",
    canton: canton,
    cantonVal: "",
    country: country,
    countryVal: "",
  };

  params.street.addEventListener("blur", () => {
    checkAddress(params);
  });
  params.zipcode.addEventListener("blur", () => {
    checkAddress(params);
  });
  params.city.addEventListener("blur", () => {
    checkAddress(params);
  });
  params.canton.addEventListener("blur", () => {
    checkAddress(params);
  });
}

export { checkPeriodically, initPeriodicallyCheck, initCheckOnce };
