<script context="module">
  import { page, slug } from "../../../../../stores";
  import PageEditor from "../../../../../components/PageEditor.svelte";
  export async function preload({ params }, session) {
    slug.set(params.slug);
  }
</script>

{#if $page}
  <h2>{$page.title}</h2>
  <div class="BoxInsetLg">
    <PageEditor />
  </div>
{/if}
