/* 实验室页：提示词库（可复制）+ 作品集 */
(function () {
  "use strict";

  fetch("data/lab.json").then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (lab) {
    var pg = document.getElementById("promptGrid");
    var wg = document.getElementById("workGrid");
    if (!pg || !wg) return;

    var prompts = lab.prompts || [];
    var works = lab.works || [];
    document.getElementById("promptCount").textContent =
      "共 " + prompts.length + " 条 · 点击卡片复制";

    pg.innerHTML = prompts.map(function (x, i) {
      return '<div class="card" style="position:relative">' +
        '<button class="copy-btn" data-i="' + i + '" type="button">复制</button>' +
        '<span class="tag">' + (x.scene || "通用") + "</span>" +
        "<h3>" + x.title + "</h3>" +
        "<p>" + x.desc + "</p>" +
        '<pre class="prompt-body">' + HT.esc(x.body) + "</pre>" +
        "</div>";
    }).join("");

    wg.innerHTML = works.map(function (x) {
      var inner =
        '<span class="tag">' + (x.type || "作品") + "</span>" +
        "<h3>" + x.title + "</h3>" +
        "<p>" + x.desc + "</p>" +
        '<span class="date">' + (x.link ? "访问 →" : "整理中") + "</span>";
      return x.link
        ? '<a class="card" href="' + x.link + '" target="_blank" rel="noopener">' + inner + "</a>"
        : '<div class="card">' + inner + "</div>";
    }).join("");

    pg.addEventListener("click", function (e) {
      var btn = e.target.closest(".copy-btn");
      if (!btn) return;
      HT.copyText(prompts[+btn.dataset.i].body, btn);
    });
  }).catch(function () {
    document.getElementById("labFallback").hidden = false;
  });
})();
