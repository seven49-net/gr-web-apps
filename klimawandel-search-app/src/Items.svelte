<script>
import { get_slot_changes } from "svelte/internal";

  import utils from "../../defaults/js/utils.js";
  export let items = [];
  function renderTags(item) {
    let tags = item.Keywords == undefined ? [] : item.Keywords;
    let out = [];
    if (tags.length) {
      let temp = utils.getTags(tags);
      out = temp.map(t => "#" + t)
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
            {#if r.PreviewImage }<img src={r.PreviewImage} alt='' />{/if}
					<span class="title">{#if r.LongTitle}{r.LongTitle}{:else}{r.Title}{/if}</span>
					{#if r.Content}<div class="summary">{@html utils.getText(r.Content, 100)}</div>{/if}
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