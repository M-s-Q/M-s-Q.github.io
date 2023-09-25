"use strict";
// 严格模式的定义不允许使用未定义的变量
var points;
var gl;
var canvas;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;

function changeDir() {
  direction *= -1;
}

window.onload = function init() {
  canvas = document.getElementById("triangle-canvas");
  // WebGLUtils.setupWebGL()函数，用以打包创建WbeGL上下文
  gl = WebGLUtils.setupWebGL(canvas, "experimental-webgl");
  if (!gl) {
    // 固定格式，判定WebGL是否能够使用
    alert("WebGL isn't available.");
  }
  var n = 64;
  var vertices = new Float32Array(n * 6 + 41 * 2);
  var angle = 0;
  var r = 0.14;
  var r2 = 0.05;
  var stepAngle = (360 / n) * (Math.PI / 180);

  var vertices = [
    0.0,
    -0.2, //0 身体
    0.5,
    -0.2,
    0.5,
    0.6,
    0.0,
    0.6,

    0.175,
    0.6, //4 脖子
    0.325,
    0.6,
    0.25,
    0.73,
  ];

  for (var i = 82; i < n * 2 + 41 * 2; i += 2) {
    vertices[i] = r * Math.cos(angle) + 0.25;
    vertices[i + 1] = r * Math.sin(angle) + 0.86;
    angle += stepAngle;
  }
  for (var i = 210; i < n * 4 + 41 * 2; i += 2) {
    vertices[i] = r2 * Math.cos(angle) - 0.4;
    vertices[i + 1] = r2 * Math.sin(angle) + 0.45;
    angle += stepAngle;
  }
  for (var i = 338; i < n * 6 + 41 * 2; i += 2) {
    vertices[i] = r2 * Math.cos(angle) + 0.88;
    vertices[i + 1] = r2 * Math.sin(angle) + 0.45;
    angle += stepAngle;
  }

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.2, 0.1, 0.1, 0.7);

  // Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  //Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Associate external shader variables with data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");

  document.getElementById("speedcon").onchange = function (event) {
    speed = 100 - event.target.value;
  };

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  // set uniform values
  theta += direction * 0.1;

  //为thetaLoc和theta赋值
  gl.uniform1f(thetaLoc, theta);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); //画矩形(身体)
  gl.drawArrays(gl.TRIANGLE_FAN, 4, 3); //脖子
  //gl.drawArrays(gl.TRIANGLE_FAN, 41, 64); //头
  gl.drawArrays(gl.TRIANGLE_FAN, 105, 64); //左手
  gl.drawArrays(gl.TRIANGLE_FAN, 169, 64); //右手

  setTimeout(function () {
    requestAnimFrame(render);
  }, speed);
}
