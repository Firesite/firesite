<script>
  export let deploy;
  console.log("deploy", deploy);
  const getFileName = route => {
    const r = new RegExp("^([^.]+)", "g");
    const [filename] = r.exec(route);
    return filename;
  };
</script>

<style>
  .RoutesList {
    border-right: solid 1px black;
    height: 100%;
    width: 200px;
    display: grid;
  }
</style>

<h2>Routes</h2>
<div class="RoutesList">
  {#if deploy && deploy.routes}
    {#each Object.keys(deploy.routes) as route}
      <a href=".">{getFileName(route)}</a>
    {/each}
  {/if}
</div>
