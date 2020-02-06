<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { quintOut } from "svelte/easing";

  import { slide, crossfade } from "svelte/transition";
  import { get } from "svelte/store";
  import { goto } from "@sapper/app";
  import { site, siteId, draggedPage } from "../stores";
  import PageSelector from "./PageSelector.svelte";
  import PageAdder from "./PageAdder.svelte";

  const dispatch = createEventDispatcher();

  export let page, path;

  let editing = false;
  let active = false;
  let showButton = false;
  export let expanded = false;
  let inputElement, wasExpanded;

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  });
  const handleSiteNameDblClicked = () => {
    editing = true;
    setTimeout(() => {
      inputElement.focus();
    }, 0);
  };

  const handleSiteNameClicked = () => {
    console.log("kik");
    goto(`site/${get(siteId)}/edit/${page.ref.id}`);
  };
  const handleInputBlurred = () => {
    editing = false;
    dispatch("updated", page);
  };

  const handleKeyUp = e => {
    if (e.key === "Enter") inputElement.blur();
  };

  const handleDragStart = e => {
    draggedPage.set(page);
    e.stopPropagation();
  };

  const handleDragEnter = e => {
    wasExpanded = expanded;
    expanded = true;
    active = true;
  };

  const handleDragLeave = e => {
    expanded = wasExpanded;
    active = false;
  };

  const handleDrop = async e => {
    active = false;
    expanded = true;
    await site.pages.move($draggedPage, page);
  };
</script>

<style>
  .PageSelectorItem {
    display: grid;
    grid-template-columns: 1em auto 1em;
    width: 100%;
    cursor: pointer;
  }
  .PageList {
    padding: 0;
    margin-left: 1em;
    display: grid;
    list-style: none;
  }
  .active {
    background: rgba(0, 0, 0, 0.2);
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

  .Buttons {
    height: 1.2em;
  }
</style>

<div>
  {#if editing}
    <input
      type="text"
      bind:this={inputElement}
      bind:value={page.title}
      on:blur={handleInputBlurred}
      on:keyup={handleKeyUp} />
  {:else if page}
    <div
      class="PageSelectorItem"
      draggable="true"
      on:dragstart={handleDragStart}
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      ondragover="return false"
      on:mouseenter={() => (showButton = true)}
      on:mouseleave={() => (showButton = false)}
      in:receive={{ key: page.key }}
      out:send={{ key: page.key }}>
      <div>
        {#if page.children && page.children.length}
          <p on:click={() => (expanded = !expanded)}>></p>
        {/if}
      </div>
      <p
        class:active
        on:click={handleSiteNameClicked}
        on:dblclick={handleSiteNameDblClicked}>
        {page.title}
      </p>
      <div class="Buttons">
        {#if showButton}
          <PageAdder path={page.path ? `${page.path}/${page.key}` : page.key} />
        {/if}
      </div>
    </div>
    {#if page.children && page.children.length && expanded}
      <div class="PageList" transition:slide>
        <PageSelector {page} path={path ? `${path}/${page.key}` : page.key} />
      </div>
    {/if}
  {/if}
</div>
