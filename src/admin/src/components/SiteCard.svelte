<script>
	export let site;
</script>

<style>
	.card {
		width: 100%;
		height: 5rem;
		border-radius: 5px;
		border: solid 1px rgba(0, 0, 0, 0.4);
    padding: 1em;
	}
</style>

<div class="card">
  <a rel="prefetch" href={`site/${site.id}`}>{site.name}</a>
</div>
