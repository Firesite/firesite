<script context="module">
  export async function preload({params}, session) {
    const siteId = params.site_id;
    const deployId = params.deploy_id;

    return { siteId, deployId }
  }
</script>

<script>
  export let siteId, deployId;
</script>

<p>{siteId}: {deployId}</p>
<slot />
