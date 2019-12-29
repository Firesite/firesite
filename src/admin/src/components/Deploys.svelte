<script>
  import Routes from "./Routes.svelte";
  export let site;
  console.log("Routes.site", site);
</script>

<style>
  .DeploysList {
    width: 200px;
    display: grid;
    height: 100%;
    border-right: solid black 1px;
  }
</style>

{#each site.deploys as deploy}
  <p>{deploy.id}</p>
  <p>{JSON.stringify(deploy.routes)}</p>
  <Routes {deploy} />
{/each}
