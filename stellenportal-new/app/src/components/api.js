const url =
  'https://k4cxuy5os6.execute-api.eu-west-1.amazonaws.com/default/DynamoDBHttpEndpoint/?TableName=StellenPortal'

const translations = {
  de: {
    jobtitle: 'Stellentitel',
    department: 'Amt',
    application_due: 'Anmeldefrist',
    overview: 'Übersicht',
    open_jobs: 'Offene Stellen:',
    workplace: 'Arbeitsort',
    noresulttext:
      "Derzeit sind keine offenen Stellen ausgeschrieben, weitere Stellen finden Sie unter <a href='https://www.gr.ch/stellen'>www.gr.ch/stellen</a>."
  },
  it: {
    jobtitle: 'Posizione',
    department: 'Ufficio',
    application_due: 'Termine di annuncio',
    overview: 'Panoramica impieghi',
    open_jobs: 'Posti vacanti:',
    workplace: 'Luogo di lavoro',
    noresulttext:
      "Attualmente non sono pubblicati posti vacanti, altri posti vacanti si trovano su <a href='https://www.gr.ch/impieghi'>www.gr.ch/impieghi</a>."
  },
  rm: {
    jobtitle: 'Plazza',
    department: 'Uffizi',
    application_due: "Termin d'annunzia",
    overview: 'Survista da las plazzas',
    open_jobs: 'Plazzas libras:',
    workplace: 'Lieu da lavur',
    noresulttext:
      "Actualmain n'èn publitgadas naginas plazzas libras. Ulteriuras plazzas chattais Vus sut <a href='https://www.gr.ch/plazzas'>www.gr.ch/plazzas</a>."
  }
}
function getTranslation(prop, lang, fallback = 'missing translation for ' + prop) {
  const trans = translations
  let out = trans['de'].hasOwnProperty(prop) ? trans['de'][prop] : fallback
  if (trans.hasOwnProperty(lang) && trans[lang].hasOwnProperty(prop)) out = trans[lang][prop]
  return out
}
function checkQuery(query) {
  return query && query.length > 0
}
async function fetchData() {
  var response = await fetch(url)
  if (response.ok) {
    return response.json()
  }
}

function applicationLink(link, title) {
  return `<a data-fancybox data-type='iframe' data-width='100%' data-height='100%' data-src='${link}' href='${link}'>${title}</a>`
}
function date(str) {
  var arr = str.split('-')
  return arr[2] + '.' + arr[1] + '.' + arr[0]
}
function languageList(objects) {
  var languages = []
  objects.forEach(function (o) {
    if (languages.indexOf(o.language) === -1) languages.push(o.language)
  })
  var out = []
  if (languages.length) {
    languages.forEach(function (l) {
      var lo = objects.filter(function (e) {
        return e.language == l
      })
      out.push({
        title: l,
        value: l.toLowerCase(),
        count: lo.length,
        data: lo
      })
    })
  }
  // console.log(out);
  return out
}
function typeList(objects) {
  var types = []
  objects.forEach(function (o) {
    if (types.indexOf(o.businessUnitId) == -1) types.push(o.businessUnitId)
  })
  return types
}

function departmentList(objects, bi) {
  // console.log(objects);
  var bid = typeof bi === 'undefined' ? null : bi
  var departments = []
  objects.forEach(function (o) {
    var d = o.Department
    if (bid) {
      if (departments.indexOf(d) === -1 && o.businessUnitId === bid) {
        departments.push(d)
      }
    } else {
      if (departments.indexOf(d) === -1) {
        departments.push(d)
      }
    }
  })
  var out = []
  departments.forEach(function (o) {
    var obj = objects.filter(function (e) {
      return e.Department == o
    })
    if (bid) {
      obj = objects.filter(function (e) {
        return e.Department == o && e.businessUnitId === bid
      })
    }
    out.push({
      title: o,
      value: o.toLowerCase(),
      count: obj.length,
      data: obj
    })
  })

  return out
}

function attributesToObject() {
  const element = document.querySelector('#sp-app').parentNode
  const attrs = element.getAttributeNames().reduce((acc, name) => {
    return { ...acc, [name]: element.getAttribute(name) }
  }, {})

  const out = {}
  for (const property in attrs) {
    console.log(`${property}: ${attrs[property]}`)
    if (property.indexOf('data-') == 0) {
      out[property.replace('data-', '')] = attrs[property]
    }
  }
  console.log('out', out)
  return out
}

export {
  fetchData,
  applicationLink,
  date,
  getTranslation,
  languageList,
  typeList,
  departmentList,
  checkQuery,
  attributesToObject
}
