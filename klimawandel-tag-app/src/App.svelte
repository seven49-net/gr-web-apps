<script>
	// import { watchResize } from "svelte-watch-resize";
	export let tags;
	export let clickedtag;
	export let pages;
	let url = "https://oeqtc4dy55.execute-api.eu-west-1.amazonaws.com/prod?tablename=gr_tags_www_gr_ch";
	export let list = [];
	// $: list = tags.forEach(function(t) {
	// 		console.log(t);
	// 		list.push([t.name, randomFs(20,72), t.pages])
	// 	});
	function randomFs(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function makeObject(tags) {
		let updatedTags = [];
		tags.forEach((v) => {
			//console.log(v);
			let pages = JSON.parse(v.pages);
			//console.log(v.pages);
			v.pages = pages;
			updatedTags.push(v);
		});
		return updatedTags;
	}
	fetch(url).then(response => {
		return response.json();
	}).then(data => {
		console.log(data);
		if (data.Items.length) {
			tags = makeObject(data.Items);
		}
	}).then(() => {

		tags.forEach(function (t) {
			console.log(t);
			list.push([t.name, randomFs(20, 72), t.pages])
		});
		console.log(list);
		wordcloud(list);
	});

	function wordcloud(list) {
		WordCloud(document.querySelector("#tag-cloud"), {
			list: list,
			fontWeight: "bold",
			fontFamily: "Arial, sans-serif",
			backgroundColor: "#e6f0f8",
			minSize: 18,
			color: function (word, weight, fontSize) {
				let color = "rgba(0, 104, 180, 0.75)";
				if (fontSize >= 32) color = "rgba(0, 104, 180, 0.875)";
				if (fontSize >= 48) color = "rgba(0, 104, 180, 1)";
				return color;
			},
			classes: function (word, weight, fontSize) {
				return "wc wc-" + word.toLowerCase().replace(/ /gmi, "-") + " wc-weight-" + weight + " wc-fs-" + fontSize;
			},
			click: function (item) {
				pages = item[2];
				clickedtag = item[0];
			},
			gridSize: 10,
			rotateRatio: 0.75,
			shape: "circle",
			ellipticity: 1,
			shrinkToFit: true
		});
	}
</script>

<div class="tag-app">
	{#if tags.length}
	<ul class="tag-cloud">
		{#each tags as tag}
			<li>{tag.name}</li>
		{/each}
	</ul>
		
		{/if}

		<div id="tag-cloud"></div>
		
	{#if pages.length}
	<div class="hovered-tag">{ clickedtag }</div>
	<ul class="page-list">
		{#each pages as page}
			<li><a href={page.url}>{page.title}</a></li>
		{/each}
	</ul>
		
		{/if}
		
</div>

<style>
	:root {
		--primary-color: #0069b4;
		--secondary-color: #e6f0f8;
	}
	.tag-app {
		
		font-family: Arial, sans-serif;
	}
	.tag-cloud {
		list-style: none;
		margin: 10px 0;
		padding: 0;
		display: block;
		width: 100%;
		max-width: 100%;
		
	}
	.tag-cloud li {
			display: inline-block;
			margin: 0 5px 0 0;
		}

	#tag-cloud {
		width: 500px;
		height:500px;
		max-width: 100%;
		position: relative;
		display: block;
	}
	@media all and (min-width: 440px) {
		#tag-cloud {
			
			
		}
	}
		

	#tag-cloud:before {
		content: "";
		display: block;
		padding: 0 0 100% 0;
	}
	
</style>