<script context="module">
  import { site } from "../../../../stores";
  import PageSelector from "../../../../components/PageSelector.svelte";
</script>

<style>
  .EditContainer {
    display: grid;
    grid-template-columns: 160px auto;
    grid-column-gap: 1em;
  }

  .EditColumn {
    display: grid;
    grid-template-rows: 2.5em auto;
  }
</style>

<div class="EditContainer">
  <div class="EditColumn">
    <h2>Pages</h2>
    <div class="BoxInsetLg">
      <p>Home</p>
      <PageSelector page={$site.content} />
    </div>
  </div>
  <div class="EditColumn">
    <slot />
  </div>
</div>
