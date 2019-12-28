<script>
  import { stores } from "@sapper/app";
  import { auth } from "../firebase.js";
  const { session } = stores();
</script>

<style>
  .UserProfilePhoto {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    overflow: hidden;
  }

  .UserProfilePhoto img {
    width: 100%;
    height: 100%;
  }
</style>

{#if $session.user}
  <div class="UserProfilePhoto">
    <img src={$session.user.photoURL} alt="Profile Photo" />
  </div>
{/if}
