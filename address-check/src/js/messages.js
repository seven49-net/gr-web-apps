const messages = {
  de: {
    valid_address: "Die Adresse wurde erfolgreich verfiziert.",
    house_no_missing: `Um die Adresse zu verifizieren, wird noch die Hausnummer benötigt.`,
    no_verfication: `Die eingegebene Adresse ({streetName} {houseNumber}, {zipcode} {city}) konnte leider nicht verifiziert werden. Wollen Sie wirklich fortfahren?`,
    check_zipcode:
      "Klicken Sie auf den Korrekturvorschlag, um diesen zu übernehmen:  von <s>{uzipcode}</s> auf <ins>{pzipcode}</ins>.",
    check_townname:
      "Klicken Sie auf den Korrekturvorschlag, um diesen zu übernehmen:  von <s>{utownname}</s> auf <ins>{ptownname}</ins> anpassen.",
    check_streetname:
      "Klicken Sie auf den Korrekturvorschlag, um diesen zu übernehmen: von <s>{ustreetname}</s>  auf <ins>{pstreetname}</ins> anpassen.",
    no_ch_zipcode: "Die eingegebene PLZ {zipcode} ist keine CH PLZ",
    no_housenumber_in_street:
      "Unter {streetname} wurde keine Hausnummer {housenumber} gefunden.",
  },
};

function createMessageArea() {
  const submitText = document.createElement("div");
  submitText.classList.add("ac-submit-text", "injected");
  return submitText;
}

function renderMsg(content, e) {
  var clean = typeof e === "undefind" ? true : e;
  const submitText = document.querySelector(".ac-submit-text");
  if (clean) {
    deleteAllMessages(submitText);
    submitText.innerHTML = `<div class='inner'>${content.outerHTML}</div>`;
  } else {
    const a = document.createElement("div");
    a.classList.add("inner");
    a.appendChild(content);
    submitText.appendChild(a);
  }
}
function deleteAllMessages(submitText) {
  const sT =
    typeof submitText === "undefined"
      ? document.querySelector(".ac-submit-text")
      : submitText;
  console.log("delete messages");
  sT.innerHTML = "";
  const alerts = document.querySelectorAll(".ac-alert");
  if (alerts.length) {
    alerts.forEach((e) => {
      e.classList.remove("ac-alert");
    });
  }
}

function replace(str, r) {
  console.log(r);
  var replacements = Object.entries(r);
  var out = str;
  for (var [key, value] of replacements) {
    var rep = new RegExp("{" + key + "}", "gm");
    // console.log(rep)
    // console.log(value)
    out = out.replace(rep, value);
  }
  return out;
}

function errorMsg(content) {
  return div(content, "ac-error");
}

function alertMsg(content, c = "") {
  let cl = c.length ? ["ac-alert", c] : "ac-alert";
  return div(content, cl);
}

function successMsg(content) {
  console.log(content);
  return div(content, "ac-success");
}

function div(txt = "", c = "") {
  const d = document.createElement("div");
  const cl = typeof c === "string" ? [c] : c;
  d.classList.add(...cl);
  d.innerHTML = txt;
  return d;
}

export {
  messages,
  renderMsg,
  errorMsg,
  alertMsg,
  successMsg,
  replace,
  deleteAllMessages,
  createMessageArea,
};
