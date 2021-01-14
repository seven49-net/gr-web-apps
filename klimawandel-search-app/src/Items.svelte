<script>
  export let items = [];
  function renderTags(item) {
    let tags = item.Keywords;
    let out = [];
    if (tags.length) {
      tags.split(";").forEach(k => {
					let keyword = k.trim();
					if (keyword.indexOf("#") > -1 && out.indexOf(keyword) == -1) out.push(keyword); 
				});
    }
    return out.join(" ");
  }
  let r;
 
</script>

{#if items.length} 
		<div class="results row">
			{#each items as r}
				<div class="result column">
          <a href={r.Url}>
            {#if r.Keywords != undefined}
              <div class="tags">{renderTags(r)}</div>
            {/if}
					<span class="title">{r.Title}</span>
					{#if r.Summary}<div class="summary">{r.Summary}</div>{/if}
					</a>
				</div>
			{/each}
		</div>
  {/if}
  
  <style>
    .result {
		/* margin: 20px 0; */
	  }
    .title {
		font-weight: bold;
		display: block;
		margin: 0 0 .25rem;
		font-size: 1.125rem;
	}
  </style>