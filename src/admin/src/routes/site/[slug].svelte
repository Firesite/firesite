<script context="module">
  import { firestore } from "../../firebase";
  export async function preload({ params, query }, session) {
    const user = session.user;

    if (!user) return;
    const { uid } = user;

    const db = await firestore();
    const siteDocument = await db
      .collection("sites")
      .doc(params.slug)
      .get();
    const site = siteDocument.data();
    return { site };
  }
</script>

<script>
  export let site;
</script>

{#if site}
  <h1>{site.name}</h1>
{/if}
