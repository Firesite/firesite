<script>
  import { site } from "../stores/site";
  import { firestore } from "../firebase";
  export let siteId;
  (async () => {
    const db = await firestore();
    if (siteId) {
      const siteDocumentRef = db.collection("sites").doc(siteId);
      const siteDocument = await siteDocumentRef.get();
      let fbSite = siteDocument.data();
      const fbDeploys = await siteDocumentRef.collection("deploys").get();
      fbSite.deploys = fbDeploys.docs.map(doc => {
        const deploy = { id: doc.id, ...doc.data() };
        return deploy;
      });
      site.set(fbSite);
    }
  })();
</script>
