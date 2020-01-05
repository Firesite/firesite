<script>
  import { onMount, afterUpdate } from "svelte";
  import { page } from "../stores";
  export let id, content;
  let quill, editorElement, toolbarElement;
  const handleSaveClicked = async () => {
    content = {
      delta: JSON.parse(JSON.stringify(quill.getContents())),
      html: quill.root.innerHTML
    };
    await page.elements.update(id, content);
  };

  const handleRemoveClicked = async () => {
    await page.elements.remove(id);
  };

  const setContents = () => {
    if (quill && content && content.delta) quill.setContents(content.delta);
  };

  onMount(async () => {
    const Quill = (await import("quill")).default;
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"]
    ];
    quill = new Quill(editorElement, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions
      }
    });
    setContents();
  });

  afterUpdate(() => {
    setContents();
  });
</script>

<style>
  div {
    background-color: #fff;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>

<div bind:this={editorElement} />

<button on:click={handleSaveClicked}>Save</button>
<button on:click={handleRemoveClicked}>Remove</button>
