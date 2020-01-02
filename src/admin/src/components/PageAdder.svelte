<script>
  import { site } from "../stores";
  let showInput = false;
  let inputElement, pageName;

  const addPage = async () => {
    let slug = pageName
      .toLowerCase()
      .trim()
      .split(" ")
      .join("-");
    let name = pageName;
    await site.pages.add({ name, slug });
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
    bind:value={pageName}
    on:blur={() => (showInput = false)}
    on:keyup={handleKeyUp} />
{:else}
  <button on:click={handleAddPageClicked}>Add Page</button>
{/if}
