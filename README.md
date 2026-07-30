# 骑士巡游

静态网页小游戏，包含 `index.html`、`style.css`、`app.js`。

部署到 GitHub Pages（使用 GitHub Actions）:

1. 确保仓库默认分支为 `main`（若不是，请修改工作流中的分支名）。
2. 将本项目推送到 GitHub。
3. 工作流 `.github/workflows/deploy.yml` 会在每次推送到 `main` 时把 `index.html`、`style.css`、`app.js` 发布到 GitHub Pages。

可选配置：

- 若使用自定义域名，添加 `CNAME` 文件到仓库根目录，或在仓库设置中配置自定义域名。
- 若要防止 Jekyll 处理网站，已在仓库添加 `.nojekyll` 文件。

网站图标 (favicon):

- 将你提供的 `favicon.ico` 放在仓库根目录（与 `index.html` 同级）。工作流会一并部署该文件。
- 如果希望我把 ICO 文件直接加入仓库，请把 ICO 上传到工作区或授权我创建该文件。

注意：如果你的仓库默认分支不是 `main`，请修改 `.github/workflows/deploy.yml` 中 `push.branches` 为你的默认分支名。
