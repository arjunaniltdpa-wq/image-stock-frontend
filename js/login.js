const SUPABASE_URL = "https://ulntuatfxmbcvjfqfati.supabase.co";

const SUPABASE_KEY = "sb_publishable_fGYb5AfqLdlmiWjqwpy-6A_jf4OPaiy";

const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =====================
// Google Login
// =====================

const googleBtn = document.getElementById("googleLoginBtn");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const { error } =
        await supabaseClient.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              window.location.origin + "/dashboard.html"
          }
        });

      if (error) {
        alert(error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Google login failed.");
    }
  });
}

// =====================
// Email Login
// =====================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    try {
      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        alert(error.message);
        return;
      }

      console.log("Logged in:", data.user);

      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  });
}

// =====================
// Check Session
// =====================

async function checkSession() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    console.log("User logged in:", session.user.email);
  }
}

checkSession();