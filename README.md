# book.github.io
<html lang="fa">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>bookmark</title>
  <style>
    body {
      font-family: sans-serif;
      direction: rtl;
      padding: 1rem;
      background: #f4f4f4;
    }
    .novel {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.5rem;
    }
    input, select, button {
      padding: 0.4rem;
      border-radius: 5px;
      border: 1px solid #ccc;
      width: 100%;
      margin-top: 0.3rem;
    }
    button {
      cursor: pointer;
      border: none;
      background-color: #007bff;
      color: white;
    }
    .novel-list {
      margin-top: 1rem;
    }
    .novel-item {
      background: #e8f0fe;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .actions button {
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      background-color: #6c757d;
      padding: 0.6rem 1rem;
      font-size: 1rem;
    }
    .actions button.edit {
      background-color: #6c757d;
    }
    .sort-controls {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .export-links {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }
    .export-links a {
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
    }
    .export-links a:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

  <h1>bookmark</h1>

  <div class="novel">
    <input type="text" id="novelInput" placeholder="نام رمان" />
    <select id="categoryInput">
      <option value="فانتزی">فانتزی</option>
      <option value="عاشقانه">عاشقانه</option>
      <option value="علمی‌تخیلی">علمی‌تخیلی</option>
      <option value="ماجراجویی">ماجراجویی</option>
      <option value="ترسناک">ترسناک</option>
      <option value="تاریخی">تاریخی</option>
      <option value="درام">درام</option>
      <option value="جنایی">جنایی</option>
      <option value="معمایی">معمایی</option>
      <option value="طنز">طنز</option>
    </select>
    <input type="number" id="chapterCount" placeholder="تعداد کل فصل‌ها" />
    <input type="number" id="chaptersRead" placeholder="تعداد فصل‌های خوانده‌شده" />
    <input type="number" id="ratingInput" placeholder="نمره از 10" step="0.1" />
    <input type="url" id="linkInput" placeholder="لینک مرجع" />
    <label><input type="checkbox" id="favoriteInput" /> مورد علاقه</label>
    <label><input type="checkbox" id="completedInput" /> تکمیل شده</label>
    <button onclick="addNovel()">➕ افزودن</button>
  </div>

  <div class="sort-controls">
    <label>🔽 مرتب‌سازی بر اساس:
      <select id="sortOption" onchange="renderNovels()">
        <option value="">-- انتخاب کنید --</option>
        <option value="rating">نمره</option>
        <option value="chaptersRead">تعداد فصل خوانده‌شده</option>
        <option value="name">نام</option>
        <option value="favorite">مورد علاقه</option>
        <option value="completed">تکمیل شده</option>
      </select>
    </label>
  </div>

  <div class="export-links">
    <a id="downloadJSON" href="#" download="novels.json">📁 دانلود JSON</a>
    <a id="downloadCSV" href="#" download="novels.csv">📊 دانلود CSV</a>
  </div>

  <input type="text" id="searchBox" placeholder="جستجو..." oninput="renderNovels()" style="width: 100%; padding: 0.5rem; margin-top: 1rem;" />
  <div class="novel-list" id="novelList"></div>

  <script>
    let novels = JSON.parse(localStorage.getItem('novels')) || [];

    function saveNovels() {
      localStorage.setItem('novels', JSON.stringify(novels));
    }

    function updateDownloadLinks() {
      const dataJSON = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(novels, null, 2));
      const dataCSV = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent());

      document.getElementById('downloadJSON').setAttribute('href', dataJSON);
      document.getElementById('downloadCSV').setAttribute('href', dataCSV);
    }

    function csvContent() {
      const headers = ["نام", "دسته", "کل فصل‌ها", "خوانده‌شده", "امتیاز", "لینک", "مورد علاقه", "تکمیل شده"];
      const rows = novels.map(n => [
        n.name,
        n.category,
        n.chapters,
        n.chaptersRead,
        n.rating,
        n.link,
        n.favorite ? "بله" : "خیر",
        n.completed ? "بله" : "خیر"
      ]);
      return [headers, ...rows].map(e => e.join(",")).join("\n");
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

      if (name) {
        novels.push({ name, category, chapters, chaptersRead: read || 0, rating: rating || null, link: link || '', favorite, completed });
        clearInputs();
        saveNovels();
        renderNovels();
        updateDownloadLinks();
      }
    }

    function removeNovel(index) {
      const confirmDelete = confirm('آیا مطمئن هستید که می‌خواهید این رمان را حذف کنید؟');
      if (!confirmDelete) return;
      novels.splice(index, 1);
      saveNovels();
      renderNovels();
      updateDownloadLinks();
    }

    function editNovel(index) {
      const novel = novels[index];
      const name = prompt('نام رمان:', novel.name);
      if (name === null) return;
      const chapters = prompt('تعداد کل فصل‌ها:', novel.chapters);
      const chaptersRead = prompt('تعداد فصل‌های خوانده‌شده:', novel.chaptersRead);
      const rating = prompt('امتیاز (از 10):', novel.rating);
      const link = prompt('لینک مرجع:', novel.link);
      const favorite = confirm('آیا این رمان مورد علاقه است؟');
      const completed = confirm('آیا این رمان تکمیل شده است؟');

      novels[index] = {
        name,
        category: novel.category,
        chapters: parseInt(chapters),
        chaptersRead: parseInt(chaptersRead),
        rating: parseFloat(rating),
        link,
        favorite,
        completed
      };
      saveNovels();
      renderNovels();
      updateDownloadLinks();
    }

    function clearInputs() {
      document.getElementById('novelInput').value = '';
      document.getElementById('chapterCount').value = '';
      document.getElementById('chaptersRead').value = '';
      document.getElementById('ratingInput').value = '';
      document.getElementById('linkInput').value = '';
      document.getElementById('favoriteInput').checked = false;
      document.getElementById('completedInput').checked = false;
    }

    function renderNovels() {
      const list = document.getElementById('novelList');
      const search = document.getElementById('searchBox').value.toLowerCase();
      const sortOption = document.getElementById('sortOption').value;

      let filtered = novels.filter(novel => novel.name.toLowerCase().includes(search));

      if (sortOption) {
        if (sortOption === 'name') {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'favorite') {
          filtered.sort((a, b) => (b.favorite === true) - (a.favorite === true));
        } else if (sortOption === 'completed') {
          filtered.sort((a, b) => (b.completed === true) - (a.completed === true));
        } else {
          filtered.sort((a, b) => (b[sortOption] || 0) - (a[sortOption] || 0));
        }
      }

      list.innerHTML = '';
      filtered.forEach((novel, index) => {
        const item = document.createElement('div');
        item.className = 'novel-item';
        item.innerHTML = `
          <div class="novel-header">
            <strong>${novel.name} ${novel.favorite ? '⭐' : ''} ${novel.completed ? '✔️ تکمیل‌شده' : ''}</strong>
          </div>
          <div class="category">دسته: ${novel.category} | کل: ${novel.chapters || '؟'} | خوانده: ${novel.chaptersRead || 0}</div>
          ${novel.rating !== null ? `<div class="rating">امتیاز: ${novel.rating}/10</div>` : ''}
          ${novel.link ? `<div><a href="${novel.link}" target="_blank">🌐 لینک</a></div>` : ''}
          <div class="actions">
            <button class="edit" onclick="editNovel(${index})">✏️ ویرایش</button>
            <button onclick="removeNovel(${index})">🗑️ حذف</button>
          </div>`;
        list.appendChild(item);
      });
    }

    // ابتدا لینک‌ها رو آپدیت کن
    updateDownloadLinks();
    renderNovels();
  </script>
</body>
</html>
