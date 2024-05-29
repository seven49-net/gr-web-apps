import {
  postData,
  getStreetAndNumber,
  deleteAc,
  fill,
  apiRequest,
} from "./utils";
import { checkAddress } from "./checkAddress";
import { buildAutoComplete } from "./build-autocomplete";
import { deleteAllMessages } from "./messages";

export function checkStreet(params) {
  const street = params.street;
  const zipcode = params.zipcode;
  const city = params.city;
  const canton = params.canton;
  const country = params.country;
  const form = params.form;

  street.addEventListener("blur", async () => {
    const sv = getStreetAndNumber(street.value);

    deleteAc();
    deleteAllMessages();
    if (sv) {
      const response = await postData(apiRequest(sv));
      const result = response
        ? response.QueryAutoComplete4Result.AutoCompleteResult
        : [];
      // console.log(result, result.length)
      if (result.length) {
        deleteAllMessages();
        if (result.length === 1) {
          const r = result[0];
          fill(zipcode, r.ZipCode);
          fill(canton, r.Canton);
          fill(country, r.CountryCode);
          fill(city, r.TownName);
        } else {
          // console.log('result', result);
          buildAutoComplete({
            data: result,
            prop: "ZipCode",
            id: zipcode,
            zipcode: zipcode,
            city: city,
            plz: zipcode,
            canton: canton,
            form: form,
            houseNo: sv.HouseNo,
            street: params.street,
            country: params.country,
          });
        }
      }
    }
    checkAddress(params);
  });
}
