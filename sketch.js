/**
 * Sketch
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

class Sketch {
  constructor(unit) {
    this.elem = document.getElementById('canvas');
    this.canvas = {};
    this.time = 0;
    this.isDrawing = true;
    this.fps = 60
    this.unit = unit || this.fps; // 1frame = 1000 / 60 ms
    // renderText()の所要時間
    document.documentElement.style.setProperty('--v', `${this.unit * 1000 / this.fps}ms`);
    // 背景色
    this.primary = '#026456';
    // 開始
    this.init();
  }

  resize() {
    this.canvas.width = Math.floor(this.elem.clientWidth) * 2;
    this.canvas.height = Math.floor(this.elem.clientHeight * 2);
    this.canvas.x = this.canvas.width / 2; // 中心x座標
    this.canvas.y = this.canvas.height / 2; // 中心y座標
    this.canvas.min = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height; // 短辺
    this.canvas.r = this.canvas.min / 3; // 半径
    this.elem.setAttribute('width', this.canvas.width);
    this.elem.setAttribute('height', this.canvas.height);
  }

  update() {
    this.time++;
  }

  clear(ctx) {
    ctx.fillStyle = this.primary;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackLine(ctx, start, stop) {
    if (this.time < start) return
    const myTime = Math.min(this.time - start, stop - start);
    const progress = this.canvas.min * myTime / (stop - start);
    const opacity = Math.ceil(100 * myTime / (stop - start));

    ctx.lineWidth = this.canvas.r * 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgb(255, 255, 255, ${opacity / 100})`;
    const initX = this.canvas.width < this.canvas.height ?
      - this.canvas.min * 3 / 8 : this.canvas.width / 2 - this.canvas.min * 7 / 8;
    const initY = this.canvas.width < this.canvas.height ?
      this.canvas.height / 2 + this.canvas.min * 7 / 8 : this.canvas.min * 11 / 8;
    ctx.beginPath();
    ctx.moveTo(initX, initY);
    ctx.lineTo(progress + initX, -progress + initY)
    ctx.stroke();
  }

  drawMainLogo(ctx, start, stop) {
    if (this.time < start) return
    const myStart1 = start;
    const myStart2 = start + (stop - start) * 2 / 6;
    const myStart3 = start + (stop - start) * 3 / 6;
    const myStart4 = start + (stop - start) * 5 / 6;
    const myTime1 = Math.min(this.time - myStart1, myStart2 - myStart1);
    const myTime2 = Math.min(this.time - myStart2, myStart3 - myStart2);
    const myTime3 = Math.min(this.time - myStart3, myStart4 - myStart3);
    const myTime4 = Math.min(this.time - myStart4, stop - myStart4);
    const initX = this.canvas.x;
    const initY = this.canvas.y - this.canvas.r / 2;
    const progress1 = this.canvas.r / 3 * myTime1 / (myStart2 - myStart1);
    const progress2 = this.canvas.r / 6 * myTime2 / (myStart3 - myStart2);
    const progress3 = this.canvas.r / 3 * myTime3 / (myStart4 - myStart3);
    const progress4 = this.canvas.r / 6 * myTime4 / (stop - myStart4);
    const progressX1 = progress1 * Math.cos(Math.PI * 4 / 3);
    const progressY1 = progress1 * Math.sin(Math.PI * 4 / 3);
    const progressX2 = progress2 * Math.sin(Math.PI * 5 / 12);
    const progressY2 = progress2 * Math.cos(Math.PI * 5 / 12);
    const progressX3 = progress3 * Math.cos(Math.PI * 4 / 3);
    const progressY3 = progress3 * Math.sin(Math.PI * 4 / 3);
    const progressX4 = progress4 * Math.sin(Math.PI * 5 / 12);
    const progressY4 = progress4 * Math.cos(Math.PI * 5 / 12);

    ctx.lineWidth = this.canvas.r / 12;
    ctx.lineCap = 'round';

    // #3
    if (this.time > myStart3) {
      ctx.strokeStyle = '#3eac7f';
      ctx.beginPath();
      ctx.moveTo(initX, initY);
      ctx.lineTo(initX - progressX3, initY - progressY3);
      ctx.stroke();
    }
    
    // #1
    if (this.time > myStart1) {
      ctx.strokeStyle = '#026456';
      ctx.beginPath();
      ctx.moveTo(initX, initY);
      ctx.lineTo(initX + progressX1, initY - progressY1);
      ctx.stroke();
    }

    // #4
    if (this.time > myStart4) {
      ctx.strokeStyle = '#3eac7f';
      ctx.beginPath();
      ctx.moveTo(initX - progressX3, initY - progressY3);
      ctx.lineTo(initX - progressX3 - progressX4, initY - progressY3 - progressY4);
      ctx.stroke();
    }
    
    // #2
    if (this.time > myStart2) {
      ctx.strokeStyle = '#026456';
      ctx.beginPath();
      ctx.moveTo(initX + progressX1, initY - progressY1);
      ctx.lineTo(initX + progressX1 + progressX2, initY - progressY1 - progressY2);
      ctx.stroke();
    }
  }

  animationEnd(elem, func) {
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

  renderText() {
    const gradientText = document.getElementById('gradientText');
    const largeTextArea = document.getElementById('largeText');
    const smallTextArea = document.getElementById('smallText');
    const largeTextImages = [];
    const smallTextImages = [];

    for (let i = 0; i < 7; i++) {
      largeTextImages[i] = new Image();
      largeTextImages[i].src = `./assets/aralead_0${i}.svg`;
      if (i < 6) {
        largeTextImages[i].classList.add('--slideIn');
      } else {
        this.animationEnd(largeTextImages[i], () => {
          largeTextImages[i].classList.add('--slideIn');
        }).then(() => {
          largeTextArea.remove();
          smallTextArea.remove();
          gradientText.classList.add('fluid');
        });
      }
      largeTextArea.appendChild(largeTextImages[i]);
    }

    for (let i = 0; i < 5; i++) {
      smallTextImages[i] = new Image();
      smallTextImages[i].src = `./assets/aralead_1${i}.svg`;
      smallTextImages[i].classList.add('--slideIn');
      smallTextArea.appendChild(smallTextImages[i]);
    }
  }

  draw() {
    const ctx = this.elem.getContext('2d');
    this.clear(ctx);
    this.drawBackLine(ctx, 0, this.unit * 0.5);
    this.drawMainLogo(ctx, this.unit * 0.5, this.unit * 1.0);

    const promise = new Promise((resolve, reject) => {
      if (this.isDrawing && this.time > this.unit * 1.0) resolve();
    });
    promise.then(() => {
      this.isDrawing = false;
      this.renderText();
    });
    return promise;
  }

  init() {
    setInterval(() => {
      this.resize();
      this.update();
      this.draw();
    }, 1000 / this.fps);
  }
}
