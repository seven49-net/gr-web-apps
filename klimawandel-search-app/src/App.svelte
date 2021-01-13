<script>
	export let appName;
	let searchUrl = "https://oeqtc4dy55.execute-api.eu-west-1.amazonaws.com/prod?tablename=gr_content_www_gr_ch";
	export let searchterm;
	export let results;
	export let message;
	let hits;
	fetch(searchUrl).then(response => response.json()).then(data => {
		console.log(data.Items);
		results = sortByTitle(data.Items);
	});
	function sortByTitle(arr) {
		let out = arr;
		if (arr.length) {
			out = arr.sort((a,b) => {
				let titleA = a.Title.toUpperCase();
				let titleB = b.Title.toUpperCase();
				return titleA.localeCompare(titleB);
			})
		} 
		return out;
	}
	function onKeyPress(e) {
		if (e.charCode == 13 ) {
			getSearchresults();
			e.preventDefault();
		}
	}
	function getSearchresults() {
		fetch(searchUrl + "&searchterm=" + searchterm).then((response) => {
			return response.json();
		}).then(data => {
			console.log(data);
			results = sortByTitle(data.Items);
			hits = results.length;
			if (hits) {
				message = `Die Suche nach <b>"${searchterm}"</b> ergab ${hits} Treffer`;
			} else {
				message = `Die Suche nach <b>"${searchterm}"</b> ergab keine Treffer. Bitte geben Sie einen neuen Suchbegriff ein und drücken Sie "Enter". Beachten Sie bitte Gross-/Kleinschreibung!`;
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
		<input type="text" name="searchterm" bind:value={searchterm} id="searchterm" on:keypress={onKeyPress} placeholder="bitte geben Sie einen Suchbegriff ein"/>
	</div>
	</form>
	{#if message}
		<div class="row">
			<div class="message column column-1-1">{@html message}</div>
		</div>
		
	{/if}
	{#if results.length} 
		<div class="results row">
			{#each results as r}
				<div class="result column">
					<a href={r.Url}>
					<span class="title">{r.Title}</span>
					{#if r.Summary}<div class="summary">{r.Summary}</div>{/if}
					</a>
				</div>
			{/each}
		</div>
	{/if}
	
</div>

<style>
	:root {
		--primary-color: #0069b4;
		--secondary-color: #e6f0f8;;
	}
	.result {
		margin: 20px 0;
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

	.title {
		font-weight: bold;
		display: block;
		margin: 0 0 .25rem;
		font-size: 1.125rem;
	}
	
	.message {
		margin: 25px 0 10px 0;
		
	}
</style>