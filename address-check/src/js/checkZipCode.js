import {
  testZipCode,
  postData,
  apiUrl,
  apiRequest,
  fill,
  buildAutoComplete,
  deleteAc,
} from "./utils";

import {
  renderMsg,
  successMsg,
  errorMsg,
  alertMsg,
  replace,
  messages,
  deleteAllMessages,
} from "./messages";

export function checkZipCode(params) {
  const zipCode = params.zipCode,
    city = params.city,
    canton = params.canton,
    country = params.country,
    form = params.form;
  zipCode.addEventListener("blur", async () => {
    const zipCodeVal = zipCode.value.trim();
    deleteAllMessages();
    if (testZipCode(zipCodeVal)) {
      const response = await postData(
        apiUrl,
        apiRequest({ ZipCode: zipCodeVal }),
      );
      const result = response
        ? response.QueryAutoComplete4Result.AutoCompleteResult
        : [];
      deleteAc();
      if (result.length) {
        if (result.length === 1) {
          const r = result[0];
          // zipCode.value = r.ZipCode;
          fill(zipCode, r.ZipCode);
          fill(city, r.TownName);
          fill(canton, r.Canton);
          fill(country, r.CountryCode);
          renderMsg(successMsg("Glückliche PLZ Fügung"), true);
        } else {
          // console.log('result', result);
          buildAutoComplete({
            data: result,
            prop: "TownName",
            id: city,
            zipCode: zipCode,
            city: city,
            canton: canton,
            plz: zipCode,
            form: form,
          });
        }
      }
    } else if (zipCodeVal === "") {
      deleteAllMessages();
    } else {
      zipCode.classList.add("ac-alert");
      renderMsg(
        alertMsg(
          replace(messages.de.no_ch_plz, {
            plz: zipCodeVal,
          }),
        ),
      );
    }
  });
}
