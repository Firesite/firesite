<script context="module">


  import { firestore } from "../../../../../../firebase";

  export async function preload({ params, query }, session) {
    const user = session.user;
    const siteId = params.site_id;
    const deployId = params.deploy_id;
    const routeName = params.route_name;

    if (!user) return;
    const { uid } = user;

    const db = await firestore();
    const siteDocumentRef = db.collection("sites").doc(siteId);
    const siteDocument = await siteDocumentRef.get();
    const site = siteDocument.data();
    const deploys = await siteDocumentRef.collection("deploys").get();
    console.log("got deploys", deploys.docs);
    site.deploys = deploys.docs.map(doc => {
      const deploy = doc.data();
      deploy.id = doc.id;
      return deploy;
    });
    return { site, siteId, deployId, routeName };
  }
</script>

<script>
  export let site, siteId, deployId, routeName;
</script>

<p>{siteId}: {deployId}: {routeName}</p>

<p>{JSON.stringify(site)}</p>
