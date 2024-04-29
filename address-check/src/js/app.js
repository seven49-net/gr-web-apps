import {
  extend,
  turnOffBrowserAC,
  deleteAc,
  empty,
  markFocus,
  resetCountries,
  testForCountriesList,
} from "./utils";
import { createMessageArea } from "./messages";

import { initPeriodicallyCheck } from "./checkPeriodically.js";

import { acStyles } from "./styles.js";
import { checkZipCode } from "./checkZipCode.js";
import { checkStreet } from "./checkStreet.js";

// const submitText = document.createElement("div");
// submitText.classList.add("ac-submit-text", "injected");

function init(params) {
  const settings = extend(
    {
      street: document.querySelector("#street"),
      zipcode: document.querySelector("#zip-code"),
      city: document.querySelector("#city"),
      canton: document.querySelector("#canton"),
      country: document.querySelector("#countries"),
      form: testForCountriesList(),
      submitText: document.querySelector(".ac-submit-text"),
    },
    params,
  );
  // use in production
  acStyles();

  // const street = settings.street;
  const zipcode = settings.zipcode;
  const city = settings.city;
  const canton = settings.canton;
  // const country = settings.country;
  const form = settings.form;

  form.append(createMessageArea());
  turnOffBrowserAC(form);
  markFocus();

  checkStreet(settings);

  zipcode.addEventListener("keydown", (e) => {
    const keyCode = e.keyCode;
    console.log(keyCode);
    if (keyCode != 9 && keyCode != 13) {
      empty(city);
      empty(canton);
      resetCountries();
      deleteAc();
    }
  });

  checkZipCode(settings);
  initPeriodicallyCheck(settings);
}
// const dev =
//   location.href.includes("localhost:") || location.href.includes("127.0.0.1")
//     ? true
//     : false;
const digitalform = document.querySelector(".digital-product-property-form");
const profile = document.querySelector(".ECRegisterManageAccount");
const payment = document.querySelector(
  ".CheckOutWizardControlViewAddresses > .Payment",
);
const delivery = document.querySelector(
  ".CheckOutWizardControlViewAddresses > .Delivery",
);

if (digitalform) {
  init({
    street: digitalform.querySelector("#addProp_BillingAddress"),
    zipcode: digitalform.querySelector("#addProp_BillingZipCode"),
    city: digitalform.querySelector("#addProp_BillingCity"),
    canton: digitalform.querySelector("#addProp_BillingKanton"),
    country: testForCountriesList(digitalform),
    form: digitalform,
  });
} else if (profile) {
  init({
    street: profile.querySelector(".Address input"),
    plz: profile.querySelector(".ZipCode input"),
    city: profile.querySelector(".City input"),
    state: profile.querySelector(".State input"),
    country: testForCountriesList(profile),
    form: profile,
  });
} else if (payment) {
  init({
    street: payment.querySelector(".PaymentAddress input"),
    plz: payment.querySelector(".PaymentZipCode input"),
    city: payment.querySelector(".PaymentCity input"),
    state: payment.querySelector(".PaymentState input"),
    country: testForCountriesList(payment),
    form: payment,
  });
} else if (delivery) {
  init({
    street: delivery.querySelector(".DeliveryAddress input"),
    plz: delivery.querySelector(".DeliveryZipCode input"),
    city: delivery.querySelector(".DeliveryCity input"),
    state: delivery.querySelector(".DeliveryState input"),
    country: testForCountriesList(delivery),
    form: delivery,
  });
} else {
  init();
}
