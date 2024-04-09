import {
  getStreetAndNumber,
  apiRequest,
  postData,
  fill,
  extend,
  turnOffBrowserAC,
  deleteAc,
  empty,
  markFocus,
  buildAutoComplete,
} from "./utils";
//import { renderMsg, successMsg } from "./messages";

import { acStyles } from "./styles.js";
import { checkZipCode } from "./checkZipCode.js";
import { checkStreet } from "./checkStreet.js";

const apiUrl =
  "https://02ds7tjzm7.execute-api.eu-west-1.amazonaws.com/Prod?method=autocomplete4";

const submitText = document.createElement("div");
submitText.classList.add("ac-submit-text", "injected");

function init(params) {
  const settings = extend(
    {
      street: document.querySelector("#street"),
      zipCode: document.querySelector("#zip-code"),
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
  const zipCode = settings.zipCode;
  const city = settings.city;
  const canton = settings.canton;
  //const country = settings.country;
  const form = settings.form;

  form.append(submitText);
  turnOffBrowserAC(form);
  markFocus();

  checkStreet(settings);

  zipCode.addEventListener("keydown", (e) => {
    const keyCode = e.keyCode;
    console.log(keyCode);
    if (keyCode != 9 && keyCode != 13) {
      empty(city);
      empty(canton);
      deleteAc();
    }
  });

  checkZipCode(settings);
}

init();
