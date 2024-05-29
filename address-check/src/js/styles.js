const css = `:root {
    --brand-color: rgb(33, 59, 175);
    --light-brand-color: rgb(153, 169, 238);
    --black: #202020;
    --white: #fff;
    --gray: #acacac;
    --error: rgb(255, 47, 195);
    --success: rgb(4, 116, 22);
    --alert: #ff9300;
    --border-color: #ada2a2;
    --ac-bg-color: #dadada;
    --ac-border: 1px solid var(--ac-border-color, var(--ac-bg-color));
    --btn-bg-color: var(--brand-color);
    --btn-color: var(--white);
    --btn-hover-bg-color: var(--light-brand-color);
    --btn-hover-color: var(--black);
    --ac-font-size: 14px;
    --ac-submit-text-border-color: var(--gray);
}

/* ac styles */

.ac-autocomplete,
.ac-autocomplete * {
    box-sizing: border-box;
}

.ac-autocomplete {
    background-color: var(--ac-bg-color);
    list-style: none;
    width: 320px;
    max-width: 100%;
    margin: 0;
    padding: 5px;
    border: var(--ac-border);
    position: absolute;
    z-index: 2000;
    display: none;
    font-size: var(--ac-font-size);
}

ul.ac-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

input.ac-alert {
    color: var(--alert) !important;
    border-color: var(--alert) !important;
}

input.ac-error {
    color: var(--error) !important;
    border-color: var(--error) !important;
}

.has-ac.ac-on {
    position: relative;
    z-index: 2000;
}

.has-ac.ac-on .ac-autocomplete {
    display: block;
}

.filled.ac-on .ac-autocomplete {
    display: none;
}

.ac-list {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.ac-list .insert {
    cursor: pointer;
    display: inline-block;
    padding: 5px 6px;
    background-color: var(--btn-bg-color);
    color: var(--btn-color);
}

.ac-list .insert:hover {
    background: var(--btn-hover-bg-color);
    color: var(--btn-hover-color);
}

.ac-submit-text {
    margin-top: 30px;
    font-family: inherit;
    font-weight: bold;
    font-size: var(--ac-font-size);
    --_ac-submit-text-border-color: var(
        --ac-submit-text-border-color,
        var(--black)
    );
}

.ac-submit-text .inner {
    padding: 10px;
    border: 1px dotted var(--_ac-submit-text-border-color);
}
.ac-submit-text .inner + .inner {
    margin-top: 5px;
}

.ac-success {
    --_ac-submit-text-border-color: var(--success);
    color: var(--success);
}

.ac-alert {
    --_ac-submit-text-border-color: var(--alert);
    color: var(--alert);
}

.ac-error {
    --_ac-submit-text-border-color: var(--error);
    color: var(--error);
}
.ac-alert ins {
    cursor: pointer;
}`;

function minifyCssString(css) {
  return css
    .replace(/\n/g, "")
    .replace(/\s\s+/g, " ")
    .replace(/\s?{\s?/gm, "{")
    .replace(/\s?}\s?/gm, "}")
    .replace(/\s?:\s?/gm, ":")
    .replace(/\s?;\s?/gm, ";")
    .replace(/\s?;\s?}/gm, "}");
}

function loadstyles(str) {
  const head = document.querySelector("head");
  console.log(head.querySelector("#ac-styles"));
  if (!head.querySelector("#ac-styles")) {
    head.insertAdjacentHTML(
      "beforeend",
      "<style id='ac-styles'>" + minifyCssString(str) + "</style>",
    );
  }
}

export function acStyles() {
  loadstyles(css);
}
