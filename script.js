const imageInput = document.getElementById("imageInput");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const compressButton = document.getElementById("compressButton");
const canvas = document.getElementById("canvas");
const downloadLink = document.getElementById("downloadLink");

compressButton.addEventListener("click", () => {
    if (!imageInput.files.length) {
        alert("Please select an image file.");
        return;
    }

    const file = imageInput.files[0];
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to user-specified width/height or original size
        const targetWidth = parseInt(widthInput.value) || img.width;
        const targetHeight = parseInt(heightInput.value) || img.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the resized image on the canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Compress the image
        const compressedImage = canvas.toDataURL("image/jpeg", 0.8);

        // Show download link
        downloadLink.href = compressedImage;
        downloadLink.style.display = "block";
        downloadLink.textContent = "Download Compressed Image";
    };

    img.src = url;
});
