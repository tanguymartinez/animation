import { Animation } from './animation.js';

var path = document.querySelector('svg path');
var animation = Animation({
  target: path,
  curve: [0, 1, 0.1, 0.9],
  duration: 1000,
  params: {
    endX: (t) => t.pathSegList[2].x,
    endY: (t) => t.pathSegList[2].y,
    rotation: (t) => parseFloat(/^rotate\((\d+)deg\)$/.exec(t.style.rotate || "rotate(0deg)")[1]),
    color: (t) => /^rgba\((\d+),(\d+),(\d+),(\d+(.\d+)?)\)$/.exec(t.style.stroke.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 5).map(e => parseFloat(e))
  },
  end: {
    endX: {
      fn: "linear",
      args: 0
    },
    endY: {
      fn: "linear",
      args: 0
    },
    rotation: {
      fn: "linear",
      args: 100
    },
    color: {
      fn: "linear",
      args: [6, 8, 8, 0]
    }
  },
  setters: {
    endX: (t, x) => t.pathSegList[2].x = x,
    endY: (t, y) => t.pathSegList[2].y = y,
    rotation: (t, r) => t.style.transform = r,
    color: (t, c) => t.style.stroke = c
  },
  formats: {
    rotation: r => `rotate(${r}deg)`,
    color: (r, g, b, a) => `rgba(${r},${g},${b},${a})`
  },
  relative: ["rotation"]
})
// animation.start().then(() => {
//   console.log(("fini"));
// });
var circle = document.querySelector("svg circle");
var animation2 = Animation({
  target: circle,
  curve: [.3, -0.47, .26, 1.49],
  duration: 4000,
  params: {
    pos: (t) => [t.cx.baseVal.value, t.cy.baseVal.value],
    size: (t) => t.r.baseVal.value,
    color: (t) => /^rgb\((\d+),(\d+),(\d+)\)$/.exec(t.style.fill.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 4).map(e => parseFloat(e))
  },
  end: {
    pos: {
      fn: "path",
      args: [90.67857, 30, 81.642856, 179.07143, 139.85119, 175.29167, 198.05952, 171.5119, 96.761905, 84.577379, 55.940475, 151.10119]
    },
    size: {
      fn: "steps",
      args: [0, 10, -10, 10, -10, -10, 10 - 10, 10]
    },
    color: {
      fn: "linear",
      args: [230, 119, 16]
    }
  },
  setters: {
    pos: (t, { x, y }) => {
      t.cx.baseVal.value = x;
      t.cy.baseVal.value = y;
    },
    size: (t, s) => t.r.baseVal.value = s,
    color: (t, c) => t.style.fill = c
  },
  formats: {
    rotation: r => `rotate(${r}deg)`,
    color: (r, g, b) => `rgb(${r},${g},${b})`
  },
  relative: ["color"]
})
animation.start().then(() => {
  animation2.start();
});