/**
 * Sketch
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

const elem = document.getElementById('canvas');
const canvas = {};
let time = 0;
const unit = 100;
let isDrawing = true;

const primary = '#026456';
const secondary = '#3eac7f';
const background = '#ffffff';

const resize = () => {
  canvas.width = Math.floor(elem.clientWidth) * 2;
  canvas.height = Math.floor(elem.clientHeight * 2);
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
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawBackLine = (ctx, start, stop) => {
  if (time < start) return
  const myTime = Math.min(time - start, stop - start);
  const progress = canvas.min * myTime / (stop - start);

  ctx.fillStyle = background;
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
  const myStart1 = start;
  const myStart2 = start + (stop - start) * 2 / 6;
  const myStart3 = start + (stop - start) * 3 / 6;
  const myStart4 = start + (stop - start) * 5 / 6;
  const myTime1 = Math.min(time - myStart1, myStart2 - myStart1);
  const myTime2 = Math.min(time - myStart2, myStart3 - myStart2);
  const myTime3 = Math.min(time - myStart3, myStart4 - myStart3);
  const myTime4 = Math.min(time - myStart4, stop - myStart4);
  const initX = canvas.x;
  const initY = canvas.y - canvas.r / 2;
  const progress1 = canvas.r / 3 * myTime1 / (myStart2 - myStart1);
  const progress2 = canvas.r / 6 * myTime2 / (myStart3 - myStart2);
  const progress3 = canvas.r / 3 * myTime3 / (myStart4 - myStart3);
  const progress4 = canvas.r / 6 * myTime4 / (stop - myStart4);
  const progressX1 = progress1 * Math.cos(Math.PI * 4 / 3);
  const progressY1 = progress1 * Math.sin(Math.PI * 4 / 3);
  const progressX2 = progress2 * Math.sin(Math.PI * 5 / 12);
  const progressY2 = progress2 * Math.cos(Math.PI * 5 / 12);
  const progressX3 = progress3 * Math.cos(Math.PI * 4 / 3);
  const progressY3 = progress3 * Math.sin(Math.PI * 4 / 3);
  const progressX4 = progress4 * Math.sin(Math.PI * 5 / 12);
  const progressY4 = progress4 * Math.cos(Math.PI * 5 / 12);

  ctx.lineWidth = canvas.r / 12;
  ctx.lineCap = 'round';

  // #3
  if (time > myStart3) {
    ctx.strokeStyle = '#3eac7f';
    ctx.beginPath();
    ctx.moveTo(initX, initY);
    ctx.lineTo(initX - progressX3 * myTime3 / (myStart4 - myStart3), initY - progressY3 * myTime3 / (myStart4 - myStart3));
    ctx.stroke();
  }
  
  // #1
  if (time > myStart1) {
    ctx.strokeStyle = '#026456';
    ctx.beginPath();
    ctx.moveTo(initX, initY);
    ctx.lineTo(initX + progressX1 * myTime1 / (myStart2 - myStart1), initY - progressY1 * myTime1 / (myStart2 - myStart1));
    ctx.stroke();
  }

  // #4
  if (time > myStart4) {
    ctx.strokeStyle = '#3eac7f';
    ctx.beginPath();
    ctx.moveTo(initX - progressX3, initY - progressY3);
    ctx.lineTo(initX - progressX3 - progressX4 * myTime4 / (stop - myStart4), initY - progressY3 - progressY4 * myTime4 / (stop - myStart4));
    ctx.stroke();
  }
  
  // #2
  if (time > myStart2) {
    ctx.strokeStyle = '#026456';
    ctx.beginPath();
    ctx.moveTo(initX + progressX1, initY - progressY1);
    ctx.lineTo(initX + progressX1 + progressX2 * myTime2 / (myStart3 - myStart2), initY - progressY1 - progressY2 * myTime2 / (myStart3 - myStart2));
    ctx.stroke();
  }
}

const animationEnd = (elem, func) => {
  let callback;
  const promise = new Promise((resolve, reject) => {
    callback = () => resolve(elem);
    elem.addEventListener('animationend', callback);
  });
  func();
  promise.then((elem) => {
    elem.removeEventListener('animationend', callback);
  });
  return promise;
}

const renderText = async () => {
  const gradientText = document.getElementById('gradientText');
  const largeTextArea = document.getElementById('largeText');
  const smallTextArea = document.getElementById('smallText');
  const largeTextImages = [];
  const smallTextImages = [];

  for (let i = 0; i < 7; i++) {
    largeTextImages[i] = new Image();
    largeTextImages[i].src = `./assets/aralead_0${i}.svg`;
    largeTextImages[i].classList.add('--slideIn');
    largeTextArea.appendChild(largeTextImages[i]);
  }

  for (let i = 0; i < 5; i++) {
    smallTextImages[i] = new Image();
    smallTextImages[i].src = `./assets/aralead_1${i}.svg`;
    smallTextImages[i].classList.add('--slideIn');
    smallTextArea.appendChild(smallTextImages[i]);
  }

  setTimeout(() => {
    largeTextArea.remove();
    smallTextArea.remove();
    gradientText.classList.add('fluid');
  }, 500)
}

const draw = () => {
  const ctx = elem.getContext('2d');
  clear(ctx);
  drawBackLine(ctx, 0, unit * 0.35);
  drawMainLogo(ctx, unit * 0.35, unit * 0.65);

  const promise = new Promise((resolve, reject) => {
    if (isDrawing && time > unit * 0.65) resolve();
  });
  promise.then(() => {
    isDrawing = false;
    renderText();
  });
  return promise;
}

const init = () => {
  resize();
  update();
  draw();
  window.requestAnimationFrame(init);
}

init();
