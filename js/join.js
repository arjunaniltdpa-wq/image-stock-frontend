const SUPABASE_URL = "https://ulntuatfxmbcvjfqfati.supabase.co";

const SUPABASE_KEY = "sb_publishable_fGYb5AfqLdlmiWjqwpy-6A_jf4OPaiy";
const { createClient } = supabase;

const supabaseClient =
  createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

// --------------------
// GOOGLE SIGNUP
// --------------------

const googleBtn =
  document.getElementById(
    "googleSignupBtn"
  );

if (googleBtn) {

  googleBtn.addEventListener(
    "click",
    async () => {

      const { error } =
        await supabaseClient.auth
          .signInWithOAuth({
            provider: "google",
            options: {
              redirectTo:
                window.location.origin +
                "/dashboard.html"
            }
          });

      if (error) {
        alert(error.message);
      }

    }
  );

}

// --------------------
// EMAIL SIGNUP
// --------------------

const signupForm =
  document.getElementById(
    "signupForm"
  );

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const firstName =
        document
          .getElementById("firstName")
          .value
          .trim();

      const lastName =
        document
          .getElementById("lastName")
          .value
          .trim();

      const username =
        document
          .getElementById("username")
          .value
          .trim();

      const email =
        document
          .getElementById("email")
          .value
          .trim();

      const password =
        document
          .getElementById("password")
          .value;

      const confirmPassword =
        document
          .getElementById("confirmPassword")
          .value;

      const terms =
        document
          .getElementById("terms")
          .checked;

      if (!terms) {
        alert(
          "Please accept Terms & Privacy Policy."
        );
        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        alert(
          "Passwords do not match."
        );
        return;
      }

      const {
        data,
        error
      } =
        await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name:
                firstName,
              last_name:
                lastName,
              username:
                username
            }
          }
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Account created successfully! Please check your email verification link."
      );

      window.location.href =
        "login.html";

    }
  );

}