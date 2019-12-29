<script>
  import { stores } from "@sapper/app";
  import Login from "../components/Login.svelte";

  const { session } = stores();
</script>

<svelte:head>
  <title>Firesite</title>
</svelte:head>

<Login />