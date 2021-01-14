<script>
	import Items from "./Items.svelte";
	import Message from "./Message.svelte";
	export let appName;
	let searchUrl = "https://oeqtc4dy55.execute-api.eu-west-1.amazonaws.com/prod?tablename=gr_content_www_gr_ch";
	export let searchterm;
	export let results;
	export let message;
	export let tags;
	let hits;
	let value = "";

	$: filteredResults = value == '' ? results : results.filter(result => {
		let tagsArr = trimStringInArray(result.Keywords.split(";"));
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
	function trimStringInArray(array) {
		return array = array.map(function (el) {
  			return el.trim();
		});	
	}
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
	function onKeyPress(e) {
		if (e.charCode == 13 ) {
			getSearchresults();
			value = "";
			e.preventDefault();
		}
	}
	function getTags(items) {
		let tagArray = [];
		items.forEach(i => {
			let kw = i.Keywords;
			console.log(kw);
			if (kw.length) {
				kw.split(";").forEach(k => {
					let keyword = k.trim();
					if (keyword.indexOf("#") > -1 && tagArray.indexOf(keyword) == -1) tagArray.push(keyword); 
				});
			}
		});
		return tagArray.sort();
	}
	function getSearchresults() {
		let url = searchterm == "" ? searchUrl : searchUrl + "&searchterm=" + searchterm;
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

	// function onChangeSelect(e) {
	// 	console.log(value);
	// }
</script>
<svelte:head>
<title>{appName}</title>
</svelte:head>


<div class="search-app">
	<form class="row">
		<div class="form-control column column-1-1">
		<label for="searchterm">Suchen</label>
		<input type="text" name="searchterm" bind:value={searchterm} id="searchterm" on:keypress={onKeyPress} placeholder="bitte geben Sie einen Suchbegriff ein"/>
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

<style>
	:root {
		--primary-color: #0069b4;
		--secondary-color: #e6f0f8;;
	}
	
	.form-control {
		background: var(--secondary-color);
		padding: .75rem;
		margin-right: 25px;
		margin-left: 25px;
	}
	input {
		display: block;
		width: 100%;
		padding: .25rem;
		font-size: 1rem;
		border: 1px solid #fff;
		background-color: #fff;
	}
	input::-internal-autofill-selected,
	input:active,
	input:focus,
	input:focus-within {
		background-color: #fff !important;
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
  border: 1px solid #fff;
  font-size: 1rem;
  font-family: inherit;
  line-height: normal;
  color: #000;
  background-color: #fff;
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