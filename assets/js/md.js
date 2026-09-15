/* 极简 Markdown 渲染器：标题/列表/引用/代码块/粗体/斜体/行内代码/链接/图片/分割线 */
(function () {
  "use strict";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function safeUrl(u) {
    var t = u.trim();
    if (/^(https?:|mailto:|\/|\.\/|\?|#)/i.test(t)) return t.replace(/"/g, "%22");
    return "#";
  }

  function inline(s) {
    var out = esc(s);
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, u) {
      return '<img src="' + safeUrl(u) + '" alt="' + alt + '" loading="lazy">';
    });
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, u) {
      var ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + safeUrl(u) + '"' + ext + ">" + t + "</a>";
    });
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    return out;
  }

  window.HT = window.HT || {};
  window.HT.md = function (src) {
    var codes = [];
    var text = src.replace(/\r\n/g, "\n");
    // 先抽出围栏代码块
    text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, function (m, body) {
      codes.push({ lang: m.split("\n")[0].replace(/^```/, "").trim(), body: body });
      return "\n\u0000CODE" + (codes.length - 1) + "\u0000\n";
    });

    var lines = text.split("\n");
    var html = [], i = 0;

    function isBlank(x) { return x.trim() === "" || /^\u0000CODE\d+\u0000$/.test(x.trim()); }

    while (i < lines.length) {
      var line = lines[i];

      if (isBlank(line)) { i++; continue; }

      var cm = line.trim().match(/^\u0000CODE(\d+)\u0000$/);
      if (cm) {
        var c = codes[+cm[1]];
        html.push('<pre><code' + (c.lang ? ' class="lang-' + esc(c.lang) + '"' : "") + ">" +
          esc(c.body.replace(/\n$/, "")) + "</code></pre>");
        i++; continue;
      }

      var hm = line.match(/^(#{1,4})\s+(.*)$/);
      if (hm) {
        var lv = hm[1].length === 1 ? 2 : Math.min(hm[1].length, 4); // ## → h2，### → h3（文章主标题已是 h1）
        html.push("<h" + lv + ">" + inline(hm[2]) + "</h" + lv + ">");
        i++; continue;
      }

      if (/^(---|\*\*\*)\s*$/.test(line.trim())) { html.push("<hr>"); i++; continue; }

      if (line.trim().indexOf(">") === 0) {
        var q = [];
        while (i < lines.length && lines[i].trim().indexOf(">") === 0) {
          q.push(lines[i].trim().replace(/^>\s?/, "")); i++;
        }
        html.push("<blockquote><p>" + inline(q.join(" ")) + "</p></blockquote>");
        continue;
      }

      if (/^[-*+]\s+/.test(line.trim())) {
        var ul = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
          ul.push("<li>" + inline(lines[i].trim().replace(/^[-*+]\s+/, "")) + "</li>"); i++;
        }
        html.push("<ul>" + ul.join("") + "</ul>");
        continue;
      }

      if (/^\d+[.)]\s+/.test(line.trim())) {
        var ol = [];
        while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
          ol.push("<li>" + inline(lines[i].trim().replace(/^\d+[.)]\s+/, "")) + "</li>"); i++;
        }
        html.push("<ol>" + ol.join("") + "</ol>");
        continue;
      }

      // 普通段落：连续非空行合并
      var para = [];
      while (i < lines.length && !isBlank(lines[i]) &&
        !/^(#{1,4}\s|[-*+]\s|\d+[.)]\s|>|\u0000CODE)/.test(lines[i].trim())) {
        para.push(lines[i].trim()); i++;
      }
      html.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return html.join("\n");
  };
})();
