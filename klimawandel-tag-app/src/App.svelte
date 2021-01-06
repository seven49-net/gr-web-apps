<script>
	export let tags;
	export let clickedtag;
	export let pages;
let url = "https://oeqtc4dy55.execute-api.eu-west-1.amazonaws.com/prod?tablename=gr_tags_www_gr_ch";
function randomFs(min, max) {
		min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeObject(tags){
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
		// console.log(tags);
		//makeObject(tags);
	}
}).then(()=> {
	let list = [];
	tags.forEach(function(t) {
		console.log(t);
		list.push([t.name, randomFs(20,72), t.pages])
	});
	console.log(list);
	WordCloud(document.querySelector("#tag-cloud"), {
		list: list, 
		fontWeight: "bold",
		fontFamily: "Comfortaa, cursive",
		backgroundColor: "rgba(137, 193, 122, .55)",
		minSize: 18,
		color: function(word,weight, fontSize) {
			let color = "#00762E";
			if (fontSize >= 32) color = "#013DB0";
			if (fontSize >= 48) color =  "#600063";
			return color;
		},
		classes: function(word, weight, fontSize) {
			return "wc wc-" + word.toLowerCase().replace(/ /gmi, "-") + " wc-weight-" + weight + " wc-fs-" + fontSize;
		},
		click: function(item) {
			 pages = item[2];
			 clickedtag = item[0];
		},
		gridSize: 20,
		rotateRatio: 0.75,
		shape: "circle",
		ellipticity: 1
	});
	
});

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
			<li><a href={pages.url}>{page.title}</a></li>
		{/each}
	</ul>
		
		{/if}
		
</div>

<style>
	.tag-app {
		width: 80%;
		max-width: 100%;
		margin: 2rem auto;
	}
	.tag-cloud {
		list-style: none;
		margin: 10px 0;
		padding: 0;
		
	}
	.tag-cloud li {
			display: inline-block;
			margin: 0 5px 0 0;
		}

	#tag-cloud {
		width: 100%;
		max-width: 100%;
		position: relative;
		display: block;
	}
	@media all and (min-width: 440px) {
		#tag-cloud {
			width: 440px;
			
		}
	}
		

	#tag-cloud:before {
		content: "";
		display: block;
		padding: 0 0 100% 0;
	}
	
</style>