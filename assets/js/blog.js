/* 文章列表页：从 data/posts.json 渲染 */
(function () {
  "use strict";

  fetch("data/posts.json").then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (posts) {
    posts.sort(function (a, b) { return b.date.localeCompare(a.date); });
    var box = document.getElementById("postList");
    if (!box) return;
    box.innerHTML = posts.map(function (p) {
      var d = p.date.split("-");
      return '<a class="post-item" href="post.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="post-date"><b>' + parseInt(d[2], 10) + '</b>' + d[0] + "." + d[1] + "</div>" +
        "<div>" +
        "<h3>" + p.title + "</h3>" +
        '<p class="ex">' + p.excerpt + "</p>" +
        '<div class="tags">' + (p.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
        "</div></a>";
    }).join("");
  }).catch(function () {
    document.getElementById("postListFallback").hidden = false;
  });
})();
