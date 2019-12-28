<script>
  export let segment;
  import { stores } from "@sapper/app";
  import UserAccount from "./UserAccount.svelte";
  const { session } = stores();
</script>

<style>
  nav {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  nav ul {
    display: flex;
    flex-basis: row;
    list-style: none;
  }

  .left ul {
    justify-content: flex-start;
  }

  .center ul {
    justify-content: center;
  }

  .right ul {
    justify-content: flex-end;
  }

  li {
    padding: 0 0.5em;
  }

  a {
    text-decoration: none;
  }

	.selected::after {
		content: "A",
		
	}
</style>

<nav>
  <div class="left">
    <ul>
      <li>
        <a class:selected={segment === undefined} href=".">🔥 Firesite</a>
      </li>
      {#if $session.user}
        <li>
          <a rel="prefetch" class:selected={segment === 'sites'} href="sites">
            My Sites
          </a>
        </li>
      {/if}
    </ul>
  </div>
  <div class="center" />
  <div class="right">
    <ul>
      <li>
        <UserAccount />
      </li>
    </ul>
  </div>
</nav>
