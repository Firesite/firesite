<script context="module">
  import { siteId, site } from "../../../stores";
  import Deploy from "../../../components/Deploy.svelte";
  export async function preload({ params }) {
    siteId.set(params.site_id);
  }
</script>

<div class="BoxLg">
  {#if $site}
    <a href="site/{$site.id}">
      <h1>{$site.name}</h1>
    </a>
    <Deploy site={$site} />
    <slot />
  {/if}
</div>
