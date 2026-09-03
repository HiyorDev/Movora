// =========================================================
// MOVORA — auth screen logic


const API_BASE = "https://movora.onrender.com";

const POSTER_COUNT = 30;
const posterWall = document.getElementById("posterWall");

function buildPosterWall() {
  const posterW = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--poster-w"),
    10
  ) || 220;
  const posterH = posterW * 1.5; // 2:3 poster aspect ratio
  const gap = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--poster-gap"),
    10
  ) || 8;

  const cols = Math.ceil(window.innerWidth / (posterW + gap)) + 1;
  const rowsPerSet = Math.ceil(window.innerHeight / (posterH + gap)) + 1;

  posterWall.innerHTML = "";
  const fragment = document.createDocumentFragment();
  let imageIndex = 0;

  for (let c = 0; c < cols; c++) {
    const col = document.createElement("div");
    col.className = "poster-col";

    const track = document.createElement("div");
    track.className = "poster-track";

    // Two identical sets back-to-back so translateY(-50%) -> translateY(0%)
    // loops with no visible seam. Speed and start offset vary per column
    // for an organic, non-mechanical cascade.
    const duration = 38 + Math.random() * 26; // 38s - 64s
    const delay = -(Math.random() * duration); // negative delay = starts mid-cycle
    track.style.animationDuration = `${duration}s`;
    track.style.animationDelay = `${delay}s`;

    // Build ONE set of image indices, then render that exact same
    // sequence twice — the two halves must be identical or the loop
    // point shows a visible jump to different posters.
    const setImageIndices = [];
    for (let r = 0; r < rowsPerSet; r++) {
      imageIndex = (imageIndex % POSTER_COUNT) + 1;
      setImageIndices.push(imageIndex);
    }

    for (let set = 0; set < 2; set++) {
      setImageIndices.forEach((idx) => {
        const tile = document.createElement("div");
        tile.className = "poster";
        tile.style.backgroundImage = `url('images/posters/movie${idx}.jpg')`;
        track.appendChild(tile);
      });
    }

    col.appendChild(track);
    fragment.appendChild(col);
  }

  posterWall.appendChild(fragment);
}

buildPosterWall();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildPosterWall, 200);
});

const authCard = document.getElementById("authCard");
const mainMenu = document.getElementById("mainMenu");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formMessage = document.getElementById("formMessage");
const welcomeText = document.getElementById("welcomeText");
const signOutBtn = document.getElementById("signOutBtn");

// ---------------------------------------------------------
// Switch between Login and Register (smooth ~300ms via CSS)
// ---------------------------------------------------------
document.getElementById("showRegister").addEventListener("click", () => {
  loginForm.hidden = true;
  registerForm.hidden = false;
  clearMessage();
});

document.getElementById("showLogin").addEventListener("click", () => {
  registerForm.hidden = true;
  loginForm.hidden = false;
  clearMessage();
});

// ---------------------------------------------------------
// Show / hide password
// ---------------------------------------------------------
document.querySelectorAll(".toggle-visibility").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const showIcon = btn.querySelector(".icon-eye");
    const hideIcon = btn.querySelector(".icon-eye-off");
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    showIcon.hidden = isHidden;
    hideIcon.hidden = !isHidden;
    btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
});

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
function setMessage(text, state) {
  formMessage.textContent = text;
  formMessage.dataset.state = state || "";
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.removeAttribute("data-state");
}

function setLoading(form, isLoading) {
  const button = form.querySelector("button[type='submit']");
  button.disabled = isLoading;
  button.dataset.originalText = button.dataset.originalText || button.textContent;
  button.textContent = isLoading ? "Please wait..." : button.dataset.originalText;
}

// ---------------------------------------------------------
// REGISTER
// ---------------------------------------------------------
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const username = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("registerConfirm").value;

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.", "error");
    return;
  }

  setLoading(registerForm, true);

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not create your account.", "error");
      return;
    }

    setMessage("Account created. Welcome to Movora!", "success");
    openMainMenu(data.username || username || email);
  } catch (error) {
    console.error(error);
    setMessage("Can't reach the server. Is the API running?", "error");
  } finally {
    setLoading(registerForm, false);
  }
});

// ---------------------------------------------------------
// LOGIN
// ---------------------------------------------------------
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  setLoading(loginForm, true);

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Incorrect email or password.", "error");
      return;
    }

    if (data.token) {
      localStorage.setItem("movora_token", data.token);
    }

    setMessage("Signed in. Enjoy the show!", "success");
    openMainMenu(data.username || email);
  } catch (error) {
    console.error(error);
    setMessage("Can't reach the server. Is the API running?", "error");
  } finally {
    setLoading(loginForm, false);
  }
});

// ---------------------------------------------------------
// Main menu — shown after a successful login or register
// ---------------------------------------------------------
function openMainMenu(name) {
  welcomeText.textContent = `Welcome, ${name}`;
  populateRow("continueTrack", 6);
  populateRow("recommendedTrack", 6);

  setTimeout(() => {
    authCard.hidden = true;
    mainMenu.hidden = false;
  }, 300);
}

function populateRow(trackId, count) {
  const track = document.getElementById(trackId);
  track.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const card = document.createElement("div");
    card.className = "menu-card";
    // Reuses the same poster assets — swap for real catalog artwork later.
    card.style.backgroundImage = `url('images/posters/movie${i}.jpg')`;
    track.appendChild(card);
  }
}

signOutBtn.addEventListener("click", () => {
  localStorage.removeItem("movora_token");
  mainMenu.hidden = true;
  authCard.hidden = false;
  loginForm.hidden = false;
  registerForm.hidden = true;
  loginForm.reset();
  registerForm.reset();
  clearMessage();
});
