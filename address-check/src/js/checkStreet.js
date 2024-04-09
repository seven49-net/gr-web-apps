import {
  postData,
  getStreetAndNumber,
  deleteAc,
  fill,
  buildAutoComplete,
  apiUrl,
  apiRequest,
} from "./utils";

import { messages, deleteAllMessages, renderMsg, successMsg } from "./messages";
export function checkStreet(params) {
  const street = params.street;
  const zipCode = params.zipCode;
  const city = params.city;
  const canton = params.canton;
  const country = params.country;
  const form = params.form;
  street.addEventListener("blur", async () => {
    var sv = getStreetAndNumber(street.value);
    deleteAc();
    deleteAllMessages();
    if (sv) {
      const response = await postData(apiUrl, apiRequest(sv));
      const result = response
        ? response.QueryAutoComplete4Result.AutoCompleteResult
        : [];
      // console.log(result, result.length)
      if (result.length) {
        deleteAllMessages();
        if (result.length === 1) {
          const r = result[0];
          // zipCode.value = r.ZipCode;
          fill(zipCode, r.ZipCode);
          fill(city, r.TownName);
          fill(canton, r.Canton);
          fill(country, r.CountryCode);
          renderMsg(successMsg("Glückliche Fügung"), true);
        } else {
          // console.log('result', result);
          buildAutoComplete({
            data: result,
            prop: "ZipCode",
            id: zipCode,
            zipCode: zipCode,
            city: city,
            canton: canton,
            plz: zipCode,
            form: form,
          });
        }
      }
    }
  });
}
