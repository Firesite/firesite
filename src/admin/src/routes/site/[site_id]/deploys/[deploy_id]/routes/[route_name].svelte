<script context="module">
  import { site } from "../../../../../../stores";
  export async function preload({ params, query }, session) {
    const routeName = params.route_name;
    const deployId = params.deploy_id;
    return { routeName, deployId };
  }
</script>

<script>
  export let routeName, deployId;
  let fileContents;
  let hasDeploys = false;
  let deploy;
  let route = "No Route...";

  $: deploy = $site.deploys
    ? $site.deploys.find(el => el.id === deployId)
    : null;

  $: [fileName, route] = deploy
    ? Object.entries(deploy.routes).find(el => {
        const fileName = el[0].match(/^([^.]+)/)[0];
        return fileName === routeName;
      })
    : "No Route";
</script>

<style>
  .RouteName {
    font-size: 0.8em;
    color: #aaa;
  }
</style>

{#if deploy && route}
  {#if route}
    <div class="BoxInsetLg">
      <span class="RouteName">{routeName}</span>
      <div contenteditable="true">
        {@html route.content}
      </div>
    </div>
  {/if}
{/if}
