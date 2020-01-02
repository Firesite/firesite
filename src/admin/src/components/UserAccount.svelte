<script>
  import { stores } from "@sapper/app";
  import { auth } from "../firebase.js";
  const { session } = stores();
</script>

<style>
  .UserProfilePhoto {
    height: 36px;
    width: 36px;
    padding: 0;
    overflow: hidden;
  }

  .UserProfilePhoto img {
    width: 100%;
    height: 100%;
  }
</style>

{#if $session.user}
  <div class="UserProfilePhoto BoxLg">
    <img src={$session.user.photoURL} alt="Profile Photo" />
  </div>
{/if}
