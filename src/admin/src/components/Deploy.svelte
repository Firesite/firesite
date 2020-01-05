<script>
  import { firestore } from "../firebase";
  export let site;

  const handleDeployClicked = async () => {
    const routes =
      site.pages && Array.isArray(site.pages)
        ? site.pages.map(page => {
            let content = "";
            for (const element of page.elements) {
              content += element.content.html;
            }
            const parent = page.parent || "";
            return {
              slug: page.slug,
              name: page.name,
              parent,
              content
            };
          })
        : [];

    let deploy = { routes, status: 1 };
    console.log("deploying", deploy);
    if (deploy.routes.length > 0) {
      const db = await firestore();
      await db
        .collection("sites")
        .doc(site.id)
        .collection("deploys")
        .add(deploy);
    }
  };
</script>

<button on:click={handleDeployClicked}>Deploy</button>
