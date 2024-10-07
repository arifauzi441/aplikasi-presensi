const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close")
    });

    document.getElementById('file-input').addEventListener('change', function() {
        const fileLabel = document.getElementById('file-label');
        const fileName = this.files[0].name;
        fileLabel.textContent = fileName; // Change label to the file name
    });

    document.querySelector(".btn.btn-success").addEventListener("click", function() {
        var form = document.querySelector(".f-kumpul");
        form.style.display = "block"; // Tampilkan form
    });

    document.querySelector(".close-form").addEventListener("click", function() {
        var form = document.querySelector(".f-kumpul");
        form.style.display = "none"; // Sembunyikan form
    });