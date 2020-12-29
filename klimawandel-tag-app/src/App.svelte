<script>
	export let tags = [];
let url = "https://oeqtc4dy55.execute-api.eu-west-1.amazonaws.com/prod?tablename=gr_tags_www_gr_ch";
fetch(url).then(response => {
	return response.json();
}).then(data => {
	console.log(data);
	if (data.Items.length) {
		tags = data.Items;
	}
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
</div>

<style>
	.tag-app {
		width: 80%;
		max-width: 100%;
		margin: 2rem auto;
	}
	.tag-cloud {
		list-style: none;
	}

	
</style>