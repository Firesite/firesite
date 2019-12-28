<script context="module">
  import { firestore } from "../../firebase";
  export async function preload(page, session) {
    const user = session.user;
    const { uid } = user;
    const db = await firestore();
    if (!uid) return;
    const sitesCollection = await db
      .collection("sites")
      .where("contributors", "array-contains", uid)
      .get();

    if (!sitesCollection.empty && sitesCollection.docs.length) {
      const sites = sitesCollection.docs.map(site => {
        return { id: site.id, ...site.data() };
      });
      return { sites };
    }
  }
</script>

<script>
  export let sites = [];
  import SiteCard from "../../components/SiteCard.svelte";
</script>

<style>
  .SitesContainer {
    display: grid;
    grid-template-columns: 1fr;
  }

  .SitesGrid {
    width: 100%;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    column-gap: 1em;
    row-gap: 1em;
  }
</style>

<h1>My Sites</h1>

<div class="SitesContainer">
  <div class="SitesGrid">
    {#each sites as site}
      <SiteCard {site} />
    {:else}
      <p>No Sites</p>
    {/each}
  </div>
</div>
