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
    endX: 0,
    endY: 0,
    rotation: 100,
    color: [6, 8, 8, 0]
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
  curve: [0, 1, 0.1, 0.9],
  duration: 5000,
  params: {
    x: (t) => t.cx.baseVal.value,
    y: (t) => t.cy.baseVal.value
  },
  end: {
    x: 0,
    y: 0
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