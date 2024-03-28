import { getStreetAndNumber, apiRequest, postData } from "./utils";

const apiUrl = 'https://02ds7tjzm7.execute-api.eu-west-1.amazonaws.com/Test?method=autocomplete4';

const street = document.querySelector("#street");
const zipCode = document.querySelector('#zip-code');
const city = document.querySelector('#city');
const canton = document.querySelector('#canton');
const country = document.querySelector('#countries');




street.addEventListener('blur', () => {
  var sv = getStreetAndNumber(street.value);
  console.log(sv);
  if (sv) {
    postData(apiUrl, apiRequest(sv)).then((data) => {
      console.log(data.QueryAutoComplete4Result);
      const result =  data.QueryAutoComplete4Result.AutoCompleteResult;
      if (result.length === 1) {
        const r = result[0];
        zipCode.value = r.ZipCode;
        city.value = r.TownName;
        canton.value = r.Canton;
        country.value = r.CountryCode;
      }
    });
  }
});

function init(params) {

}