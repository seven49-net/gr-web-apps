<script>
  export let options = [];
  export let value;
  function onChangeSelect(e) {
    console.log(value);
    value = value;
	}
</script>

{#if options.length}
	<div class="form-control column column-1-1">
		<select id="tags" name="tags" bind:value on:change={onChangeSelect}>
			<option value="">--</option>
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>
{/if}
