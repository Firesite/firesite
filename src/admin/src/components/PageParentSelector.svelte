<script>
  import {
    onMount,
    beforeUpdate,
    afterUpdate,
    createEventDispatcher
  } from "svelte";
  import { get } from "svelte/store";
  import { site } from "../stores";
  export let page;
  let potentialParents = [];
  let parent, pageSlug;
  const dispatch = createEventDispatcher();
  beforeUpdate(() => {
    if (Array.isArray($site.pages)) {
      potentialParents = $site.pages
        .filter(element => element.slug != page.slug)
        .map(element => ({ slug: element.slug, name: element.name }));
    }
  });

  afterUpdate(() => {
    if (page.slug != pageSlug) {
      parent = page.parent;
    }
    pageSlug = page.slug;
  });

  const handleParentSelected = () => {
    dispatch("select", parent);
  };
</script>

{#if page.slug != 'index'}
  <label for="parent">Select Parent</label>
  <select
    name="parent"
    id="parent-selector"
    bind:value={parent}
    on:change={() => dispatch('select', parent)}>
    <option value="">Top level page</option>
    {#each potentialParents as potentialParent}
      <option value={potentialParent.slug}>{potentialParent.name}</option>
    {/each}
  </select>
{/if}
