// firebase-advanced.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const db = getFirestore(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const appDiv = document.getElementById("app");

const novelName = document.getElementById("novelName");
const novelCategory = document.getElementById("novelCategory");
const chapters = document.getElementById("chapters");
const chaptersRead = document.getElementById("chaptersRead");
const rating = document.getElementById("rating");
const link = document.getElementById("link");
const favorite = document.getElementById("favorite");
const completed = document.getElementById("completed");
const addNovelBtn = document.getElementById("addNovel");
const novelsDiv = document.getElementById("novels");
const searchBox = document.getElementById("searchBox");

let currentUser = null;

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
  await signOut(auth);
  alert("خارج شدید");
};

onAuthStateChanged(auth, user => {
  currentUser = user;
  appDiv.style.display = user ? "block" : "none";
  if (user) loadNovels();
});

addNovelBtn.onclick = async () => {
  if (!currentUser) return;
  try {
    await addDoc(collection(db, "novels"), {
      uid: currentUser.uid,
      name: novelName.value,
      category: novelCategory.value,
      chapters: Number(chapters.value),
      chaptersRead: Number(chaptersRead.value),
      rating: parseFloat(rating.value),
      link: link.value,
      favorite: favorite.checked,
      completed: completed.checked,
      created: new Date()
    });
    clearForm();
  } catch (e) {
    alert("خطا در افزودن رمان: " + e.message);
  }
};

function clearForm() {
  novelName.value = "";
  chapters.value = "";
  chaptersRead.value = "";
  rating.value = "";
  link.value = "";
  favorite.checked = false;
  completed.checked = false;
}

function loadNovels() {
  const q = query(collection(db, "novels"), where("uid", "==", currentUser.uid));
  onSnapshot(q, snapshot => {
    novelsDiv.innerHTML = "";
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      if (!data.name.toLowerCase().includes(searchBox.value.toLowerCase())) return;
      const div = document.createElement("div");
      div.className = "novel-item";
      div.innerHTML = `
        <strong>${data.name} ${data.favorite ? '⭐' : ''} ${data.completed ? '✔️' : ''}</strong>
        <div>دسته: ${data.category}</div>
        <div>کل فصل‌ها: ${data.chapters} | خوانده‌شده: ${data.chaptersRead}</div>
        ${data.rating ? `<div>امتیاز: ${data.rating}/10</div>` : ''}
        ${data.link ? `<a href="${data.link}" target="_blank">لینک مرجع</a>` : ''}
      `;
      novelsDiv.appendChild(div);
    });
  });
}

searchBox.oninput = () => {
  if (currentUser) loadNovels();
};
