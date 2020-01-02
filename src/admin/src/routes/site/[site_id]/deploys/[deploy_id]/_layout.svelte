<script context="module">
  import { site } from "../../../../../stores";
  import PageSelector from "../../../../../components/PageSelector.svelte";

  export async function preload({ params }, session) {
    let deployId = params.deploy_id;
    return { deployId };
  }
</script>

<script>
  export let deployId;
  let deploy;
  $: deploy =
    $site.deploys && deployId
      ? $site.deploys.find(el => el.id === deployId)
      : null;
</script>

<style>
  .PageEditorContainer {
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1em;
  }
</style>

<div class="PageEditorContainer">
  <div>
    <PageSelector {deploy} />
  </div>
  <div>
    <slot />
  </div>
</div>
