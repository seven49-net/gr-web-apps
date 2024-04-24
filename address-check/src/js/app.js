import {
  extend,
  turnOffBrowserAC,
  deleteAc,
  empty,
  markFocus,
  resetCountries,
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
      form: document.querySelector("form"),
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

init();
