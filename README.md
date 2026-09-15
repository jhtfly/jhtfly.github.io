# 浩涛工作室 · jhtfly.github.io

个人主站，纯静态（HTML/CSS/JS，无框架无依赖），由 GitHub Pages 托管：https://jhtfly.github.io/

## 文件结构

```
index.html   首页（hero 行情线 + 最新文章 + 提示词/作品预览）
blog.html    文章列表        ← 数据来自 data/posts.json
post.html    文章阅读页      ← ?id=文章id，正文来自 posts/<id>.md
lab.html     实验室          ← 数据来自 data/lab.json（提示词库+作品集）
about.html   关于
contact.html 联系
assets/      共享样式与脚本
posts/       文章（Markdown）
data/        posts.json 文章目录 / lab.json 提示词与作品数据
```

## 怎么发文（网页在线方式）

1. 在 GitHub 仓库里点 `posts` 目录 → Add file → Create new file
2. 文件名取 `2026-09-16-文章标题.md` 这样的英文名（也是文章 id，建议短横线连接）
3. 用 Markdown 写正文（## 是小节标题）
4. 再编辑 `data/posts.json`，按同样格式加一条：id 要与文件名一致（不含 .md）、title、date、tags、excerpt
5. Commit 后约 1 分钟上线

本地维护则直接双击「同步更新到GitHub.bat」推送全部改动。
