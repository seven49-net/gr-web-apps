<script>
  export let message;
</script>

{#if message}
  <div class="row">
    <div class="message column column-1-1">{@html message}</div>
  </div>
		
{/if}

<style>
  .message {
		margin: 25px 0 10px 0;
		
	}
</style>