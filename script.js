var y1 = 90; //координата по у, линии Х1
var y2 = 150; //координата по у, линии !Х1
var x = 0; //координата по Х, обеих линий
var x1 = x;
var scan; //развертка в секундах
var timerId; //таймер
var radios; //чекбоксы в виде массива
var scheme = new Image(); //изображение схемы
var canvas = document.getElementById("screen"); //канвас для осцилографа
var ctx = canvas.getContext("2d"); //контекст осцилографа
var onGIButton = document.getElementById("on"); //кнопка ВКЛ для ГИ
var offGIButton = document.getElementById("off"); //кнопка ВЫКЛ для ГИ
var onButtonIsActive = false;
var offButtonIsActive = true;
var r1 = document.getElementById("diode");
var frequency = null; //частота в Гц
var interval;
var T1 = 0;
var isGIOn = false;

//загрузка изображения схемы
scheme.src = "scheme.png";
scheme.addEventListener(
  "load",
  function () {
    var canvas = document.getElementById("scheme");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(scheme, 0, 0, 300, 240);
  },
  false
);
scheme.src = "scheme.png";

//отрисовка сетки осцилографа
function drawNet() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = "1";
  ctx.beginPath();
  for (i = 30; i < 300; i += 30) {
    ctx.beginPath();
    if (i == 150) ctx.lineWidth = "2";
    else ctx.lineWidth = "1";
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (i = 30; i < 240; i += 30) {
    ctx.beginPath();
    if (i == 120) ctx.lineWidth = "2";
    else ctx.lineWidth = "1";
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

drawNet();

//обработчик событий для отслеживания изменения развертки
function addEventListenerOnRadios() {
  radios = document.getElementsByName("scan");
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", getScanAndIntervalAndT);
    clearTimeout(timerId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    x = 0;
    timerId = setTimeout(drawOscillo, interval);
  }
}

addEventListenerOnRadios();

//обработчик собый при включении осцилографа
function onOscilloscope() {
  diode.style.backgroundColor = "red";
  getScanAndIntervalAndT();
  // getT();
  // console.log(T1, scan, frequency);
  ctx.lineWidth = "3";
  ctx.strokeStyle = "lime";
  timerId = setTimeout(drawOscillo, interval);
}

//обработчик событий при выключении осцилографа
function offOscilloscope() {
  diode.style.backgroundColor = "black";
  clearTimeout(timerId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  x = 0;
}

//обработчик собый при включении ГИ
onGIButton.addEventListener("click", function () {
  frequency = parseFloat(document.getElementById("frequency").value);

  if (
    offButtonIsActive &&
    frequency != NaN &&
    frequency > 0 &&
    frequency < 20
  ) {
    isGIOn = true;
    offButtonIsActive = false;
    onButtonIsActive = true;
    offGIButton.style.backgroundColor = "grey";
    offGIButton.style.color = "black";
    this.style.backgroundColor = "green";
    this.style.color = "white";
  } else {
    alert("Не корректне значення частоти!");
  }
});

//обработчик событий при выключении ГИ
offGIButton.addEventListener("click", function () {
  if (onButtonIsActive) {
    isGIOn = false;
    onButtonIsActive = false;
    offButtonIsActive = true;
    onGIButton.style.backgroundColor = "grey";
    onGIButton.style.color = "black";
    this.style.backgroundColor = "red";
    this.style.color = "white";
  }
});

//получение текущего значения развертки
function getScan() {
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      scan = parseFloat(radios[i].value);
      break;
    }
  }
  console.log(scan);
}

//расчет интревала времени дельта Т
function getInterval() {
  // interval = 100;
  interval = (scan * 1000) / 300;
  console.log(interval);
}

function getT() {
  T1 = 300 / (frequency * scan);
}

function getScanAndIntervalAndT() {
  getScan();
  getInterval();
  getT();
}

function a(x) {
  //   if (x >= x1 && x < x1 + T1 / 2) {
  //   ctx.lineTo(x1, y1);
  // } else if (x == x1 + T1 / 2) {
  //   ctx.lineTo(x1, y1);
  //   ctx.lineTo(x1, y1 - 50);
  // } else if (((x) => x1 + T1 / 2) && x < x1 + T1) {
  //   ctx.lineTo(x - T1 / 2, y1);
  //   ctx.lineTo(x - T1 / 2, y1 - 50);
  //   ctx.lineTo(x1, y1 - 50);
  // } else if (x == x1 + T1){
  ctx.lineTo(x - T1 / 2, y1);
  ctx.lineTo(x - T1 / 2, y1 - 50);
  ctx.lineTo(x - T1, y1 - 50);
  ctx.lineTo(x - T1, y1);
  ctx.stroke();
  // }
}

function notA(x) {
  ctx.lineTo(x - T1 / 2, y2);
  ctx.lineTo(x - T1 / 2, y2 + 50);
  ctx.lineTo(x - T1, y2 + 50);
  ctx.lineTo(x - T1, y2);
  ctx.stroke();
}
//
//функция отрисовки осцилограмм
var i = 0;
var drawOscillo = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  ctx.lineWidth = "3";
  ctx.strokeStyle = "lime";
  var newX1 = x1;
  var newX = x;
  ctx.beginPath();
  // ctx.moveTo(x, y1);
  var n = x1 / T1 + 1;
  while (n) {
    // if (i < 0) break;
    ctx.beginPath();
    ctx.moveTo(newX, y1);
    a(newX);
    ctx.moveTo(newX, y2);
    notA(newX);
    // ctx.stroke();
    newX -= T1;
    newX1 -= T1;
    n--;
  }
  // x1 = i;
  // x = j;
  if (x % T1 == 0 && x != 0) x1 += T1;

  // ctx.moveTo(x, y2);
  // ctx.lineTo(0, y2);
  // ctx.stroke();
  // console.log(((x) => x1 + T1 / 2) && x < x1 + T1);
  // console.log("отрисована линия" + x);
  x++;
  if (x == 301) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    x = 0;
    ctx.lineWidth = "3";
    ctx.strokeStyle = "lime";
    // clearTimeout(timerId);
    // return;
  }
  timerId = setTimeout(drawOscillo, interval);
};
