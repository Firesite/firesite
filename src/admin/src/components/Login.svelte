<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { stores } from "@sapper/app";
  import { auth } from "../firebase.js";
  const { session } = stores();

  onMount(() => {
    if (!$session.user) createSignInButton();
  });

  function createSignInButton() {
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          return false;
        }
      },
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: "<your-tos-url>",
      // Privacy policy url/callback.
      privacyPolicyUrl: function() {
        window.location.assign("<your-privacy-policy-url>");
      }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
  }

  const signOut = async () => {
    session.update(store => {
      store.user = null;
      return store;
    });
    const result = await window.firebase.auth().signOut();
    console.log(result);
    await tick();
    createSignInButton();
  };
</script>

{#if $session.user}
  <button on:click={async () => await signOut()}>Sign Out</button>
{:else}
  <div id="firebaseui-auth-container" />
{/if}
