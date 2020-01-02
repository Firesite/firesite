<script>
  import { createEventDispatcher } from "svelte";
  import PageSelectorItem from "./PageSelectorItem.svelte";
  import PageAdder from "./PageAdder.svelte";
  export let pages;

  const dispatch = createEventDispatcher();

  const handleAddPageClicked = async () => {
    dispatch("addPage");
  };

  const handlePageItemUpdated = e => {
    const page = e.detail;
    console.log("Updating Page", page);
  };

  const handlePageItemClicked = e => {
    const page = e.detail;
    console.log(page, "clicked");
  };
</script>

<style>
  ul {
    padding: 0;
    display: grid;
    list-style: none;
  }
</style>

{#if pages}
  <h2>Pages</h2>
  <div class="BoxInsetLg">
    <ul>
      {#each pages as page}
        <li>
          <PageSelectorItem
            on:updated={handlePageItemUpdated}
            on:clicked={handlePageItemClicked}
            {page} />
        </li>
      {/each}
    </ul>
    <div class="BottomContainer">
      <PageAdder />
    </div>
  </div>
{/if}
