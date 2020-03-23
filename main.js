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
animation.start();
var circle = document.querySelector("svg circle");
var animation2 = Animation({
  target: circle,
  curve: [0, -1, 1, 1.56],
  duration: 5000,
  params: {
    pos: (t) => [t.cx.baseVal.value, t.cy.baseVal.value]
  },
  end: {
    pos: {
      fn: "path",
      args: [90.67857, 30, 81.642856, 179.07143, 139.85119, 175.29167, 198.05952, 171.5119, 96.761905, 84.577379, 55.940475, 151.10119]
    }
  },
  setters: {
    pos: (t, { x, y }) => {
      t.cx.baseVal.value = x;
      t.cy.baseVal.value = y;
    }
  },
  formats: {
    rotation: r => `rotate(${r}deg)`,
    color: (r, g, b, a) => `rgba(${r},${g},${b},${a})`
  },
  relative: ["rotation"]
})
animation2.start();