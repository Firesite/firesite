<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { get } from "svelte/store";
  import { goto } from "@sapper/app";
  import { siteId } from "../stores";
  const dispatch = createEventDispatcher();

  export let page;
  let editing = false;
  let inputElement;
  const handleSiteNameDblClicked = () => {
    editing = true;
    setTimeout(() => {
      inputElement.focus();
    }, 0);
  };

  const handleSiteNameClicked = () => {
    goto(`site/${get(siteId)}/edit/${page.slug}`);
  };
  const handleInputBlurred = () => {
    editing = false;
    dispatch("updated", page);
  };

  const handleKeyUp = e => {
    if (e.key === "Enter") inputElement.blur();
  };
</script>

<style>
  .PageSelectorItem {
    padding: 1em 0;
    cursor: pointer;
  }

  input,
  p {
    margin: 0;
    font-family: "Lexend Deca", Roboto, -apple-system, BlinkMacSystemFont,
      Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
    font-size: 14px;
    color: #333;
    background-color: #e9eef3;
  }

  p {
    line-height: 1.2em;
  }

  input {
    background-color: #fff;
    border: solid #0f4c81 1px;
  }
</style>

<div class="PageSelectorItem">
  {#if editing}
    <input
      type="text"
      bind:this={inputElement}
      bind:value={page.name}
      on:blur={handleInputBlurred}
      on:keyup={handleKeyUp} />
  {:else}
    <p on:click={handleSiteNameClicked} on:dblclick={handleSiteNameDblClicked}>
      {page.name}
    </p>
  {/if}

</div>
