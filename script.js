/* =========================================================
   STOCKFLOW - STOCK MANAGEMENT SYSTEM
   HTML + CSS + JAVASCRIPT
   Penyimpanan menggunakan localStorage
========================================================= */


/* =========================================================
   DATA
========================================================= */

let barang = JSON.parse(localStorage.getItem("stockflow_barang")) || [];

let transaksi = JSON.parse(localStorage.getItem("stockflow_transaksi")) || [];

let currentTransactionType = "";


/* =========================================================
   ELEMENT
========================================================= */

const barangModal = document.getElementById("barangModal");

const transactionModal =
    document.getElementById("transactionModal");

const barangForm =
    document.getElementById("barangForm");

const transactionForm =
    document.getElementById("transactionForm");

const barangTable =
    document.getElementById("barangTable");

const historyTable =
    document.getElementById("historyTable");

const emptyBarang =
    document.getElementById("emptyBarang");

const emptyHistory =
    document.getElementById("emptyHistory");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


/* =========================================================
   DATA CONTOH
   Hanya dibuat jika belum ada data
========================================================= */

if (barang.length === 0) {

    barang = [
        {
            id: generateId(),
            kode: "B001",
            nama: "Pulpen",
            kategori: "ATK",
            satuan: "pcs",
            harga: 3500,
            stok: 25
        },
        {
            id: generateId(),
            kode: "B002",
            nama: "Buku Tulis",
            kategori: "ATK",
            satuan: "pcs",
            harga: 6000,
            stok: 4
        },
        {
            id: generateId(),
            kode: "B003",
            nama: "Kertas A4",
            kategori: "ATK",
            satuan: "box",
            harga: 55000,
            stok: 12
        },
        {
            id: generateId(),
            kode: "B004",
            nama: "Tinta Printer",
            kategori: "Elektronik",
            satuan: "pcs",
            harga: 85000,
            stok: 0
        }
    ];

    saveBarang();
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateDate();

    renderDashboard();

    renderBarang();

    renderHistory();

    updateCategoryFilter();

    setupNavigation();

});


/* =========================================================
   GENERATE ID
========================================================= */

function generateId() {

    return Date.now().toString() +
        Math.random().toString(36).substring(2, 8);

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveBarang() {

    localStorage.setItem(
        "stockflow_barang",
        JSON.stringify(barang)
    );

}


function saveTransaksi() {

    localStorage.setItem(
        "stockflow_transaksi",
        JSON.stringify(transaksi)
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(".menu-link");

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const section =
                this.dataset.section;

            showSection(section);

        });

    });

}


function showSection(sectionName) {

    const sections =
        document.querySelectorAll(".content-section");

    sections.forEach(section => {

        section.classList.remove("active-section");

    });


    const target =
        document.getElementById(sectionName);

    if (target) {

        target.classList.add("active-section");

    }


    const links =
        document.querySelectorAll(".menu-link");

    links.forEach(link => {

        link.classList.remove("active");

        if (
            link.dataset.section === sectionName
        ) {

            link.classList.add("active");

        }

    });


    const titles = {

        dashboard: "Dashboard",

        barang: "Data Barang",

        transaksi: "Transaksi Stok",

        riwayat: "Riwayat Transaksi"

    };


    document.getElementById("pageTitle").textContent =
        titles[sectionName] || "Dashboard";

}


/* =========================================================
   DATE
========================================================= */

function updateDate() {

    const dateElement =
        document.getElementById("currentDate");

    const now = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    dateElement.textContent =
        now.toLocaleDateString("id-ID", options);

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const totalJenis =
        barang.length;

    const totalStok =
        barang.reduce(
            (total, item) => total + Number(item.stok),
            0
        );

    const totalMenipis =
        barang.filter(
            item => item.stok > 0 && item.stok <= 5
        ).length;

    const totalHabis =
        barang.filter(
            item => item.stok === 0
        ).length;


    document.getElementById("totalJenis").textContent =
        totalJenis;

    document.getElementById("totalStok").textContent =
        totalStok;

    document.getElementById("totalMenipis").textContent =
        totalMenipis;

    document.getElementById("totalHabis").textContent =
        totalHabis;


    renderLowStock();

    renderRecentTransactions();

}


/* =========================================================
   LOW STOCK
========================================================= */

function renderLowStock() {

    const container =
        document.getElementById("lowStockList");

    const lowStock =
        barang.filter(
            item => item.stok > 0 && item.stok <= 5
        );


    if (lowStock.length === 0) {

        container.innerHTML = `
            <div class="empty-state" style="display:block; padding:30px 10px;">
                <div>✓</div>
                <p>Tidak ada stok yang menipis.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        lowStock.slice(0, 5).map(item => `

            <div class="low-stock-item">

                <div class="product-info">

                    <div class="product-icon">
                        📦
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(item.nama)}
                        </strong>

                        <small>
                            ${escapeHTML(item.kode)}
                        </small>

                    </div>

                </div>

                <div class="stock-number">
                    ${item.stok} ${item.satuan}
                </div>

            </div>

        `).join("");

}


/* =========================================================
   RECENT TRANSACTIONS
========================================================= */

function renderRecentTransactions() {

    const container =
        document.getElementById("recentTransactions");


    const recent =
        transaksi.slice(0, 5);


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty-state" style="display:block; padding:30px 10px;">
                <div>◷</div>
                <p>Belum ada transaksi.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        recent.map(item => `

            <div class="transaction-mini">

                <div class="transaction-mini-icon ${item.jenis}">
                    ${item.jenis === "masuk" ? "↓" : "↑"}
                </div>

                <div>

                    <strong>
                        ${escapeHTML(item.namaBarang)}
                    </strong>

                    <small>
                        ${formatDate(item.tanggal)}
                    </small>

                </div>

                <div class="transaction-amount ${item.jenis}">
                    ${item.jenis === "masuk" ? "+" : "-"}${item.jumlah}
                </div>

            </div>

        `).join("");

}


/* =========================================================
   RENDER BARANG
========================================================= */

function renderBarang() {

    const keyword =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";

    const category =
        categoryFilter
            ? categoryFilter.value
            : "";


    const filtered =
        barang.filter(item => {

            const matchKeyword =
                item.nama.toLowerCase().includes(keyword) ||
                item.kode.toLowerCase().includes(keyword);

            const matchCategory =
                category === "" ||
                item.kategori === category;

            return matchKeyword && matchCategory;

        });


    barangTable.innerHTML = "";


    if (filtered.length === 0) {

        emptyBarang.style.display = "block";

        return;

    }


    emptyBarang.style.display = "none";


    filtered.forEach(item => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(item.kode)}
                </strong>
            </td>

            <td>
                ${escapeHTML(item.nama)}
            </td>

            <td>
                ${escapeHTML(item.kategori)}
            </td>

            <td>
                ${escapeHTML(item.satuan)}
            </td>

            <td>
                ${formatRupiah(item.harga)}
            </td>

            <td>
                <strong>
                    ${item.stok}
                </strong>
            </td>

            <td>
                ${getStatusBadge(item.stok)}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-button"
                        onclick="editBarang('${item.id}')"
                        title="Edit">
                        ✎
                    </button>

                    <button
                        class="action-button delete"
                        onclick="deleteBarang('${item.id}')"
                        title="Hapus">
                        ×
                    </button>

                </div>

            </td>

        `;


        barangTable.appendChild(row);

    });

}


/* =========================================================
   STATUS STOK
========================================================= */

function getStatus(stok) {

    if (stok === 0) {

        return "habis";

    }

    if (stok <= 5) {

        return "menipis";

    }

    return "aman";

}


function getStatusBadge(stok) {

    const status =
        getStatus(stok);


    const labels = {

        aman: "AMAN",

        menipis: "MENIPIS",

        habis: "HABIS"

    };


    return `
        <span class="status-badge status-${status}">
            ${labels[status]}
        </span>
    `;

}


/* =========================================================
   MODAL BARANG
========================================================= */

function openModal() {

    barangModal.classList.add("show");

    document.getElementById("modalTitle").textContent =
        "Tambah Barang";

    barangForm.reset();

    document.getElementById("editId").value = "";

}


function closeModal() {

    barangModal.classList.remove("show");

}


/* =========================================================
   SIMPAN BARANG
========================================================= */

barangForm.addEventListener("submit", function(e) {

    e.preventDefault();


    const editId =
        document.getElementById("editId").value;


    const data = {

        kode:
            document.getElementById("kodeBarang").value
                .trim(),

        nama:
            document.getElementById("namaBarang").value
                .trim(),

        kategori:
            document.getElementById("kategoriBarang").value
                .trim(),

        satuan:
            document.getElementById("satuanBarang").value,

        harga:
            Number(
                document.getElementById("hargaBarang").value
            ),

        stok:
            Number(
                document.getElementById("stokBarang").value
            )

    };


    if (editId) {

        const index =
            barang.findIndex(
                item => item.id === editId
            );


        if (index !== -1) {

            barang[index] = {

                ...barang[index],

                ...data

            };

        }


        showToast("Barang berhasil diperbarui.");

    } else {

        const duplicate =
            barang.some(
                item =>
                    item.kode.toLowerCase() ===
                    data.kode.toLowerCase()
            );


        if (duplicate) {

            showToast(
                "Kode barang sudah digunakan.",
                true
            );

            return;

        }


        barang.push({

            id: generateId(),

            ...data

        });


        showToast("Barang berhasil ditambahkan.");

    }


    saveBarang();

    renderAll();

    closeModal();

});


/* =========================================================
   EDIT BARANG
========================================================= */

function editBarang(id) {

    const item =
        barang.find(
            item => item.id === id
        );


    if (!item) return;


    document.getElementById("modalTitle").textContent =
        "Edit Barang";


    document.getElementById("editId").value =
        item.id;

    document.getElementById("kodeBarang").value =
        item.kode;

    document.getElementById("namaBarang").value =
        item.nama;

    document.getElementById("kategoriBarang").value =
        item.kategori;

    document.getElementById("satuanBarang").value =
        item.satuan;

    document.getElementById("hargaBarang").value =
        item.harga;

    document.getElementById("stokBarang").value =
        item.stok;


    barangModal.classList.add("show");

}


/* =========================================================
   HAPUS BARANG
========================================================= */

function deleteBarang(id) {

    const item =
        barang.find(
            item => item.id === id
        );


    if (!item) return;


    const confirmDelete =
        confirm(
            `Hapus barang "${item.nama}"?`
        );


    if (!confirmDelete) return;


    barang =
        barang.filter(
            item => item.id !== id
        );


    saveBarang();

    renderAll();

    showToast("Barang berhasil dihapus.");

}


/* =========================================================
   UPDATE CATEGORY FILTER
========================================================= */

function updateCategoryFilter() {

    if (!categoryFilter) return;


    const categories =
        [...new Set(
            barang.map(
                item => item.kategori
            )
        )].sort();


    categoryFilter.innerHTML =
        `<option value="">Semua Kategori</option>`;


    categories.forEach(category => {

        categoryFilter.innerHTML += `
            <option value="${escapeHTML(category)}">
                ${escapeHTML(category)}
            </option>
        `;

    });

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderBarang
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        renderBarang
    );

}


/* =========================================================
   TRANSACTION MODAL
========================================================= */

function openTransactionModal(type) {

    if (barang.length === 0) {

        showToast(
            "Tambahkan barang terlebih dahulu.",
            true
        );

        return;

    }


    currentTransactionType = type;


    document.getElementById("transactionType").value =
        type;


    document.getElementById("transactionTitle").textContent =
        type === "masuk"
            ? "Barang Masuk"
            : "Barang Keluar";


    document.getElementById("transactionTag").textContent =
        type === "masuk"
            ? "STOCK IN"
            : "STOCK OUT";


    populateTransactionBarang();


    transactionForm.reset();


    document.getElementById("transactionType").value =
        type;


    transactionModal.classList.add("show");

}


function closeTransactionModal() {

    transactionModal.classList.remove("show");

}


/* =========================================================
   TRANSACTION BARANG DROPDOWN
========================================================= */

function populateTransactionBarang() {

    const select =
        document.getElementById("transactionBarang");


    select.innerHTML = `
        <option value="">
            Pilih barang
        </option>
    `;


    barang.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">

                ${escapeHTML(item.kode)}
                -
                ${escapeHTML(item.nama)}
                (stok: ${item.stok})

            </option>

        `;

    });

}


/* =========================================================
   SIMPAN TRANSAKSI
========================================================= */

transactionForm.addEventListener(
    "submit",
    function(e) {

        e.preventDefault();


        const type =
            document.getElementById(
                "transactionType"
            ).value;


        const barangId =
            document.getElementById(
                "transactionBarang"
            ).value;


        const jumlah =
            Number(
                document.getElementById(
                    "transactionJumlah"
                ).value
            );


        const keterangan =
            document.getElementById(
                "transactionKeterangan"
            ).value.trim();


        const item =
            barang.find(
                item => item.id === barangId
            );


        if (!item) {

            showToast(
                "Pilih barang terlebih dahulu.",
                true
            );

            return;

        }


        if (jumlah <= 0) {

            showToast(
                "Jumlah harus lebih dari 0.",
                true
            );

            return;

        }


        /* BARANG KELUAR */
        if (type === "keluar") {

            if (jumlah > item.stok) {

                showToast(
                    "Stok tidak mencukupi.",
                    true
                );

                return;

            }

            item.stok -= jumlah;

        }


        /* BARANG MASUK */
        if (type === "masuk") {

            item.stok += jumlah;

        }


        /* SIMPAN RIWAYAT */
        transaksi.unshift({

            id: generateId(),

            tanggal: new Date().toISOString(),

            barangId: item.id,

            kode: item.kode,

            namaBarang: item.nama,

            jenis: type,

            jumlah: jumlah,

            stokAkhir: item.stok,

            keterangan:
                keterangan || "-"

        });


        saveBarang();

        saveTransaksi();

        renderAll();

        closeTransactionModal();


        showToast(
            type === "masuk"
                ? "Barang berhasil ditambahkan ke stok."
                : "Barang berhasil dikeluarkan dari stok."
        );

    }
);


/* =========================================================
   RIWAYAT
========================================================= */

function renderHistory() {

    historyTable.innerHTML = "";


    if (transaksi.length === 0) {

        emptyHistory.style.display = "block";

        return;

    }


    emptyHistory.style.display = "none";


    transaksi.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${formatDate(item.tanggal)}
            </td>

            <td>
                <strong>
                    ${escapeHTML(item.kode)}
                </strong>
            </td>

            <td>
                ${escapeHTML(item.namaBarang)}
            </td>

            <td>

                <span class="status-badge ${
                    item.jenis === "masuk"
                        ? "status-aman"
                        : "status-habis"
                }">

                    ${
                        item.jenis === "masuk"
                            ? "BARANG MASUK"
                            : "BARANG KELUAR"
                    }

                </span>

            </td>

            <td>

                <strong>
                    ${
                        item.jenis === "masuk"
                            ? "+"
                            : "-"
                    }${item.jumlah}
                </strong>

            </td>

            <td>
                ${item.stokAkhir}
            </td>

            <td>
                ${escapeHTML(item.keterangan)}
            </td>

        `;


        historyTable.appendChild(row);

    });

}


/* =========================================================
   RENDER SEMUA
========================================================= */

function renderAll() {

    renderDashboard();

    renderBarang();

    renderHistory();

    updateCategoryFilter();

}


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    const d =
        new Date(date);


    return d.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message, error = false) {

    const toast =
        document.getElementById("toast");

    const icon =
        document.getElementById("toastIcon");

    const text =
        document.getElementById("toastMessage");


    text.textContent = message;

    icon.textContent =
        error ? "!" : "✓";

    icon.style.color =
        error ? "var(--red)" : "var(--green)";


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CLOSE MODAL WHEN CLICK OUTSIDE
========================================================= */

window.addEventListener("click", function(e) {

    if (e.target === barangModal) {

        closeModal();

    }


    if (e.target === transactionModal) {

        closeTransactionModal();

    }

});


/* =========================================================
   ESC CLOSE
========================================================= */

document.addEventListener("keydown", function(e) {

    if (e.key === "Escape") {

        closeModal();

        closeTransactionModal();

    }

});