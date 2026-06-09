const SUPABASE_URL = "https://ulntuatfxmbcvjfqfati.supabase.co";

const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY";

const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

(async () => {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (!session) {

    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname
    );

    window.location.href = "login.html";

  }

})();