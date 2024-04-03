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
  buildAutoComplete } from "./utils";
  import {
    renderMsg,
    successMsg
  } from "./messages";

const apiUrl = 'https://02ds7tjzm7.execute-api.eu-west-1.amazonaws.com/Prod?method=autocomplete4';

const submitText =  document.createElement('div');
submitText.classList.add('ac-submit-text')

function init(params) {
  const settings = extend({
    street: document.querySelector("#street"),
    zipCode: document.querySelector('#zip-code'),
    city: document.querySelector('#city'),
    canton: document.querySelector('#canton'),
    country: document.querySelector('#countries'),
    form: document.querySelector('form'),
    submitText: document.querySelector('.ac-submit-text')

  }, params);

  const street = settings.street;
  const zipCode = settings.zipCode;
  const city = settings.city;
  const canton = settings.canton;
  const country = settings.country;
  const form = settings.form;
  const msgArea = settings.submitText;

  form.append(submitText);
  turnOffBrowserAC(form);
  markFocus();
  street.addEventListener('blur', () => {
    var sv = getStreetAndNumber(street.value);
    //console.log(sv);
    deleteAc();
    if (sv) {
      postData(apiUrl, apiRequest(sv)).then((data) => {
        //console.log(data.QueryAutoComplete4Result);
        const result = data.QueryAutoComplete4Result.AutoCompleteResult;
        console.log(result, result.length)
        if (result.length === 1) {
          const r = result[0];
          // zipCode.value = r.ZipCode;
          fill(zipCode, r.ZipCode);
          fill(city, r.TownName);
          fill(canton, r.Canton);
          fill(country, r.CountryCode);
          renderMsg(successMsg('Glückliche Fügung'), true)
        } else if (result.length > 1) {
          // console.log('result', result);
          buildAutoComplete({
            data: result,
            prop: "ZipCode",
            id: zipCode,
            zipCode: zipCode,
            city: city,
            canton: canton,
            plz: zipCode,
            form: form
          });
        }
      });
    }
  });

}

init();