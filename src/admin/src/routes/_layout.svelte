<script>
  import Nav from "../components/Nav.svelte";
  import UserObserver from "../components/UserObserver.svelte";
  export let segment;
</script>

<style>
  main {
    position: relative;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<Nav {segment} />

<UserObserver />

<main>
  <slot />
</main>
