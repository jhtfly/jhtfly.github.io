/* 阅读页：?id=xxx → data/posts.json 定位 → posts/<id>.md 渲染 */
(function () {
  "use strict";

  var id = new URLSearchParams(location.search).get("id") || "";
  if (!/^[\w-]+$/.test(id)) id = ""; // 防路径注入

  function fail() {
    document.getElementById("postTitle").textContent = "文章不存在";
    document.getElementById("postFallback").hidden = false;
    document.getElementById("readFoot").hidden = false;
    document.getElementById("nextLink").remove();
  }

  fetch("data/posts.json").then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (posts) {
    posts.sort(function (a, b) { return b.date.localeCompare(a.date); });
    var idx = posts.findIndex(function (p) { return p.id === id; });
    if (idx < 0) { fail(); return; }
    var p = posts[idx];

    document.title = p.title + " · 浩涛工作室";
    document.getElementById("postTitle").textContent = p.title;
    document.getElementById("postDate").textContent = HT.fmtDate(p.date);
    document.getElementById("crumb").textContent = "Post · " + (p.tags[0] || "文章");
    document.getElementById("postTags").innerHTML = (p.tags || []).map(function (t) {
      return '<span class="tag">' + t + "</span>";
    }).join("");

    return fetch("posts/" + p.id + ".md").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (mdText) {
      document.getElementById("postBody").innerHTML = HT.md(mdText);

      var foot = document.getElementById("readFoot");
      var next = posts[(idx + 1) % posts.length];
      if (next && next.id !== id) {
        document.getElementById("nextLink").textContent = "下一篇：" + next.title + " →";
        document.getElementById("nextLink").href = "post.html?id=" + encodeURIComponent(next.id);
        foot.hidden = false;
      } else {
        foot.hidden = false;
        document.getElementById("nextLink").remove();
      }
    });
  }).catch(fail);
})();
