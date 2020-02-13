<script>
  import { firestore } from "../firebase";
  export let site;
  let db;

  const createRoute = async (route, deploy) => {
    const pageDoc = await route.ref.get();
    const page = pageDoc.data();
    let content = "";
    if (page.elements && page.elements.length) {
      for (let element of page.elements) {
        content = `${content} ${element.content.html}`;
      }
    } else {
      content = "Empty";
    }
    deploy = { title: route.title, content };
    if (route.children) {
      deploy.children = [];
      for (let child of route.children) {
        deploy.children = [
          ...deploy.children,
          await createRoute(child, deploy)
        ];
      }
    }
    return deploy;
  };

  const handleDeployClicked = async () => {
    db = await firestore();
    let deploy = await createRoute(site.content, {});
    console.log("deploy", deploy);
  };
</script>

<button on:click={handleDeployClicked}>Deploy</button>
