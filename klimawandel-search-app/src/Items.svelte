<script>
  export let items = [];
  function renderTags(item) {
    let tags = item.Keywords == undefined ? [] : item.Keywords;
    let out = [];
    if (tags.length) {
      tags = tags.replace(/,/gmi, ";");
      tags.split(";").forEach(k => {
					let keyword = k.trim();
					if (keyword.indexOf("#") > -1 && out.indexOf(keyword) == -1) out.push(keyword); 
				});
    }
    return out.join(" ");
  }
  let r;
  function getText(str, length) {
    let count = length === "undefined" ? 0 : length;
    let cleaned = str.replace(/(<([^>]+)>)/gi, "");
    let out = cleaned; 
    if(count) {
      if (cleaned.length > count-1) {
        out = cleaned.substring(0, length) + "...";
      }
    }
    return out;
    }
</script>

{#if items.length} 
		<div class="results row">
			{#each items as r}
				<div class="result column">
          <a href={r.Url}>
            {#if r.Keywords != undefined}
              <div class="tags">{renderTags(r)}</div>
            {/if}
					<span class="title">{#if r.LongTitle}{r.LongTitle}{:else}{r.Title}{/if}</span>
					{#if r.Content}<div class="summary">{getText(r.Content, 200)}</div>{/if}
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