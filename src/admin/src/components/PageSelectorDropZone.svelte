<script>
  import { draggedPage, site } from "../stores";
  export let pos, page, dir, path;
  let active = false;

  const handleDrop = async e => {
    active = false;
    await site.pages.move($draggedPage, page, pos, dir);
  };

  const handleDragEnter = e => {
    active = true;
  };
  const handleDragLeave = e => {
    active = false;
  };
</script>

<style>
  .DropZone {
    height: 1em;
    font-size: 12px;
  }

  .active {
    background: rgba(0, 0, 0, 0.2);
  }
</style>

<div
  class="DropZone"
  class:active
  ondragover="return false"
  on:drop={handleDrop}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave} />
