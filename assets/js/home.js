/* 首页：最新文章 + 提示词/作品预览 */
(function () {
  "use strict";

  function fail(fallbackId) {
    var el = document.getElementById(fallbackId);
    if (el) el.hidden = false;
  }

  fetch("data/posts.json").then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (posts) {
    posts.sort(function (a, b) { return b.date.localeCompare(a.date); });
    var top = posts.slice(0, 3);
    var box = document.getElementById("latestPosts");
    if (!box) return;
    box.innerHTML = top.map(function (p) {
      return '<a class="card" href="post.html?id=' + encodeURIComponent(p.id) + '">' +
        '<span class="arrow">→</span>' +
        '<span class="tag">' + (p.tags[0] || "随笔") + "</span>" +
        "<h3>" + p.title + "</h3>" +
        "<p>" + p.excerpt + "</p>" +
        '<span class="date">' + p.date + "</span>" +
        "</a>";
    }).join("");
  }).catch(function () {
    var box = document.getElementById("latestPosts");
    if (box && !box.children.length) box.remove();
    fail("latestPostsFallback");
  });

  fetch("data/lab.json").then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (lab) {
    var box = document.getElementById("labPreview");
    if (!box) return;
    var items = [];
    (lab.prompts || []).slice(0, 2).forEach(function (x) {
      items.push('<a class="card" href="lab.html">' +
        '<span class="tag">提示词</span>' +
        "<h3>" + x.title + "</h3>" +
        "<p>" + x.desc + "</p>" +
        '<span class="date">可一键复制</span></a>');
    });
    (lab.works || []).slice(0, 1).forEach(function (x) {
      items.push('<a class="card" href="lab.html">' +
        '<span class="tag">作品</span>' +
        "<h3>" + x.title + "</h3>" +
        "<p>" + x.desc + "</p>" +
        '<span class="date">' + (x.link ? "查看详情" : "整理中") + "</span></a>");
    });
    box.innerHTML = items.join("");
  }).catch(function () {
    var box = document.getElementById("labPreview");
    if (box && !box.children.length) box.remove();
    fail("labPreviewFallback");
  });
})();
