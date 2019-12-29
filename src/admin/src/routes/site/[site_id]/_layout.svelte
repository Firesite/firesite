<script context="module">
  export async function preload({params}, session) {
    const siteId = params.site_id;
    return { siteId }
  }
</script>

<script>
  export let siteId;
</script>

<p>{siteId}</p>
<slot />
