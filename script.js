// ====================================================================
// HAPUS DATA RUSAK (TIDAK MENGHAPUS BUKU YANG RATINGNYA 0)
// ====================================================================
function cleanLocalStorage() {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Buang data yang tidak lengkap
    books = books.filter(b =>
        b &&
        b.title &&
        b.author &&
        b.year &&
        b.image
    );

    localStorage.setItem("books", JSON.stringify(books));
}



// ====================================================================
// FUNGSI HAPUS BUKU
// ====================================================================
function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1);  
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks(); 
}



// ====================================================================
// RATING INTERAKTIF – BISA DIKLIK + TAMPIL ANGKA
// ====================================================================
function renderStarRating(bookIndex, container, currentRating) {
    container.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = "★";
        star.classList.add("star");

        if (i <= currentRating) {
            star.classList.add("active");
        }

        // Klik bintang → update rating
        star.addEventListener("click", () => {
            updateRating(bookIndex, i);
        });

        container.appendChild(star);
    }
}



// Simpan rating baru ke localStorage + update angka rating
function updateRating(index, newRating) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books[index].rating = newRating;
    localStorage.setItem("books", JSON.stringify(books));

    const ratingNumber = document.getElementById(`rating-num-${index}`);
    if (ratingNumber) {
        ratingNumber.textContent = `Rating: ${newRating}`;
    }

    renderBooks();
}



// ====================================================================
// TAMPILKAN DAFTAR BUKU DI rekomendasi.html
// ====================================================================
function renderBooks() {
    const bookList = document.getElementById("bookList");
    if (!bookList) return;

    bookList.innerHTML = "";

    const books = JSON.parse(localStorage.getItem("books")) || [];

    if (books.length === 0) {
        bookList.innerHTML = "<p class='empty'>Belum ada rekomendasi buku.</p>";
        return;
    }

    books.forEach((book, index) => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author} • ${book.year}</p>

            <div class="rating-number" id="rating-num-${index}">
                Rating: ${book.rating || 0}
            </div>

            <div class="rating" id="rating-${index}"></div>

            <button class="delete-btn" onclick="deleteBook(${index})">🗑️ Hapus</button>
        `;

        bookList.appendChild(card);

        // Render bintang rating
        const container = document.getElementById(`rating-${index}`);
        renderStarRating(index, container, book.rating || 0);
    });
}



// ====================================================================
// SIMPAN DATA BUKU DARI FORM tambah.html
// ====================================================================
function saveBook(event) {
    event.preventDefault();

    const title = document.getElementById("namaBuku").value.trim();
    const author = document.getElementById("penulis").value.trim();
    const year = document.getElementById("tahun").value.trim();
    const imageInput = document.getElementById("gambar");

    if (!title || !author || !year || !imageInput.files.length) {
        alert("Semua kolom wajib diisi!");
        return;
    }

    const defaultRating = 0;

    const reader = new FileReader();
    reader.onload = function () {
        const newBook = {
            title: title,
            author: author,
            year: year,
            image: reader.result,
            rating: defaultRating
        };

        const books = JSON.parse(localStorage.getItem("books")) || [];
        books.push(newBook);

        localStorage.setItem("books", JSON.stringify(books));

        alert("Rekomendasi buku berhasil ditambahkan!");
        window.location.href = "rekomendasi.html";
    };

    reader.readAsDataURL(imageInput.files[0]);
}




// ====================================================================
// SAAT HALAMAN DIBUKA
// ====================================================================
window.onload = function () {
    cleanLocalStorage();
    renderBooks();

    const form = document.getElementById("bookForm");
    if (form) {
        form.addEventListener("submit", saveBook);
    }
};
