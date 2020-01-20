<script>
  import { createEventDispatcher } from "svelte";
  import PageSelectorItem from "./PageSelectorItem.svelte";
  import PageSelectorDropZone from "./PageSelectorDropZone.svelte";
  import PageAdder from "./PageAdder.svelte";

  export let page;

  export let path = null;
  $: path = path == "index" ? null : path;

  const dispatch = createEventDispatcher();

  const handleAddPageClicked = async () => {
    dispatch("addPage");
  };
</script>

<style>
  .Page {
  }
</style>

{#if page}
  {#each page.children as child, pos}
    <div class="Page">
      <PageSelectorDropZone {page} {path} {pos} dir={'above'} />
      <PageSelectorItem page={child} {path} />
      <PageSelectorDropZone {page} {path} {pos} dir={'below'} />
    </div>
  {/each}
{/if}
