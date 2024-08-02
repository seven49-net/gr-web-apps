<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  fetchData,
  applicationLink,
  date,
  getTranslation,
  languageList,
  typeList,
  departmentList
} from './api.js'

const data = ref([])
const hidedepartment = ref(true)
const selectedlanguage = ref('')
const languages = ref([])
const types = ref([])
const selectedtype = ref('')
const departmentsearch = ref('')

onMounted(async () => {
  const response = await fetchData()
  data.value = response.Items
  console.log(data.value)
  languages.value = languageList(data.value)
  types.value = typeList(data.value)
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
  let departments = departmentList(jobs, selectedtype.value)

  return { jobs: jobs, departments: departments }
})
const departments = computed(() => {
  let d = departmentList(data.value, selectedtype.value)
  return d
})
</script>

<template>
  <div class="app">
    <div class="builder-test">
      <form>
        <div class="form-group language-selection">
          <label for="languages">Sprache</label>
          <select id="languages" name="languages" v-model="selectedlanguage">
            <option value="">alle</option>
            <option v-for="l in languages" :key="l" :value="l.value">
              {{ l.title }} ({{ l.count }})
            </option>
          </select>
          <!-- <span class="selected"> {{ selectedlanguage }}</span> -->
        </div>
        <div class="form-group type-selection" v-if="types.length">
          <label for="types">Typ</label>
          <select id="types" name="types" v-model="selectedtype">
            <option value="">Alle</option>
            <option v-for="(type, index) in types" :key="index">{{ type }}</option>
          </select>
          {{ selectedtype }}
        </div>
        <div class="form-group department-selection">
          <div class="search">
            <label for="departments-search">Suchen</label>
            <input type="text" id="departments-search" v-model="departmentsearch" />
          </div>
          <label for="departments">Amt</label>
          <select id="departments" name="departments">
            <option value="">Alle</option>
            <option v-for="(department, index) in filtered.departments" :key="index">
              {{ department.title }}
            </option>
          </select>
        </div>

        <div class="form-group copy-link">
          <!--  v-if="copylink" -->
          <div class="hide-department-checkbox">
            <input type="checkbox" id="hide-department" name="hide-department" /><label
              for="hide-department"
              >Amt nicht anzeigen</label
            >
          </div>
          <input type="text" id="copy-link-input" name="copy-link-input" />
          <button type="button" id="copy-link" class="button">Link kopieren</button>
          <span class="button link-button"><a target="_blank">Vorschau</a></span>
        </div>

        <div class="form-group tooltip"><em></em> <span>in die Zwischenablage kopiert!</span></div>

        <div class="form-group no-result-text">
          <label for="no-result-text" class="no-result-text-label">Kein Resultat-Text</label>
          <div class="text-output">v-html="noresulttext"</div>
          <div class="instructions">
            <span class="alert"
              >Bitte den "Kein Resultat-Text" erst am Schluss vor dem Kopieren des Links
              anpassen!</span
            >
            <span class="toggle-button"><button class="button">Text bearbeiten</button></span>
          </div>

          <textarea class="no-result-text-editor hidden" id="no-result-text"></textarea>
        </div>
      </form>
    </div>
    <div class="standalone-app">
      <div class="item-count">
        <!--  v-if="count" -->
        <span v-html="getTranslation('open_jobs', selectedlanguage)"></span>
        <span class="count"> {{ filtered.length }} </span>
      </div>
      <div class="no-result">
        <!-- v-if="count == 0" -->
        <!-- <div>v-html noresulttext</div> -->
      </div>
      <div class="responsive-table">
        <table class="job-list" v-if="filtered.jobs.length">
          <thead>
            <tr>
              <th v-html="getTranslation('jobtitle', selectedlanguage)"></th>
              <th
                v-if="hidedepartment"
                v-html="getTranslation('department', selectedlanguage, 'Amt')"
              ></th>
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
              <td v-html="date(item.pubEndDate)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
