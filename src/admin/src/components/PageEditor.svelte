<script>
  import { page } from "../stores";
  let showElementSelector = false;
  const handleAddElementClicked = () => {
    showElementSelector = true;
  };

  const handleAddSectionClicked = async () => {
    const id = Math.random()
      .toString(36)
      .substr(2);
    await page.elements.add({ id, type: "section" });
  };
</script>

<button on:click={handleAddElementClicked}>Add Element</button>
{#if showElementSelector}
  <div class="ElementSelector">
    <button on:click={handleAddSectionClicked}>Add Section</button>
  </div>
{/if}
{#if $page && $page.elements}
  <ul>
    {#each $page.elements as element}
      <li>{element.type}</li>
    {/each}
  </ul>
{/if}
