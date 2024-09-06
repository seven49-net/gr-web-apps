<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Fancybox } from '@fancyapps/ui/dist/index.esm.js'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { useRoute, useRouter } from 'vue-router'
import _ from 'lodash'
import {
  fetchData,
  applicationLink,
  date,
  getTranslation,
  languageList,
  typeList,
  departmentList,
  checkQuery,
  attributesToObject
} from './api.js'
import { standalone } from '../stores/standalone'
const data = ref([])
const hidedepartment = ref(true)
const selectedlanguage = ref('')
const languages = ref([])
const types = ref([])
const selectedtype = ref('')
const departmentsearch = ref('')
const selecteddepartment = ref('')
const route = useRoute()
const router = useRouter()
const noresulttext = ref('')
const copylink = ref('')
const tooltip = ref('')
const showEditor = ref(0)
const customtext = ref('')

// EmbedExternalContent
const embedded = document
  .querySelector('#sp-app')
  .parentNode.parentNode.classList.contains('EmbedExternalContent')
  ? true
  : false

onMounted(async () => {
  const response = await fetchData()
  data.value = response.Items
  console.log(data.value)
  languages.value = languageList(data.value)
  types.value = typeList(data.value)
  console.log(embedded)
  // hidedepartment.value = true

  if (!_.isEmpty(route.query)) {
    let q = route.query
    checkQueryOrAttributes(q, false)
  } else {
    standalone.state = false
  }
  if (embedded) {
    let q = attributesToObject()
    checkQueryOrAttributes(q, true)
  }

  Fancybox.bind('[data-fancybox]', {})
})

const filtered = computed(() => {
  let jobs = data.value

  if (selectedlanguage.value.length) {
    console.log(selectedlanguage.value)

    jobs = jobs.filter((o) => {
      return o.language === selectedlanguage.value
    })
  }
  if (selectedtype.value.length) {
    jobs = jobs.filter((o) => {
      return o.businessUnitId === selectedtype.value
    })
  }
  if (departmentsearch.value.length) {
    let searchkey = departmentsearch.value.trim().toLowerCase()
    jobs = jobs.filter((o) => {
      return o.Department.toLowerCase().includes(searchkey)
    })
  }
  if (selecteddepartment.value.length) {
    jobs = jobs.filter((o) => {
      return o.Department.toLowerCase() === selecteddepartment.value.toLowerCase()
    })
  }
  let departments = departmentList(jobs, selectedtype.value)
  let count = jobs.length
  return { jobs: jobs, departments: departments, count: count }
})

function toggleEditor() {
  showEditor.value = !showEditor.value
}

watch(
  [
    selectedlanguage,
    selectedtype,
    departmentsearch,
    selecteddepartment,
    hidedepartment,
    standalone,
    noresulttext
  ],
  () => {
    // console.log(standalone.state)
    //if (standalone.state == false) {
    let query = {}
    if (selectedlanguage.value.length) {
      query.language = selectedlanguage.value
      //noresulttext.value = getTranslation('noresulttext', selectedlanguage.value)
      // query.noresulttext = encodeURIComponent(noresulttext.value)
    }
    if (selectedtype.value.length) {
      query.type = selectedtype.value
    }
    if (departmentsearch.value.length) {
      query.department_search = departmentsearch.value
    }
    if (selecteddepartment.value.length) {
      query.department = selecteddepartment.value
    }
    query.show_department = hidedepartment.value
    // if (hidedepartment.value) {

    // }
    if (noresulttext.value) {
      query.noresulttext = encodeURIComponent(noresulttext.value)
    }
    if (standalone.state) {
      query.standalone = standalone.state
    }

    tooltip.value = ''
    router.replace({
      path: '/',
      query: query
    })
    copylink.value = baseUrl() + makeUrlParams(query)
  }
)

function checkQueryOrAttributes(q, s) {
  if (checkQuery(q.language)) {
    selectedlanguage.value = decodeURIComponent(q.language)
  }
  if (checkQuery(q.type)) {
    selectedtype.value = decodeURIComponent(q.type)
  }
  if (checkQuery(q.department)) {
    selecteddepartment.value = decodeURIComponent(q.department)
  }
  if (checkQuery(q.department_search)) {
    departmentsearch.value = decodeURIComponent(q.department_search)
  }
  if (checkQuery(q.show_department)) {
    hidedepartment.value = setBoolean(decodeURIComponent(q.show_department))
  }
  if (checkQuery(q.noresulttext)) {
    noresulttext.value = decodeURIComponent(q.noresulttext)
  }
  if (checkQuery(q.standalone)) {
    standalone.state = JSON.parse(q.standalone)
  } else {
    standalone.state = s
  }
}
function setBoolean(str) {
  let o = false
  if (typeof str === 'string' && str.toLowerCase() === 'true') {
    o = true
  }
  return o
}

function baseUrl() {
  const url = location.href
  let urlArr = url.split('#/')
  return urlArr[0] + '#/'
}

function makeUrlParams(object) {
  let out = []
  for (const key in object) {
    const value = object[key]
    out.push(`${key}=${encodeURIComponent(value)}`)
  }
  return out.length ? `?${out.join('&')}&standalone=true` : ''
}

function copyLinkToClipord() {
  navigator.clipboard.writeText(copylink.value)
  tooltip.value = copylink.value
}

function copySPLinkToClipboard() {
  let link = copylink.value.replace(/#\//, '')
  navigator.clipboard.writeText(link)
  tooltip.value = link
}

function changeNoResultText() {
  noresulttext.value = ''
  selectedtype.value = ''
  selecteddepartment.value = ''
  departmentsearch.value = ''
  noresulttext.value = ''
  hidedepartment.value = false

  showEditor.value = 0
  if (selectedlanguage.value !== '') {
    noresulttext.value = getTranslation('noresulttext', selectedlanguage.value)
  }
}
</script>

<template>
  <div class="app" :class="{ 'has-configurator': !standalone.state }">
    <div
      class="configuration-panel"
      :class="{ configurator: !standalone.state }"
      v-if="!standalone.state"
    >
      <h1>Konfiguration</h1>
      <form>
        <div class="form-row selection-row">
          <div class="form-group language-selection">
            <label for="languages">Sprache</label>

            <select
              id="languages"
              name="languages"
              v-model="selectedlanguage"
              v-on:change="changeNoResultText"
            >
              <option value="">alle</option>
              <option v-for="l in languages" :key="l" :value="l.value">
                {{ l.title }} ({{ l.count }})
              </option>
            </select>
            <span class="instruction" v-if="!selectedlanguage">Bitte Sprache auswählen</span>
          </div>
          <div class="form-group type-selection" v-if="types.length && selectedlanguage">
            <label for="types">Typ</label>
            <select id="types" name="types" v-model="selectedtype">
              <option value="">Alle</option>
              <option v-for="(type, index) in types" :key="index">{{ type }}</option>
            </select>
          </div>
          <div class="form-group department-selection" v-if="selectedlanguage">
            <div class="search">
              <label for="departments-search">Suchen</label>
              <input type="text" id="departments-search" v-model="departmentsearch" />
            </div>
            <div class="selection">
              <label for="departments">Amt</label>
              <select id="departments" name="departments" v-model="selecteddepartment">
                <option value="">Alle</option>
                <option v-for="(department, index) in filtered.departments" :key="index">
                  {{ department.title }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row" v-if="selectedlanguage">
          <div class="form-group copy-link">
            <div class="hide-department-checkbox">
              <input
                type="checkbox"
                id="hide-department"
                name="hide-department"
                v-model="hidedepartment"
              /><label for="hide-department">Amt anzeigen</label>
            </div>
            <div class="input-button-wrapper">
              <input type="text" id="copy-link-input" name="copy-link-input" v-model="copylink" />
              <button type="button" id="copy-link" class="button" @click="copyLinkToClipord">
                Link kopieren
              </button>
              <button type="button" id="sp-copy-link" class="button" @click="copySPLinkToClipboard">
                WebPart Link kopieren)
              </button>
              <span class="button link-button"
                ><a :href="copylink" target="_blank">Vorschau</a></span
              >
            </div>
          </div>

          <div class="form-group tooltip" v-if="tooltip">
            <em>{{ copylink }}</em> <span>in die Zwischenablage kopiert!</span>
          </div>

          <div class="form-group no-result-text">
            <label for="no-result-text" class="no-result-text-label">Kein Resultat-Text</label>
            <div class="text-output" v-html="noresulttext"></div>
            <div class="instructions">
              <!-- <span class="alert"
                >Bitte den "Kein Resultat-Text" erst am Schluss vor dem Kopieren des Links
                anpassen!</span
              > -->
              <span class="toggle-button"
                ><button class="button" @click.prevent="toggleEditor()">
                  Text bearbeiten
                </button></span
              >
            </div>

            <textarea
              class="no-result-text-editor"
              id="no-result-text"
              v-if="showEditor"
              v-model="noresulttext"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
    <div class="standalone-app" v-if="selectedlanguage">
      <div class="item-count" v-if="filtered.count">
        <span v-html="getTranslation('open_jobs', selectedlanguage)"></span>
        <span class="count"> {{ filtered.jobs.length }} </span>
      </div>
      <div class="no-result" v-if="filtered.count == 0">
        <div v-html="decodeURIComponent(noresulttext)"></div>
      </div>
      <div class="responsive-table">
        <table class="job-list" v-if="filtered.count">
          <thead>
            <tr>
              <th v-html="getTranslation('jobtitle', selectedlanguage)"></th>
              <th
                v-if="hidedepartment"
                v-html="getTranslation('department', selectedlanguage, 'Amt')"
              ></th>
              <th v-html="getTranslation('workplace', selectedlanguage, 'Arbeitsort')"></th>
              <th v-html="getTranslation('application_due', selectedlanguage, 'Anmeldefrist')"></th>
            </tr>
          </thead>
          <tbody>
            <tr class="job" v-for="(item, index) in filtered.jobs" :key="index">
              <td>
                <span v-html="applicationLink(item.AdLink, item.Title)"></span>
                <!-- <span class="icon icon-apprentice">v-if="item.businessUnitId =='lehrstelle'"</span> -->
              </td>
              <td v-if="hidedepartment" v-html="item.Department"></td>
              <td class="workplace">{{ item.workplace }}</td>
              <td v-html="date(item.pubEndDate)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
