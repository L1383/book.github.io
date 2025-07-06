
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmZeIOUi-M52OG0eiy5bPFHNydAoqv8hg",
  authDomain: "library-fbfe6.firebaseapp.com",
  projectId: "library-fbfe6",
  storageBucket: "library-fbfe6.appspot.com",
  messagingSenderId: "446025119683",
  appId: "1:446025119683:web:9b4db2c4af306c12a66f76",
  measurementId: "G-X13WFMTPMZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const appSection = document.getElementById("app");

signupBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("ثبت‌نام موفق بود");
  } catch (error) {
    alert("❌ ثبت‌نام ناموفق: " + error.message);
  }
};

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("ورود موفق بود");
  } catch (error) {
    alert("❌ ورود ناموفق: " + error.message);
  }
};

logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
    alert("خارج شدید");
  } catch (error) {
    alert("❌ خطا در خروج: " + error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    appSection.style.display = "block";
    renderNovels();
  } else {
    appSection.style.display = "none";
  }
});

let novels = JSON.parse(localStorage.getItem("novels")) || [];

function saveNovels() {
  localStorage.setItem("novels", JSON.stringify(novels));
}

function addNovel() {
  const name = document.getElementById('novelInput').value.trim();
  const category = document.getElementById('categoryInput').value;
  const chapters = parseInt(document.getElementById('chapterCount').value);
  const read = parseInt(document.getElementById('chaptersRead').value);
  const rating = parseFloat(document.getElementById('ratingInput').value);
  const link = document.getElementById('linkInput').value.trim();
  const favorite = document.getElementById('favoriteInput').checked;
  const completed = document.getElementById('completedInput').checked;

  if (!name) return;

  novels.push({ name, category, chapters, chaptersRead: read, rating, link, favorite, completed });
  saveNovels();
  renderNovels();
}

function renderNovels() {
  const list = document.getElementById("novelList");
  list.innerHTML = "";
  novels.forEach((novel) => {
    const item = document.createElement("div");
    item.className = "novel-item";
    item.innerHTML = `
      <strong>${novel.name}</strong> - ${novel.category}<br>
      فصل‌ها: ${novel.chapters} | خوانده: ${novel.chaptersRead}<br>
      امتیاز: ${novel.rating} | ${novel.favorite ? "⭐" : ""} ${novel.completed ? "✔️" : ""}
      <br><a href="${novel.link}" target="_blank">🌐 لینک</a>
    `;
    list.appendChild(item);
  });
}
