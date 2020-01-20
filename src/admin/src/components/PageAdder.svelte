<script>
  import { site } from "../stores";
  export let path;
  let showInput = false;
  let inputElement, title;

  const addPage = async () => {
    title = title.trim();
    let key = title
      .toLowerCase()
      .trim()
      .split(" ")
      .join("-");
    const page = path == "index" ? { key, title } : { key, title, path };
    await site.pages.add(page);
  };

  const handleAddPageClicked = () => {
    showInput = true;
    setTimeout(() => inputElement.focus(), 0);
  };

  const handleKeyUp = e => {
    if (e.key === "Enter") addPage();
  };
</script>

{#if showInput}
  <input
    type="text"
    bind:this={inputElement}
    bind:value={title}
    on:blur={() => (showInput = false)}
    on:keyup={handleKeyUp} />
{:else}
  <button on:click={handleAddPageClicked}>+</button>
{/if}

<style>
  button {
    border: none;
    padding: 0;
    text-align: center;
  }
</style>
