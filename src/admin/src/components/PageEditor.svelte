<script>
  import { onMount } from "svelte";
  import { page } from "../stores";
  import ElementHtml from "./ElementHtml.svelte";
  import PageParentSelector from "./PageParentSelector.svelte";
  let showElementSelector = false;
  const handleAddElementClicked = () => {
    showElementSelector = true;
  };

  const handleAddHtmlClicked = async () => {
    const id = Math.random()
      .toString(36)
      .substr(2);
    await page.elements.add({
      id,
      type: "html",
      content: "",
      created: new Date(),
      parent: false
    });
  };
  let mounted = false;
  let selectElement;
  const options = [{ type: "html", component: ElementHtml }];
  onMount(() => {
    selectElement = type => {
      return options.find(option => option.type === type).component;
    };
    mounted = true;
  });

  const handleParentSelected = e => {
    const parent = e.detail;
    page.update({ ...$page, parent });
  };
</script>

<button on:click={handleAddElementClicked}>Add Element</button>
{#if showElementSelector}
  <div class="ElementSelector">
    <button on:click={handleAddHtmlClicked}>Add HTML Element</button>
  </div>
{/if}

{#if mounted && $page && $page.elements}
  <PageParentSelector page={$page} on:select={handleParentSelected} />
  {#each $page.elements as element}
    <div>
      <svelte:component
        this={selectElement(element.type)}
        id={element.id}
        content={element.content} />
    </div>
  {/each}
{/if}
