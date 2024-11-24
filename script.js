const dropContainer = document.getElementById("dropcontainer");
const fileInput = document.getElementById("images");
const dropTitle = document.getElementById("dropTitle");
const compressBtn = document.getElementById("compressBtn");

dropContainer.addEventListener("dragover", (e) => e.preventDefault());
dropContainer.addEventListener("dragenter", () => dropContainer.classList.add("drag-active"));
dropContainer.addEventListener("dragleave", () => dropContainer.classList.remove("drag-active"));
dropContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  previewImageFile(fileInput.files[0]);
});

fileInput.addEventListener("change", (e) => {
  previewImageFile(e.target.files[0]);
});

function previewImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const previewImage = document.createElement("img");
    previewImage.src = reader.result;
    previewImage.alt = "Image Preview";

    // Remove any previous preview images
    const existingPreview = dropContainer.querySelector("img");
    if (existingPreview) existingPreview.remove();

    // Hide text and file input when image is added
    dropTitle.classList.add("hidden");
    fileInput.style.display = "none";  // Hide file input

    dropContainer.appendChild(previewImage);
  };
  reader.readAsDataURL(file);
}

compressBtn.addEventListener("click", async () => {
  const imageInput = fileInput.files[0];
  const width = parseFloat(document.getElementById("width").value) || null;
  const height = parseFloat(document.getElementById("height").value) || null;
  const unit = document.getElementById("unit").value;
  const maxSizeKB = parseFloat(document.getElementById("maxSize").value);
  const maintainRatio = document.getElementById("maintainRatio").checked;

  if (!imageInput) {
    alert("Please upload an image!");
    return;
  }

  const unitToPxFactor = { px: 1, cm: 37.8, inch: 96 };
  const finalWidth = width ? width * unitToPxFactor[unit] : null;
  const finalHeight = height ? height * unitToPxFactor[unit] : null;

  try {
    const image = await loadImage(imageInput);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let canvasWidth = image.width;
    let canvasHeight = image.height;

    if (finalWidth || finalHeight) {
      if (maintainRatio) {
        if (finalWidth) {
          canvasWidth = finalWidth;
          canvasHeight = (image.height / image.width) * canvasWidth;
        } else if (finalHeight) {
          canvasHeight = finalHeight;
          canvasWidth = (image.width / image.height) * canvasHeight;
        }
      } else {
        canvasWidth = finalWidth || image.width;
        canvasHeight = finalHeight || image.height;
      }
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    const quality = maxSizeKB ? Math.min(1, (maxSizeKB * 1024) / imageInput.size) : 1;
    const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

    // Send the data to output.html
    const outputData = { compressedDataUrl };
    sessionStorage.setItem("outputData", JSON.stringify(outputData));

    window.open("output.html", "_blank");
  } catch (error) {
    console.error("Compression failed:", error);
    alert("Compression failed. Please try again.");
  }
});

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
