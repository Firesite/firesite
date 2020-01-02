<script>
  export let segment;
  import Logo from "./Logo.svelte";
  import { stores } from "@sapper/app";
  import UserAccount from "./UserAccount.svelte";
  const { session } = stores();
</script>

<style>
  nav {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    font-weight: 300;
    padding: 0 1em;
    align-items: center;
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
    padding: 1em 2em;
    display: grid;
    align-content: center;
  }

  a {
    text-decoration: none;
  }

  .selected::after {
    content: "A";
  }

  .Logo {
    display: flex;
    align-items: center;
  }

  .TitleText {
    font-size: 3em;
    color: #828282;
    padding-left: 0.25em;
  }
</style>

<nav>
  <div class="left">
    <ul>
      <li>
        <span class="Logo">
          <Logo height="64" />
          <a class="TitleText" class:selected={segment === undefined} href=".">
            Firesite
          </a>
        </span>
      </li>
    </ul>
  </div>
  <div class="center">
    {#if $session.user}
      <li class="BoxInsetLg">
        <a rel="prefetch" class:selected={segment === 'sites'} href="sites">
          My Sites
        </a>
      </li>
    {/if}
  </div>
  <div class="right">
    <ul>
      <li>
        <UserAccount />
      </li>
    </ul>
  </div>
</nav>
