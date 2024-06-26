/**
 * Sketch
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

const elem = document.getElementById('canvas');
const canvas = {};
let progress, time = 0, unit = 100;

const background = '#066';
const foreground = '#fff';

const resize = () => {
  canvas.width = Math.floor(elem.clientWidth);
  canvas.height = Math.floor(elem.clientHeight);
  canvas.x = canvas.width / 2; // 中心x座標
  canvas.y = canvas.height / 2; // 中心y座標
  canvas.min = canvas.width < canvas.height ? canvas.width : canvas.height; // 短辺
  canvas.r = canvas.min / 3; // 半径
  elem.setAttribute('width', canvas.width);
  elem.setAttribute('height', canvas.height);
}

const update = () => {
  time++;
}

const clear = (ctx) => {
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawBackLine = (ctx, start, stop) => {
  if (time < start) return
  const myTime = Math.min(time - start, stop);
  const progress = canvas.min * myTime / (stop - start);

  ctx.fillStyle = foreground;
  for (let i = 0; i < myTime; i++) {
    const initX = canvas.width < canvas.height ?
      - canvas.min * 3 / 8 : canvas.width / 2 - canvas.min * 7 / 8;
    const initY = canvas.width < canvas.height ?
      canvas.height / 2 + canvas.min * 7 / 8 : canvas.min * 11 / 8;
    ctx.beginPath();
    ctx.arc(progress * i / stop + initX, -progress * i / stop + initY, canvas.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

const drawMainLogo = (ctx, start, stop) => {
  if (time < start) return
  const myTime = Math.max(stop - time, 0);
  console.log(myTime);
  const progress = canvas.r * myTime / (stop - start);

  const logo = new Image();
  logo.src = './assets/logo_aralead.svg';
  ctx.drawImage(logo, canvas.x - canvas.r / 6, canvas.y - canvas.r / 6, canvas.r / 3, canvas.r / 3);

  const maskGradient = ctx.createLinearGradient(canvas.x, canvas.y - canvas.r / 3, canvas.x, canvas.y + canvas.r / 3);
  maskGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  maskGradient.addColorStop(0.75, 'rgba(255, 255, 255, 1)');
  maskGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = maskGradient;
  ctx.fillRect(canvas.x - canvas.r / 6, canvas.y - canvas.r / 2, canvas.r / 3, progress);
}

const draw = () => {
  const ctx = elem.getContext('2d');
  
  clear(ctx);

  drawBackLine(ctx, 0, unit * 0.4);

  drawMainLogo(ctx, unit * 0.35, unit * 0.7);
}

const init = () => {
  resize();
  update();
  draw();
  window.requestAnimationFrame(init);
}

init();
