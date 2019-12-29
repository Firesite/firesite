<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import { auth } from "../firebase";

  const { session } = stores();

  onMount(async () => {
    const fbAuth = await auth();
    fbAuth.onAuthStateChanged(async authResponse => {
      console.log(authResponse);
      const user = authResponse;
      if (user) {
        session.update(store => {
          store.user = user;
          return store;
        });
        const idToken = await user.getIdToken();
        await signIn(idToken);
      } else {
        console.log("Signed out");
        session.update(store => {
          store.user = null;
          return store;
        });
        await signOut();
      }
    });
  });

  const generateCsrfToken = () => {
    return `csrf.${Math.random()
      .toString(36)
      .substr(2)}`;
  };

  const signIn = async idToken => {
    // Call Sign-out first so the __session cookie is cleared by the server.
    // We need to pass the CSRF token in the __session cookie as that is the
    // only cookie that Firebase Hosting Allows.

    await signOut();
    const csrfToken = generateCsrfToken();
		console.log("document", document);
		let expires = new Date();
		expires.setSeconds(expires.getSeconds() + 120);
		console.log("expires", expires);
    document.cookie = `__session=${csrfToken};path=/;expires=${expires.toUTCString()}`;
    console.log("Signing in with Cookie ", document.cookie);
    const response = await fetch("/auth/sign-in", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken, csrfToken }),
      credentials: "include"
    });
  };

  const signOut = async () => {
    await fetch("/auth/sign-out", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  };
</script>
