<script>
	import Items from "./Items.svelte";
	import Message from "./Message.svelte";
	import utils from "../../defaults/js/utils.js";
	import configs from "../../defaults/js/configs.js";
	export let appName;

	export let searchterm;
	export let results;
	export let message;
	export let tags;
	let hits;
	let value = "";
	const env = "intklimawandel_gr_ch";
	let searchUrl = utils.updateQueryStringParameter(configs.url, "tablename", configs[env].contentTable);

	$: filteredResults = value == '' ? results : results.filter(result => {
		console.log("keywords: " + result.Keywords);
		let tagStr = result.hasOwnProperty("Keywords") ? result.Keywords.replace(/,/gmi, ";") : "";
		let tagsArr = tagStr.indexOf(";") > -1 ? utils.trimStringInArray(tagStr.split(";")) : [tagStr];
		return tagsArr.indexOf(value) > -1;
	});

	fetch(searchUrl).then(response => response.json()).then(data => {
		console.log(data.Items);
		results = sortByTitle(data.Items);
		if (results.length) {
			tags = getTags(results);
			console.log(tags);
		}
	});

	function sortByTitle(arr) {
		let out = arr;
		if (arr.length) {
			out = arr.sort((a,b) => {
				let titleA = a.Title.toUpperCase();
				let titleB = b.Title.toUpperCase();
				return titleA.localeCompare(titleB);
			});
		}
		return out;
	}

	function onkeyup(e) {
		filteredResults = results.filter(function(s) {
			return s.SearchContent.indexOf(searchterm.toLowerCase()) > -1;
		});

	}

	function onkeydown(e) {
		if (e.key === "Enter" || e.keyCode === 13) {
			e.preventDefault();
		}
	}

	function getTags(items) {
		let tagArray = [];
		items.forEach(i => {
			let kw = i.hasOwnProperty("Keywords") ? i.Keywords : [];
			console.log(kw);
			if (kw.length) {
				kw = kw.replace(/,/gmi, ";");
				console.log("new: " + kw)
				kw.split(";").forEach(k => {
					let keyword = k.trim();
					console.log(keyword)
					if (keyword.indexOf("#") > -1 && tagArray.indexOf(keyword) == -1) tagArray.push(keyword);
				});
			}
		});
		return tagArray.sort();
	}

	function getSearchresults() {
		let url = searchterm == "" ? searchUrl : utils.updateQueryStringParameter(searchUrl,"searchterm" , searchterm.toLowerCase());
		fetch(url).then((response) => {
			return response.json();
		}).then(data => {
			console.log(data);
			results = sortByTitle(data.Items);
			hits = results.length;
			if (hits) {
				tags = getTags(results);
				message = searchterm == "" ? '' :  `Die Suche nach <b>"${searchterm}"</b> ergab ${hits} Treffer`;
			} else {
				message = `Die Suche nach <b>"${searchterm}"</b> ergab keine Treffer. Bitte geben Sie einen neuen Suchbegriff ein und drücken Sie "Enter". Beachten Sie bitte Gross-/Kleinschreibung!`;
				tags = [];
			}
		});
	}
</script>
<svelte:head>
<title>{appName}</title>
</svelte:head>


<div class="search-app">
	<form class="row">
		<div class="form-control column column-1-1">
		<label for="searchterm">Suchen</label>
		<input type="text" name="searchterm" bind:value={searchterm} id="searchterm" on:keyup={onkeyup} placeholder="bitte geben Sie einen Suchbegriff ein" on:keydown={onkeydown} />
	</div>

	{#if tags.length}
	<div class="form-control column column-1-1">
		<label for="tags">Tag Filter</label>
		<select id="tags" name="tags" bind:value>
			<option value="">--</option>
			{#each tags as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
	</div>
	{/if}
	</form>

	<Message message={message} />
	<Items items={filteredResults} />


</div>

<style type="text/scss">
	$primary-color: #0069b4;
	$secondary-color: #e6f0f8;
	$white: #fff;
	:root {
		--primary-color: $primary-color;
		--secondary-color: $secondary-color;
	}

	.form-control {
		background: $secondary-color;
		padding: .75rem;
		margin-right: 25px;
		margin-left: 25px;
	}
	input {
		display: block;
		width: 100%;
		padding: .25rem;
		font-size: 1rem;
		border: 1px solid $white;
		background-color: $white;
	}
	input::-internal-autofill-selected,
	input:active,
	input:focus,
	input:focus-within {
		background-color: $white !important;
	}
	label {
		display: block;
	}
	select {
  display: block;
  width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  margin: 0 0 0.75rem 0;
  border: 1px solid $white;
  font-size: 1rem;
  font-family: inherit;
  line-height: normal;
  color: #000;
  background-color: $white;
  border-radius: 0;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='32' height='24' viewBox='0 0 32 24'><polygon points='0,0 32,0 16,24' style='fill: rgb%28138, 138, 138%29'></polygon></svg>");
  background-size: 9px 6px;
  background-position: right 0.5rem center;
  background-origin: content-box;
  background-repeat: no-repeat;
}
</style>