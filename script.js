const canvas = document.getElementById("myCanvas"), ctx = canvas.getContext("2d");
const previewCanvas = Object.assign(document.createElement("canvas"), {
    width: canvas.width,
    height: canvas.height,
    style: `position:absolute;
            left:${canvas.offsetLeft}px;
            top:${canvas.offsetTop}px;
            pointer-events:none;`
});
document.body.appendChild(previewCanvas);
const previewCtx = previewCanvas.getContext("2d");
let currentColor = "black", startX, startY, isDrawing = false;

document.querySelectorAll(".preview").forEach(p => {
    const c = p.getContext("2d"), s = p.dataset.shape;
    c.fillStyle = "gray"; c.beginPath();
    if (s === "square"){
        c.rect(10, 10, 30, 30);
    }
    else if (s === "circle"){
        c.arc(25, 25, 20, 0, Math.PI * 2);
    } 
    else if (s === "diamond"){
        c.moveTo(25, 5);
        c.lineTo(45, 25);
        c.lineTo(25, 45);
        c.lineTo(5, 25);
    }
    else if (s === "triangle"){
        c.moveTo(5, 45);
        c.lineTo(45, 45);
        c.lineTo(5, 5);
    }
    else if (s === "line"){
        c.rect(5, 20, 40, 7);
    } 
    c.closePath();
    c.fill();
});

document.querySelectorAll(".color-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        currentColor = btn.dataset.color;
    };
});

document.getElementById("customColorPicker").oninput = e => {
    document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
    currentColor = e.target.value;
};
const getShape = () => document.querySelector('input[name="shape"]:checked').value;

canvas.addEventListener("mousedown", e => {
  const r = canvas.getBoundingClientRect();
  startX = e.clientX - r.left;
  startY = e.clientY - r.top;
  isDrawing = true;
});

canvas.addEventListener("mouseup", e => {
  if (!isDrawing) return;
  isDrawing = false;
  const r = canvas.getBoundingClientRect();
  const endX = e.clientX - r.left, endY = e.clientY - r.top;
  const w = endX - startX, h = endY - startY;
  previewCtx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = currentColor;
  draw(ctx, getShape(), startX, startY, w, h);
});

canvas.addEventListener("mousemove", e => {
  if (!isDrawing) return;
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const w = x - startX, h = y - startY;
  previewCtx.clearRect(0, 0, canvas.width, canvas.height);
  previewCtx.fillStyle = currentColor;
  previewCtx.globalAlpha = 0.5;
  draw(previewCtx, getShape(), startX, startY, w, h);
});

function draw(c, shape, x, y, w, h) {
    c.beginPath();
    if (shape === "square"){
        c.rect(x, y, Math.min(Math.abs(w), Math.abs(h)) * Math.sign(w), Math.min(Math.abs(w), Math.abs(h)) * Math.sign(h));
    }
    else if (shape === "circle"){
        c.arc(x + w / 2, y + h / 2, Math.sqrt(w * w + h * h) / 2, 0, Math.PI * 2);
    } 
    else if (shape === "diamond"){
        c.moveTo(x + w / 2, y), c.lineTo(x + w, y + h / 2), c.lineTo(x + w / 2, y + h), c.lineTo(x, y + h / 2);
    }
    else if (shape === "triangle"){
        c.moveTo(x, y + h), c.lineTo(x + h, y + h), c.lineTo(x, y);
    } 
    else if (shape === "line") {
        c.moveTo(x, y); c.lineTo(x + w, y + h);
        c.lineWidth = 5; c.strokeStyle = currentColor; c.stroke();
        return;
    }
    c.closePath(); 
    c.fill();
}