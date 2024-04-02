const messages = {
  de: {
    street_not_found: 'Die Strasse "{street}" wurde nicht gefunden unter der PLZ {plz} - bitte prüfen Sie, ob die Adressdaten alle korrekt ausgefüllt sind.',
    no_ch_plz: '{plz} ist keine Schweizer Postleitzahl',
    success: 'Die Strasse "{street}" wurde unter der angegebenen PLZ {plz} gefunden!',
    enter_valid_plz: "Bitte geben Sie eine gültige Postleitzahl ein!",
    plz_city_not_conform: `Die Postleitzahl {plz} stimmt nicht mit dem Ort {city} überein!`,
    state_not_correct: `Bitte verwenden Sie für die Angabe des Kantons die Abkürzung.<br>Richtig: <i>{state}</i><br>Eingegeben: <i>{entered_state}</i>.`
  }
};

function renderMsg(content, e) {
  console.log(content);
  const submitText = document.querySelector('.ac-submit-text');
  console.log(submitText)
  var clean = typeof e === "undefind" ? true : e;
  if (clean) {
    submitText.innerHTML = '';
    submitText.innerHTML  = `<div class='inner'>${content.outerHTML}</div>`;
  } else {
    const a = document.createElement('div');
    a.classList.add('inner');
    a.appendChild(content);
    submitText.appendChild(a);
  }
}

function replace(str, r) {
  console.log(r)
  var replacements = Object.entries(r);
  var out = str;
  for (var [key, value] of replacements) {
    var rep = new RegExp("\{" + key + "\}", "gm");
    // console.log(rep)
    // console.log(value)
    out = out.replace(rep, value);
  }
  return out;
}

function errorMsg(content) {
  return div(content, 'error');
}

function alertMsg(content) {
  return div(content, 'ac-alert');
}

function successMsg(content) {
  console.log(content);
  return div(content, 'ac-success');
}

function div(txt = '', c = '') {
  const d = document.createElement('div');
  d.classList.add(c);
  d.textContent = txt;
  return d;
}


export {
  messages,
  renderMsg,
  errorMsg,
  alertMsg,
  successMsg,
  replace
}