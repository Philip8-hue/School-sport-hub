const form = document.getElementById("adminLoginForm");
const message = document.getElementById("loginMessage");
const connectionStatus = document.getElementById("connectionStatus");
const loginButton = document.getElementById("loginButton");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

function setMessage(text, type = "error") {
  message.textContent = text;
  message.dataset.type = type;
}

async function checkConnection() {
  if (window.location.protocol === "file:") {
    connectionStatus.textContent = "Open this page through http://localhost:5000, not as a file.";
    connectionStatus.dataset.state = "error";
    return;
  }
  try {
    const response = await fetch("/api/health", { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error();
    connectionStatus.textContent = "Server connected";
    connectionStatus.dataset.state = "ready";
  } catch {
    connectionStatus.textContent = "Server unavailable. Run npm.cmd run dev, then refresh this page.";
    connectionStatus.dataset.state = "error";
  }
}

togglePassword?.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  togglePassword.setAttribute("aria-pressed", String(isPassword));
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");
  if (!form.reportValidity()) return;

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  loginButton.disabled = true;
  loginButton.innerHTML = '<span>Signing in…</span><span aria-hidden="true">→</span>';

  try {
    const response = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Sign-in failed (${response.status})`);
    }
    if (data.user?.role !== "ADMIN") {
      throw new Error("This account is valid but does not have admin access.");
    }
    setMessage("Signed in. Opening dashboard…", "success");
    window.location.assign("admin.html");
  } catch (error) {
    const messageText = error instanceof TypeError
      ? "Cannot reach the server. Start npm.cmd run dev and open this page from localhost."
      : error.message;
    setMessage(messageText || "Unable to sign in");
    loginButton.disabled = false;
    loginButton.innerHTML = '<span>Sign in to dashboard</span><span aria-hidden="true">→</span>';
  }
});

checkConnection();
