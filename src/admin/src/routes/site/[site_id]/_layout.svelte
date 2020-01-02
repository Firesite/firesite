<script context="module">
  import { siteId, site } from "../../../stores";
  export async function preload({ params }) {
    siteId.set(params.site_id);
  }
</script>

<div class="BoxLg">
  {#if $site}
    <h1>{$site.name}</h1>
    <slot />
  {/if}
</div>
