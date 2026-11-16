# Chess-study-note

繁體中文西洋棋戰術網站。每課說明一個概念，提供自製棋局、三選一練習和解答。現有騎士雙攻、絕對牽制、底線將死三課。

## 在本機開啟

用瀏覽器開啟 `docs/index.html`，或在 Git 儲存庫根目錄執行下列指令後瀏覽 `http://localhost:8000/`。

```sh
python -m http.server 8000 --directory docs
```

## 新增課程

閱讀 [AGENTS.md](AGENTS.md)，然後請 AI 依照資料欄位新增一筆課程。例如「新增『閃擊』一課，設計一個自製棋局與三選一練習，再檢查解答」。共用程式會產生卡片、課程內容與導覽。

## GitHub Pages

在公開儲存庫中保留 `AGENTS.md`、`README.md` 和 `docs/` 的相對位置。進入 **Settings → Pages**，選 **Deploy from a branch → main → /docs → Save**。部署成功後使用 Pages 頁面顯示的網址。
