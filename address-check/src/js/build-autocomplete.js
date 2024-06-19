import { deleteAc, fill, selectCountries, getParents } from "./utils";
import { checkAddress } from "./checkAddress";

export function buildAutoComplete(params) {
  let data = params.data;
  const prop = params.prop;
  const tempid = params.id;
  const zipcode = params.zipcode;
  const city = params.city;
  const canton = params.canton;
  const id = tempid.getAttribute("id");
  const houseNo = params.hasOwnProperty("houseNo") ? params.houseNo : null;
  //console.log(houseNo);
  const form = params.form;
  const out = [];

  const parent = document.getElementById(id).parentNode;
  // console.log("parent", parent);
  if (data.length) {
    deleteAc();
    if (prop === "ZipCode") {
      data = sortZipCode(data);
    } else if (prop === "TownName") {
      data = sortCities(data);
    }
    //console.log("data", data);
    parent.classList.add("has-ac", "ac-on");

    let oIndex = 0;
    const zipCodes = [];
    for (let d of data) {
      //console.log(d);
      if (houseNo && houseNo !== d.HouseNo) {
        continue;
      } else if (zipCodes.includes(d.ZipCode) && prop == "ZipCode") {
        continue;
      } else {
        zipCodes.push(d.ZipCode);
        out.push(
          "<li class='ac-item'><span class='insert' data-object='" +
            JSON.stringify(d) +
            "'>" +
            d[prop] +
            "</span></li>",
        );
      }

      oIndex++;
    }
    // console.log(zipCodes);
    if (out.length) {
      out.unshift(
        "<div class='ac-autocomplete'><ul class='ac-list' data-prop='" +
          prop +
          "' data-id='" +
          id +
          "' id='ac-" +
          prop.toLowerCase() +
          "'>",
      );
      out.push("</ul></div>");
    }
  }
  //console.log(out.join(""));
  //parent.insertAdjacentHTML("beforeend", out.join(""));
  document.getElementById(id).insertAdjacentHTML("afterend", out.join(""));
  // console.log(testForCountriesList())
  select({
    city: city,
    zipcode: zipcode,
    canton: canton,
    form: form,
    street: params.street,
    country: params.country,
  });
}

function select(params) {
  const ac = document.querySelectorAll(".ac-autocomplete .ac-list"); //$(".ac-autocomplete");
  const city = params.city;
  const zipcode = params.zipcode;
  const canton = params.canton;
  const form = params.form;
  if (ac.length) {
    ac.forEach((acl) => {
      const parents = getParents(acl, ".has-ac");
      const prop = acl.getAttribute("data-prop");
      acl.querySelectorAll(".insert").forEach((o) => {
        o.addEventListener("click", (e) => {
          const object = JSON.parse(o.getAttribute("data-object"));
          // console.log(object);
          // console.log(prop);
          if (prop === "ZipCode") fill(zipcode, object.ZipCode);
          fill(city, object.TownName);
          fill(canton, object.Canton);
          selectCountries(form);

          if (parents.length) {
            parents.forEach((e) => {
              e.classList.remove("ac-on");
            });
          }
          checkAddress(params);
        });
      });
    });
  }
}

function sortCities(c) {
  return c.sort(function (a, b) {
    var cityA = a.TownName.toLowerCase();
    var cityB = b.TownName.toLowerCase();
    if (cityA < cityB) return -1;
    if (cityA > cityB) return 1;
    return 0;
  });
}

function sortZipCode(d) {
  return d.sort(function (a, b) {
    return a.ZipCode - b.ZipCode;
  });
}
