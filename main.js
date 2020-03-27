import { Animation, Vector2 } from './animation.js';

var path = document.getElementById("accept-right");
var v = Vector2(path.pathSegList[1].x, path.pathSegList[1].y);
var animation = Animation({
  target: path,
  curve: [0, 1, 0.1, 0.9],
  duration: 200,
  params: {
    end: (t) => {
      var { x, y } = t.pathSegList[1];
      return [x, y];
    },
    color: (t) => /^rgb\((\d+),(\d+),(\d+)\)$/.exec(t.style.stroke.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 5).map(e => parseFloat(e))
    // color: (t) => /^rgba\((\d+),(\d+),(\d+),(\d+(.\d+)?)\)$/.exec(t.style.stroke.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 5).map(e => parseFloat(e))
  },
  end: {
    end: {
      fn: "polyline",
      args: [-v.x, -v.y]
    },
    color: {
      fn: "linear",
      args: [6, 8, 8, 0]
    }
  },
  setters: {
    end: (t, { x, y }) => {
      t.pathSegList[1].x = x;
      t.pathSegList[1].y = y;
    },
    color: (t, c) => t.style.stroke = c
  },
  formats: {
    color: (r, g, b, a) => `rgba(${r},${g},${b},${a})`
  },
  relative: ["rotation", "end"]
});
var path2 = document.getElementById("accept-left");
var v2 = Vector2(path2.pathSegList[1].x, path2.pathSegList[1].y);
var animation2 = Animation({
  target: path2,
  curve: [.59, .56, .19, .97],
  duration: 200,
  params: {
    end: (t) => {
      var { x, y } = t.pathSegList[1];
      return [x, y];
    },
    color: (t) => /^rgb\((\d+),(\d+),(\d+)\)$/.exec(t.style.stroke.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 5).map(e => parseFloat(e))
    // color: (t) => /^rgba\((\d+),(\d+),(\d+),(\d+(.\d+)?)\)$/.exec(t.style.stroke.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 5).map(e => parseFloat(e))
  },
  end: {
    end: {
      fn: "polyline",
      args: [-v2.x, -v2.y]
    },
    color: {
      fn: "linear",
      args: [6, 8, 8, 0]
    }
  },
  setters: {
    end: (t, { x, y }) => {
      t.pathSegList[1].x = x;
      t.pathSegList[1].y = y;
    },
    color: (t, c) => t.style.stroke = c
  },
  formats: {
    color: (r, g, b, a) => `rgba(${r},${g},${b},${a})`
  },
  relative: ["rotation", "end"]
});
animation.start().then(() => {
  console.log(("fini"));
});
var circle = document.getElementById("circle");
var animation3 = Animation({
  target: circle,
  curve: [.13, .89, .56, .99],
  duration: 1000,
  params: {
    pos: (t) => [t.cx.baseVal.value, t.cy.baseVal.value],
    size: (t) => t.r.baseVal.value,
    color: (t) => /^rgb\((\d+),(\d+),(\d+)\)$/.exec(t.style.fill.replace(/\s/g, '')).filter((el, i) => i > 0 && i < 4).map(e => parseFloat(e))
  },
  end: {
    pos: {
      fn: "path",
      args: [0, 0, 3.733026, -26.694041, 20.599704, -20.03273, 9.197639, 3.63251, 6.992558, 21.16667, 18.898808, 37.41964, 7.535142, 10.28607, 43.656254, 10.01637, 66.523804, -26.45833]
    },
    size: {
      fn: "linear",
      args: [0]
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
    color: (r, g, b) => `rgb(${r},${g},${b})`
  },
  relative: ["color", "pos"]
})
animation.start().then(() => {
  path.style.visibility = "hidden";
  return animation2.start();
}).then(() => {
  path2.style.visibility = "hidden";
  animation3.start();
});