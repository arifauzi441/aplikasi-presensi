const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close")
    });


    function previewFile(event) {
        const file = event.target.files[0];
        const fileType = file.type;
    
        // Sembunyikan semua preview sebelum menampilkan yang baru
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('pdfPreview').style.display = 'none';
        document.getElementById('videoPreview').style.display = 'none';
        document.getElementById('pptPreview').style.display = 'none';
        document.getElementById('wordPreview').style.display = 'none';
    
        // Tampilkan nama file
        const fileNameElement = document.getElementById('fileName');
        fileNameElement.textContent = file.name; // Set nama file
        fileNameElement.style.display = 'block'; // Tampilkan nama file
    
        if (fileType.startsWith('image/')) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = 'block';
        } else if (fileType === 'application/pdf') {
            const pdfPreview = document.getElementById('pdfPreview');
            pdfPreview.src = URL.createObjectURL(file);
            pdfPreview.style.display = 'block';
        } else if (fileType.startsWith('video/')) {
            const videoPreview = document.getElementById('videoPreview');
            const videoSource = document.getElementById('videoSource');
            videoSource.src = URL.createObjectURL(file);
            videoPreview.load();
            videoPreview.style.display = 'block';
        } else if (fileType === 'application/vnd.ms-powerpoint' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            const pptPreview = document.getElementById('pptPreview');
            pptPreview.href = URL.createObjectURL(file);
            pptPreview.style.display = 'block';
        } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const wordPreview = document.getElementById('wordPreview');
            wordPreview.href = URL.createObjectURL(file);
            wordPreview.style.display = 'block';
        }
    }
    