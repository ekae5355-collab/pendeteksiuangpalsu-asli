let model;
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const result = document.getElementById("result");
const ctx = canvas.getContext("2d");

// Load model
async function loadModel() {
  try {
    model = await tf.loadLayersModel("model.json");
    document.getElementById("modelName").innerText = "Model loaded";
    document.getElementById("btnPredict").disabled = false;
  } catch (e) {
    alert("Gagal memuat model");
  }
}

document.getElementById("btnLoadModel").onclick = loadModel;

// File upload preview
fileInput.onchange = function () {
  const file = this.files[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  video.style.display = "none";
};

// Webcam
async function startWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.style.display = "block";
  preview.style.display = "none";
}

document.getElementById("btnWebcam").onclick = startWebcam;

// Prediction
async function predict() {
  ctx.drawImage(video.style.display === "block" ? video : preview, 0, 0, 224, 224);
  let imgTensor = tf.browser.fromPixels(canvas).expandDims(0).toFloat().div(255);

  const prediction = model.predict(imgTensor);
  const value = (await prediction.data())[0];

  result.innerHTML = value > 0.5 ? "💵 ASLI" : "❌ PALSU";
}

document.getElementById("btnPredict").onclick = predict;

// Clear
function clearAll() {
  preview.style.display = "none";
  video.style.display = "none";
  result.innerHTML = "";
}

document.getElementById("btnClear").onclick = clearAll;
