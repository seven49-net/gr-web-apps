const messages = {
  de: {
    valid_address: "Die Adresse wurde erfolgreich verfiziert.",
    house_no_missing: `Um die Adresse zu verifizieren, wird noch die Hausnummer benötigt.`,
    no_verfication: `Die eingegebene Adresse ({streetName} {houseNumber}, {zipcode} {city}) konnte leider nicht verifiziert werden!`,
    check_zipcode:
      "Bitte korrigieren Sie die PLZ von <s>{uzipcode}</s> auf <em>{pzipcode}</em>.",
    check_townname:
      "Bitte die Schreibweise der Ortschaft von <s>{utownname}</s> auf <em>{ptownname}</em> anpassen.",
    check_streetname:
      "Bitte die Schreibweise der Strasse von <s>{ustreetname}</s>  auf <em>{pstreetname}</em> anpassen.",
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

function alertMsg(content) {
  return div(content, "ac-alert");
}

function successMsg(content) {
  console.log(content);
  return div(content, "ac-success");
}

function div(txt = "", c = "") {
  const d = document.createElement("div");
  d.classList.add(c);
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
