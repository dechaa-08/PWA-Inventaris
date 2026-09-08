document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ===================================== */
        /* CONFIG */
        /* ===================================== */

        const STORAGE_KEY =
            "inventarisku_data";

        const THEME_KEY =
            "inventarisku_theme";


        /* ===================================== */
        /* ELEMENT */
        /* ===================================== */

        const splash =
            document.getElementById(
                "splashScreen"
            );


        const form =
            document.getElementById(
                "inventoryForm"
            );


        const editId =
            document.getElementById(
                "editId"
            );


        const namaBarang =
            document.getElementById(
                "namaBarang"
            );


        const kodeInventaris =
            document.getElementById(
                "kodeInventaris"
            );


        const namaRuangan =
            document.getElementById(
                "namaRuangan"
            );


        const jumlahBarang =
            document.getElementById(
                "jumlahBarang"
            );


        const kondisiBarang =
            document.getElementById(
                "kondisiBarang"
            );


        const inventoryList =
            document.getElementById(
                "inventoryList"
            );


        const emptyMessage =
            document.getElementById(
                "emptyMessage"
            );


        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const filterRuangan =
            document.getElementById(
                "filterRuangan"
            );


        const filterKondisi =
            document.getElementById(
                "filterKondisi"
            );


        const cancelEdit =
            document.getElementById(
                "cancelEdit"
            );


        const formTitle =
            document.getElementById(
                "formTitle"
            );


        const saveBtnText =
            document.getElementById(
                "saveBtnText"
            );


        const displayedCount =
            document.getElementById(
                "displayedCount"
            );


        const darkModeBtn =
            document.getElementById(
                "darkModeBtn"
            );


        const themeIcon =
            document.getElementById(
                "themeIcon"
            );


        const toastContainer =
            document.getElementById(
                "toastContainer"
            );


        /* ===================================== */
        /* DATA */
        /* ===================================== */

        let inventories =
            loadData();


        /* ===================================== */
        /* SPLASH */
        /* ===================================== */

        setTimeout(
            function () {

                if (splash) {

                    splash.classList.add(
                        "hide"
                    );

                }

            },
            2200
        );


        /* ===================================== */
        /* CREATE ID */
        /* ===================================== */

        function createId() {

            return (
                Date.now()
                +
                "-"
                +
                Math.random()
                    .toString(36)
                    .slice(2, 9)
            );

        }


        /* ===================================== */
        /* LOAD DATA */
        /* ===================================== */

        function loadData() {

            try {

                const saved =
                    localStorage.getItem(
                        STORAGE_KEY
                    );


                if (!saved) {

                    return [];

                }


                const data =
                    JSON.parse(
                        saved
                    );


                if (
                    !Array.isArray(
                        data
                    )
                ) {

                    return [];

                }


                return data;

            }

            catch (error) {

                console.error(
                    "Gagal membaca data:",
                    error
                );


                return [];

            }

        }


        /* ===================================== */
        /* SAVE DATA */
        /* ===================================== */

        function saveData() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        inventories
                    )
                );


                return true;

            }

            catch (error) {

                console.error(
                    "Gagal menyimpan data:",
                    error
                );


                showToast(
                    "Data gagal disimpan.",
                    "error"
                );


                return false;

            }

        }


        /* ===================================== */
        /* ESCAPE */
        /* ===================================== */

        function escapeHTML(value) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                String(value);


            return div.innerHTML;

        }


        /* ===================================== */
        /* TOAST */
        /* ===================================== */

        function showToast(
            message,
            type = "success"
        ) {

            const toast =
                document.createElement(
                    "div"
                );


            toast.className =
                `toast ${type}`;


            let icon =
                "✅";


            if (
                type === "error"
            ) {

                icon = "❌";

            }


            if (
                type === "info"
            ) {

                icon = "ℹ️";

            }


            toast.innerHTML = `

                <span>
                    ${icon}
                </span>

                <span>
                    ${escapeHTML(message)}
                </span>

            `;


            toastContainer.appendChild(
                toast
            );


            setTimeout(
                function () {

                    toast.classList.add(
                        "hide"
                    );


                    setTimeout(
                        function () {

                            toast.remove();

                        },
                        300
                    );

                },
                2700
            );

        }


        /* ===================================== */
        /* RESET FORM */
        /* ===================================== */

        function resetForm() {

            form.reset();

            editId.value =
                "";


            formTitle.textContent =
                "Tambah Inventaris";


            saveBtnText.textContent =
                "Simpan Data";


            cancelEdit.classList.add(
                "hidden"
            );

        }


        /* ===================================== */
        /* FORM SUBMIT */
        /* ===================================== */

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nama =
                    namaBarang.value.trim();


                const kode =
                    kodeInventaris.value.trim();


                const ruangan =
                    namaRuangan.value.trim();


                const jumlah =
                    Number(
                        jumlahBarang.value
                    );


                const kondisi =
                    kondisiBarang.value;


                /* VALIDASI */

                if (
                    nama === ""
                    ||
                    kode === ""
                    ||
                    ruangan === ""
                    ||
                    !Number.isInteger(
                        jumlah
                    )
                    ||
                    jumlah < 1
                    ||
                    kondisi === ""
                ) {

                    showToast(
                        "Mohon isi semua data dengan benar.",
                        "error"
                    );


                    return;

                }


                /* DUPLIKAT KODE */

                const duplicate =
                    inventories.some(
                        function (item) {

                            return (

                                String(
                                    item.kode
                                )
                                .toLowerCase()
                                ===
                                kode.toLowerCase()

                                &&

                                String(
                                    item.id
                                )
                                !==
                                String(
                                    editId.value
                                )

                            );

                        }
                    );


                if (duplicate) {

                    showToast(
                        "Kode inventaris sudah digunakan.",
                        "error"
                    );


                    kodeInventaris.focus();


                    return;

                }


                /* EDIT */

                if (
                    editId.value !== ""
                ) {

                    const index =
                        inventories.findIndex(
                            function (item) {

                                return (
                                    String(
                                        item.id
                                    )
                                    ===
                                    String(
                                        editId.value
                                    )
                                );

                            }
                        );


                    if (
                        index === -1
                    ) {

                        showToast(
                            "Data tidak ditemukan.",
                            "error"
                        );


                        resetForm();


                        return;

                    }


                    inventories[index] = {

                        id:
                            inventories[index].id,

                        nama:
                            nama,

                        kode:
                            kode,

                        ruangan:
                            ruangan,

                        jumlah:
                            jumlah,

                        kondisi:
                            kondisi

                    };


                    saveData();


                    showToast(
                        "Data berhasil diperbarui."
                    );

                }


                /* TAMBAH */

                else {

                    inventories.push({

                        id:
                            createId(),

                        nama:
                            nama,

                        kode:
                            kode,

                        ruangan:
                            ruangan,

                        jumlah:
                            jumlah,

                        kondisi:
                            kondisi

                    });


                    saveData();


                    showToast(
                        "Data berhasil ditambahkan."
                    );

                }


                resetForm();

                renderInventory();

            }
        );


        /* ===================================== */
        /* RENDER DATA */
        /* ===================================== */

        function renderInventory() {

            inventoryList.innerHTML =
                "";


            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const room =
                filterRuangan.value;


            const condition =
                filterKondisi.value;


            const filtered =
                inventories.filter(
                    function (item) {

                        const nama =
                            String(
                                item.nama
                            )
                            .toLowerCase();


                        const kode =
                            String(
                                item.kode
                            )
                            .toLowerCase();


                        const searchMatch =

                            keyword === ""

                            ||

                            nama.includes(
                                keyword
                            )

                            ||

                            kode.includes(
                                keyword
                            );


                        const roomMatch =

                            room === ""

                            ||

                            item.ruangan
                            ===
                            room;


                        const conditionMatch =

                            condition === ""

                            ||

                            item.kondisi
                            ===
                            condition;


                        return (
                            searchMatch
                            &&
                            roomMatch
                            &&
                            conditionMatch
                        );

                    }
                );


            displayedCount.textContent =
                filtered.length;


            if (
                filtered.length === 0
            ) {

                emptyMessage.classList.remove(
                    "hidden"
                );

            }

            else {

                emptyMessage.classList.add(
                    "hidden"
                );

            }


            filtered.forEach(
                function (item) {

                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "inventory-card";


                    let conditionClass =
                        "condition-baik";


                    if (
                        item.kondisi
                        ===
                        "Rusak Ringan"
                    ) {

                        conditionClass =
                            "condition-ringan";

                    }


                    else if (
                        item.kondisi
                        ===
                        "Rusak Berat"
                    ) {

                        conditionClass =
                            "condition-berat";

                    }


                    card.innerHTML = `

                        <div class="inventory-card-top">

                            <div>

                                <h3 class="inventory-name">

                                    ${escapeHTML(
                                        item.nama
                                    )}

                                </h3>

                                <div class="inventory-code">

                                    ${escapeHTML(
                                        item.kode
                                    )}

                                </div>

                            </div>


                            <span
                                class="condition-badge ${conditionClass}"
                            >

                                ${escapeHTML(
                                    item.kondisi
                                )}

                            </span>

                        </div>


                        <div class="detail-row">

                            <span class="detail-label">
                                🏫 Ruangan
                            </span>

                            <strong class="detail-value">

                                ${escapeHTML(
                                    item.ruangan
                                )}

                            </strong>

                        </div>


                        <div class="detail-row">

                            <span class="detail-label">
                                📦 Jumlah
                            </span>

                            <strong class="detail-value">

                                ${Number(
                                    item.jumlah
                                )}
                                barang

                            </strong>

                        </div>


                        <div class="inventory-actions">


                            <button
                                type="button"
                                class="edit-button"
                                data-action="edit"
                                data-id="${escapeHTML(item.id)}"
                            >

                                ✏️ Edit

                            </button>


                            <button
                                type="button"
                                class="delete-button"
                                data-action="delete"
                                data-id="${escapeHTML(item.id)}"
                            >

                                🗑 Hapus

                            </button>


                        </div>

                    `;


                    inventoryList.appendChild(
                        card
                    );

                }
            );


            updateRoomFilter();

            updateDashboard();

            updateChart();

            updateStatActive();

        }


        /* ===================================== */
        /* BUTTON EDIT / DELETE */
        /* ===================================== */

        inventoryList.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {

                    return;

                }


                const id =
                    button.dataset.id;


                if (
                    button.dataset.action
                    ===
                    "edit"
                ) {

                    editInventory(id);

                }


                if (
                    button.dataset.action
                    ===
                    "delete"
                ) {

                    deleteInventory(id);

                }

            }
        );


        /* ===================================== */
        /* EDIT */
        /* ===================================== */

        function editInventory(id) {

            const item =
                inventories.find(
                    function (data) {

                        return (
                            String(
                                data.id
                            )
                            ===
                            String(id)
                        );

                    }
                );


            if (!item) {

                showToast(
                    "Data tidak ditemukan.",
                    "error"
                );


                return;

            }


            editId.value =
                item.id;


            namaBarang.value =
                item.nama;


            kodeInventaris.value =
                item.kode;


            namaRuangan.value =
                item.ruangan;


            jumlahBarang.value =
                item.jumlah;


            kondisiBarang.value =
                item.kondisi;


            formTitle.textContent =
                "Edit Inventaris";


            saveBtnText.textContent =
                "Simpan Perubahan";


            cancelEdit.classList.remove(
                "hidden"
            );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            setTimeout(
                function () {

                    namaBarang.focus();

                },
                300
            );

        }


        /* ===================================== */
        /* DELETE */
        /* ===================================== */

        function deleteInventory(id) {

            const item =
                inventories.find(
                    function (data) {

                        return (
                            String(
                                data.id
                            )
                            ===
                            String(id)
                        );

                    }
                );


            if (!item) {

                showToast(
                    "Data tidak ditemukan.",
                    "error"
                );


                return;

            }


            const yakin =
                window.confirm(
                    `Apakah Anda yakin ingin menghapus data "${item.nama}"?`
                );


            if (!yakin) {

                return;

            }


            inventories =
                inventories.filter(
                    function (data) {

                        return (
                            String(
                                data.id
                            )
                            !==
                            String(id)
                        );

                    }
                );


            saveData();

            renderInventory();


            showToast(
                "Data berhasil dihapus."
            );

        }


        /* ===================================== */
        /* CANCEL EDIT */
        /* ===================================== */

        cancelEdit.addEventListener(
            "click",
            function () {

                resetForm();


                showToast(
                    "Mode edit dibatalkan.",
                    "info"
                );

            }
        );


        /* ===================================== */
        /* SEARCH */
        /* ===================================== */

        searchInput.addEventListener(
            "input",
            renderInventory
        );


        /* ===================================== */
        /* FILTER */
        /* ===================================== */

        filterRuangan.addEventListener(
            "change",
            renderInventory
        );


        filterKondisi.addEventListener(
            "change",
            function () {

                renderInventory();

            }
        );


        /* ===================================== */
        /* ROOM FILTER */
        /* ===================================== */

        function updateRoomFilter() {

            const selected =
                filterRuangan.value;


            const rooms =
                [
                    ...new Set(
                        inventories
                            .map(
                                function (item) {

                                    return item.ruangan;

                                }
                            )
                            .filter(
                                function (room) {

                                    return (
                                        room
                                        &&
                                        room.trim()
                                        !==
                                        ""
                                    );

                                }
                            )
                    )
                ]
                .sort(
                    function (a, b) {

                        return a.localeCompare(
                            b,
                            "id"
                        );

                    }
                );


            filterRuangan.innerHTML = `

                <option value="">
                    Semua Ruangan
                </option>

            `;


            rooms.forEach(
                function (room) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        room;


                    option.textContent =
                        room;


                    filterRuangan.appendChild(
                        option
                    );

                }
            );


            if (
                rooms.includes(
                    selected
                )
            ) {

                filterRuangan.value =
                    selected;

            }

        }


        /* ===================================== */
        /* DASHBOARD */
        /* ===================================== */

        function updateDashboard() {

            let total =
                0;

            let baik =
                0;

            let ringan =
                0;

            let berat =
                0;


            inventories.forEach(
                function (item) {

                    const jumlah =
                        Number(
                            item.jumlah
                        )
                        || 0;


                    total +=
                        jumlah;


                    if (
                        item.kondisi
                        ===
                        "Baik"
                    ) {

                        baik +=
                            jumlah;

                    }


                    else if (
                        item.kondisi
                        ===
                        "Rusak Ringan"
                    ) {

                        ringan +=
                            jumlah;

                    }


                    else if (
                        item.kondisi
                        ===
                        "Rusak Berat"
                    ) {

                        berat +=
                            jumlah;

                    }

                }
            );


            document.getElementById(
                "totalBarang"
            ).textContent =
                total;


            document.getElementById(
                "barangBaik"
            ).textContent =
                baik;


            document.getElementById(
                "rusakRingan"
            ).textContent =
                ringan;


            document.getElementById(
                "barangRusak"
            ).textContent =
                berat;

        }


        /* ===================================== */
        /* CHART */
        /* ===================================== */

        function updateChart() {

            let baik =
                0;

            let ringan =
                0;

            let berat =
                0;


            inventories.forEach(
                function (item) {

                    const jumlah =
                        Number(
                            item.jumlah
                        )
                        || 0;


                    if (
                        item.kondisi
                        ===
                        "Baik"
                    ) {

                        baik +=
                            jumlah;

                    }


                    else if (
                        item.kondisi
                        ===
                        "Rusak Ringan"
                    ) {

                        ringan +=
                            jumlah;

                    }


                    else if (
                        item.kondisi
                        ===
                        "Rusak Berat"
                    ) {

                        berat +=
                            jumlah;

                    }

                }
            );


            document.getElementById(
                "chartBaik"
            ).textContent =
                baik;


            document.getElementById(
                "chartRingan"
            ).textContent =
                ringan;


            document.getElementById(
                "chartBerat"
            ).textContent =
                berat;


            const max =
                Math.max(
                    baik,
                    ringan,
                    berat,
                    1
                );


            document.getElementById(
                "barBaik"
            ).style.width =
                (
                    baik /
                    max *
                    100
                )
                +
                "%";


            document.getElementById(
                "barRingan"
            ).style.width =
                (
                    ringan /
                    max *
                    100
                )
                +
                "%";


            document.getElementById(
                "barBerat"
            ).style.width =
                (
                    berat /
                    max *
                    100
                )
                +
                "%";

        }


        /* ===================================== */
        /* STAT CARD CLICK */
        /* ===================================== */

        const statCards =
            document.querySelectorAll(
                ".stat-clickable"
            );


        statCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        const filter =
                            card.dataset.statFilter;


                        if (
                            filter ===
                            "all"
                        ) {

                            filterKondisi.value =
                                "";

                        }

                        else {

                            if (
                                filterKondisi.value
                                ===
                                filter
                            ) {

                                filterKondisi.value =
                                    "";

                            }

                            else {

                                filterKondisi.value =
                                    filter;

                            }

                        }


                        renderInventory();


                        setTimeout(
                            function () {

                                document
                                    .getElementById(
                                        "inventoryList"
                                    )
                                    .scrollIntoView({
                                        behavior:
                                            "smooth",
                                        block:
                                            "start"
                                    });

                            },
                            100
                        );

                    }
                );

            }
        );


        /* ===================================== */
        /* ACTIVE STAT */
        /* ===================================== */

        function updateStatActive() {

            const selected =
                filterKondisi.value;


            statCards.forEach(
                function (card) {

                    card.classList.remove(
                        "active"
                    );


                    if (
                        card.dataset.statFilter
                        ===
                        "all"
                        &&
                        selected === ""
                    ) {

                        card.classList.add(
                            "active"
                        );

                    }


                    if (
                        card.dataset.statFilter
                        ===
                        selected
                        &&
                        selected !== ""
                    ) {

                        card.classList.add(
                            "active"
                        );

                    }

                }
            );

        }


        /* ===================================== */
        /* DARK MODE */
        /* ===================================== */

        function applyTheme(theme) {

            const dark =
                theme ===
                "dark";


            document.body.classList.toggle(
                "dark",
                dark
            );


            themeIcon.textContent =
                dark
                    ? "☀️"
                    : "🌙";

        }


        const savedTheme =
            localStorage.getItem(
                THEME_KEY
            );


        applyTheme(
            savedTheme ===
            "dark"
                ? "dark"
                : "light"
        );


        darkModeBtn.addEventListener(
            "click",
            function () {

                const dark =
                    document.body.classList.contains(
                        "dark"
                    );


                const theme =
                    dark
                        ? "light"
                        : "dark";


                applyTheme(
                    theme
                );


                localStorage.setItem(
                    THEME_KEY,
                    theme
                );


                showToast(
                    theme === "dark"
                        ? "Dark mode aktif."
                        : "Mode terang aktif.",
                    "info"
                );

            }
        );


        /* ===================================== */
        /* EXPORT */
        /* ===================================== */

        document.getElementById(
            "exportBtn"
        ).addEventListener(
            "click",
            function () {

                if (
                    inventories.length
                    ===
                    0
                ) {

                    showToast(
                        "Belum ada data untuk diexport.",
                        "error"
                    );


                    return;

                }


                try {

                    const json =
                        JSON.stringify(
                            inventories,
                            null,
                            2
                        );


                    const blob =
                        new Blob(
                            [json],
                            {
                                type:
                                    "application/json"
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


                    link.download =
                        "inventarisku-backup.json";


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    link.remove();


                    setTimeout(
                        function () {

                            URL.revokeObjectURL(
                                url
                            );

                        },
                        100
                    );


                    showToast(
                        "Data berhasil diexport."
                    );

                }

                catch (error) {

                    console.error(
                        error
                    );


                    showToast(
                        "Export gagal.",
                        "error"
                    );

                }

            }
        );


        /* ===================================== */
        /* IMPORT */
        /* ===================================== */

        document.getElementById(
            "importFile"
        ).addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];


                if (!file) {

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (e) {

                        try {

                            const imported =
                                JSON.parse(
                                    e.target.result
                                );


                            if (
                                !Array.isArray(
                                    imported
                                )
                            ) {

                                throw new Error(
                                    "Format tidak valid"
                                );

                            }


                            const cleaned =
                                imported.filter(
                                    function (item) {

                                        return (

                                            item
                                            &&
                                            item.nama
                                            &&
                                            item.kode
                                            &&
                                            item.ruangan
                                            &&
                                            Number(
                                                item.jumlah
                                            ) >= 1
                                            &&
                                            [
                                                "Baik",
                                                "Rusak Ringan",
                                                "Rusak Berat"
                                            ]
                                            .includes(
                                                item.kondisi
                                            )

                                        );

                                    }
                                )
                                .map(
                                    function (item) {

                                        return {

                                            id:
                                                String(
                                                    item.id
                                                    ||
                                                    createId()
                                                ),

                                            nama:
                                                String(
                                                    item.nama
                                                )
                                                .trim(),

                                            kode:
                                                String(
                                                    item.kode
                                                )
                                                .trim(),

                                            ruangan:
                                                String(
                                                    item.ruangan
                                                )
                                                .trim(),

                                            jumlah:
                                                Number(
                                                    item.jumlah
                                                ),

                                            kondisi:
                                                item.kondisi

                                        };

                                    }
                                );


                            if (
                                cleaned.length
                                ===
                                0
                            ) {

                                throw new Error(
                                    "Tidak ada data valid."
                                );

                            }


                            const yakin =
                                window.confirm(
                                    `${cleaned.length} data ditemukan. Ganti data yang sekarang?`
                                );


                            if (!yakin) {

                                return;

                            }


                            inventories =
                                cleaned;


                            saveData();

                            renderInventory();


                            showToast(
                                "Data berhasil diimport."
                            );

                        }

                        catch (error) {

                            console.error(
                                error
                            );


                            showToast(
                                "File JSON tidak valid.",
                                "error"
                            );

                        }

                    };


                reader.readAsText(
                    file
                );


                event.target.value =
                    "";

            }
        );


        /* ===================================== */
        /* DELETE ALL */
        /* ===================================== */

        document.getElementById(
            "deleteAllBtn"
        ).addEventListener(
            "click",
            function () {

                if (
                    inventories.length
                    ===
                    0
                ) {

                    showToast(
                        "Data sudah kosong.",
                        "info"
                    );


                    return;

                }


                const yakin =
                    window.confirm(
                        "Apakah Anda yakin ingin menghapus SEMUA data inventaris?"
                    );


                if (!yakin) {

                    return;

                }


                inventories =
                    [];


                saveData();

                resetForm();

                renderInventory();


                showToast(
                    "Semua data berhasil dihapus."
                );

            }
        );


        /* ===================================== */
        /* SERVICE WORKER */
        /* ===================================== */

        if (
            "serviceWorker"
            in navigator
        ) {

            window.addEventListener(
                "load",
                function () {

                    navigator.serviceWorker
                        .register(
                            "./service-worker.js"
                        )
                        .then(
                            function (registration) {

                                console.log(
                                    "PWA aktif:",
                                    registration.scope
                                );

                            }
                        )
                        .catch(
                            function (error) {

                                console.warn(
                                    "Service Worker gagal:",
                                    error
                                );

                            }
                        );

                }
            );

        }


        /* ===================================== */
        /* INITIAL */
        /* ===================================== */

        renderInventory();

        updateDashboard();

        updateChart();

    }
);

/* =========================================
   STATISTIK DONUT CHART
========================================= */

function updateDonutStatistics() {

    let baik = 0;

    let ringan = 0;

    let berat = 0;


    /*
        Ambil data dari LocalStorage
    */

    try {

        const saved =
            localStorage.getItem(
                "inventarisku_data"
            );


        if (saved) {

            const data =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(data)
            ) {

                data.forEach(
                    function (item) {

                        const jumlah =
                            Number(
                                item.jumlah
                            ) || 0;


                        if (
                            item.kondisi
                            ===
                            "Baik"
                        ) {

                            baik +=
                                jumlah;

                        }


                        else if (
                            item.kondisi
                            ===
                            "Rusak Ringan"
                        ) {

                            ringan +=
                                jumlah;

                        }


                        else if (
                            item.kondisi
                            ===
                            "Rusak Berat"
                        ) {

                            berat +=
                                jumlah;

                        }

                    }
                );

            }

        }

    }

    catch (error) {

        console.error(
            "Gagal membaca statistik:",
            error
        );

    }


    const total =
        baik +
        ringan +
        berat;


    /* =====================================
       UPDATE ANGKA
    ===================================== */

    const totalElement =
        document.getElementById(
            "donutTotal"
        );


    const baikElement =
        document.getElementById(
            "statBaik"
        );


    const ringanElement =
        document.getElementById(
            "statRingan"
        );


    const beratElement =
        document.getElementById(
            "statBerat"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (baikElement) {

        baikElement.textContent =
            baik;

    }


    if (ringanElement) {

        ringanElement.textContent =
            ringan;

    }


    if (beratElement) {

        beratElement.textContent =
            berat;

    }


    /* =====================================
       HITUNG DONUT
    ===================================== */

    const chart =
        document.getElementById(
            "donutChart"
        );


    if (!chart) {

        return;

    }


    /*
        Kalau belum ada data
    */

    if (
        total === 0
    ) {

        chart.style.background =
            "#e5e7eb";


        return;

    }


    const baikDeg =
        (
            baik /
            total
        )
        *
        360;


    const ringanDeg =
        (
            ringan /
            total
        )
        *
        360;


    const akhirBaik =
        baikDeg;


    const akhirRingan =
        baikDeg +
        ringanDeg;


    chart.style.background =

        `
        conic-gradient(
            #22c55e 0deg ${akhirBaik}deg,
            #eab308 ${akhirBaik}deg ${akhirRingan}deg,
            #ef4444 ${akhirRingan}deg 360deg
        )
        `;

}


/* =========================================
   JALANKAN SAAT HALAMAN DIBUKA
========================================= */

updateDonutStatistics();


/* =========================================
   UPDATE OTOMATIS
========================================= */

setInterval(
    function () {

        updateDonutStatistics();

    },
    1000
);

/* =========================================
   PASSWORD LOGIN
========================================= */

const APP_PASSWORD =
    "Ardhecil123";


const passwordScreen =
    document.getElementById(
        "passwordScreen"
    );


const passwordInput =
    document.getElementById(
        "passwordInput"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const passwordError =
    document.getElementById(
        "passwordError"
    );



/* =========================================
   CEK PASSWORD
========================================= */

function checkPassword() {

    const enteredPassword =
        passwordInput.value;


    if (
        enteredPassword
        ===
        APP_PASSWORD
    ) {

        passwordError.classList.remove(
            "show"
        );


        passwordScreen.classList.add(
            "hide"
        );


        passwordInput.value =
            "";


        /*
            Notifikasi jika sistem
            toast tersedia.
        */

        if (
            typeof showToast
            ===
            "function"
        ) {

            showToast(
                "Berhasil masuk ke InventarisKu.",
                "success"
            );

        }

    }

    else {

        passwordError.classList.add(
            "show"
        );


        passwordInput.value =
            "";


        passwordInput.focus();


        /*
            Animasi kecil ketika salah.
        */

        passwordInput.animate(
            [
                {
                    transform:
                        "translateX(0)"
                },

                {
                    transform:
                        "translateX(-5px)"
                },

                {
                    transform:
                        "translateX(5px)"
                },

                {
                    transform:
                        "translateX(0)"
                }
            ],
            {
                duration:
                    250
            }
        );

    }

}



/* =========================================
   TOMBOL LOGIN
========================================= */

loginButton.addEventListener(
    "click",
    checkPassword
);



/* =========================================
   ENTER
========================================= */

passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key
            ===
            "Enter"
        ) {

            checkPassword();

        }

    }
);



/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

togglePassword.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type
            ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

        }

        else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁️";

        }

    }
);