/* 浩涛工作室 · 全站脚本：主题切换 / 导航 / 渐显 / 首页行情线 */
(function () {
  "use strict";

  /* ---------- 主题 ---------- */
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("ht-theme", t); } catch (e) {}
    var btn = document.querySelector(".theme-btn");
    if (btn) { btn.setAttribute("aria-label", t === "dark" ? "切换到亮色主题" : "切换到暗色主题"); }
  }
  setTheme(root.getAttribute("data-theme") || "dark");
  var tbtn = document.querySelector(".theme-btn");
  if (tbtn) {
    tbtn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 页脚年份 ---------- */
  var yearEl = document.getElementById("y");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 移动端导航 ---------- */
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var links = document.querySelector(".nav-links");
      links.classList.toggle("open");
      burger.setAttribute("aria-expanded", links.classList.contains("open"));
    });
  }

  /* ---------- 滚动渐显 ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 首页：行情脉搏线（签名元素，虚构行情） ---------- */
  var chart = document.getElementById("pulseChart");
  if (chart && !reduceMotion) {
    var ctx = chart.getContext("2d");
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pts = [], MAX = 160, val = 50, vel = 0.6;

    function colors() {
      var s = getComputedStyle(root);
      return {
        brand: s.getPropertyValue("--brand").trim() || "#2dd4bf",
        gold: s.getPropertyValue("--gold").trim() || "#f0b35c",
        up: s.getPropertyValue("--up").trim(),
        down: s.getPropertyValue("--down").trim(),
        line: s.getPropertyValue("--line").trim()
      };
    }
    function seed() { for (var i = 0; i < MAX; i++) step(); }
    function step() {
      vel += (Math.random() - 0.5) * 0.55;
      vel = Math.max(-2.2, Math.min(2.2, vel * 0.92));
      val += vel;
      if (val < 14) { val = 14; vel = Math.abs(vel) * 0.7; }
      if (val > 86) { val = 86; vel = -Math.abs(vel) * 0.7; }
      pts.push(val);
      if (pts.length > MAX) pts.shift();
    }
    function resize() {
      var r = chart.getBoundingClientRect();
      W = r.width; H = r.height;
      chart.width = W * dpr; chart.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      var c = colors();
      ctx.clearRect(0, 0, W, H);
      // 横向刻度线
      ctx.strokeStyle = c.line; ctx.lineWidth = 1;
      for (var g = 1; g <= 3; g++) {
        var gy = (H / 4) * g;
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      // 面积
      var step = W / (MAX - 1);
      var y = function (v) { return H - (v / 100) * (H - 22) - 11; };
      var grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, c.brand); grad.addColorStop(1, c.gold);
      var linePath = new Path2D();
      pts.forEach(function (v, i) { i ? linePath.lineTo(i * step, y(v)) : linePath.moveTo(0, y(v)); });
      var fillG = ctx.createLinearGradient(0, 0, 0, H);
      fillG.addColorStop(0, c.brand + "33");
      fillG.addColorStop(1, "transparent");
      ctx.fillStyle = fillG;
      ctx.save();
      ctx.beginPath();
      // 填充闭合
      ctx.moveTo(0, y(pts[0]));
      pts.forEach(function (v, i) { ctx.lineTo(i * step, y(v)); });
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = fillG; ctx.fill();
      ctx.restore();
      // 线条（渐变描边）
      ctx.save();
      ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.strokeStyle = grad;
      ctx.shadowColor = c.brand + "55"; ctx.shadowBlur = 8;
      ctx.stroke(linePath);
      ctx.restore();
      // 端点
      var last = pts[pts.length - 1];
      var lx = (pts.length - 1) * step, ly = y(last);
      var isUp = vel >= 0;
      ctx.beginPath(); ctx.arc(lx, ly, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = isUp ? c.up : c.down; ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ly, 7, 0, Math.PI * 2);
      ctx.strokeStyle = (isUp ? c.up : c.down) + "55"; ctx.lineWidth = 1.4; ctx.stroke();
      // 数值角标
      ctx.font = "600 12px " + getComputedStyle(root).getPropertyValue("--font");
      ctx.fillStyle = isUp ? c.up : c.down;
      ctx.fillText((isUp ? "▲ " : "▼ ") + last.toFixed(2), Math.min(lx + 10, W - 64), Math.max(ly - 10, 16));
    }
    function loop() {
      step(); draw();
      setTimeout(function () { requestAnimationFrame(loop); }, 90);
    }
    resize(); seed(); draw();
    window.addEventListener("resize", function () { resize(); draw(); });
    requestAnimationFrame(loop);
  }

  /* ---------- 首页/阅读页 ticker 数据（虚构行情） ---------- */
  var TICKS = [
    ["PYTHON", 8.42], ["AI 提示词", 9.13], ["量化研究", 7.68],
    ["压力测试", 6.91], ["文档自动化", 8.25], ["数据分析", 8.77]
  ];
  var track = document.getElementById("tickerTrack");
  if (track) {
    var html = "";
    TICKS.forEach(function (t) {
      var up = t[1] > 7.5;
      html += '<span class="tick"><span>' + t[0] + "</span><b>" + t[1].toFixed(2) +
        '</b><span class="' + (up ? "u" : "d") + '">' + (up ? "▲" : "▼") + "</span></span>";
    });
    track.innerHTML = html + html; // 两份拼接实现无缝滚动
  }

  /* ---------- 通用：小工具 ---------- */
  window.HT = Object.assign(window.HT || {}, {
    fmtDate: function (iso) {
      var d = iso.split("-");
      return d[0] + " 年 " + parseInt(d[1], 10) + " 月 " + parseInt(d[2], 10) + " 日";
    },
    esc: function (s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    },
    copyText: function (txt, btn) {
      function done() {
        if (!btn) return;
        var old = btn.textContent;
        btn.textContent = "已复制 ✓";
        setTimeout(function () { btn.textContent = old; }, 1400);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(txt).then(done, function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    }
  });
})();
