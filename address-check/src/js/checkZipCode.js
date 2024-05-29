import {
  testZipCode,
  postData,
  apiRequest,
  fill,
  deleteAc,
  removeAlerts,
} from "./utils";
import { buildAutoComplete } from "./build-autocomplete";

import {
  renderMsg,
  alertMsg,
  replace,
  messages,
  deleteMessage,
  deleteAllMessages,
} from "./messages";

export function checkZipCode(params) {
  const zipcode = params.zipcode,
    city = params.city,
    canton = params.canton,
    country = params.country,
    form = params.form;
  zipcode.addEventListener("blur", async (e) => {
    const zipcodeVal = zipcode.value.trim();
    //console.log("zip code val", zipcodeVal);
    //console.log(e.target);
    //deleteAllMessages();
    deleteMessage("ac-zip-message");
    if (testZipCode(zipcodeVal)) {
      const response = await postData(apiRequest({ ZipCode: zipcodeVal }));
      const result = response
        ? response.QueryAutoComplete4Result.AutoCompleteResult
        : [];
      deleteAc();

      if (result.length) {
        if (result.length === 1) {
          const r = result[0];
          // zipcode.value = r.ZipCode;
          fill(zipcode, r.ZipCode);
          fill(city, r.TownName);
          fill(canton, r.Canton);
          fill(country, r.CountryCode);
          // renderMsg(successMsg("Glückliche PLZ Fügung"), true);
          removeAlerts();
          return;
        } else {
          // console.log('result', result);
          buildAutoComplete({
            data: result,
            prop: "TownName",
            id: city,
            zipcode: zipcode,
            city: city,
            canton: canton,
            plz: zipcode,
            form: form,
            street: params.street,
            country: params.country,
          });
        }
      }
    } else if (zipcodeVal === "") {
      deleteMessage("ac-zip-message");
    } else {
      // console.log("zipcode val", zipcodeVal);
      // console.log(e.target);
      const target = e.target;
      deleteAllMessages();
      renderMsg(
        alertMsg(
          replace(messages.de.no_ch_zipcode, {
            zipcode: zipcodeVal,
          }),
        ),
        "ac-zip-message",
      );
      target.classList.add("ac-alert");
    }
  });
}
