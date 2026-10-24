import type { Language } from "./types";

const en = {
  title: "Updates", installed: "Installed", latest: "Latest release", beta: "Include Beta releases",
  check: "Check for updates", checking: "Checking…", download: "Download update", releases: "View release",
  available: "A newer version is available.", current: "No newer release on this channel.",
  failed: "Could not check for updates. Check your connection and try again.",
  hint: "Downloads open in your browser. Finish active Codex tasks before installing or closing Fame Codex.",
};
type UpdatesCopy = { [Key in keyof typeof en]: string };
const translations: Record<Language, UpdatesCopy> = {
  en,
  "zh-CN": {
    title: "更新", installed: "已安装", latest: "最新发布", beta: "包含 Beta 版本", check: "检查更新", checking: "正在检查…",
    download: "下载更新", releases: "查看发布", available: "有新版本可用。", current: "此渠道没有更新的版本。",
    failed: "无法检查更新。请检查网络连接后重试。", hint: "下载会在浏览器中打开。安装或关闭 Fame Codex 前，请先完成正在运行的 Codex 任务。",
  },
  "zh-TW": {
    title: "更新", installed: "已安裝", latest: "最新發行", beta: "包含 Beta 版本", check: "檢查更新", checking: "正在檢查…",
    download: "下載更新", releases: "檢視發行", available: "有新版本可用。", current: "此管道沒有更新的版本。",
    failed: "無法檢查更新。請檢查網路連線後重試。", hint: "下載會在瀏覽器中開啟。安裝或關閉 Fame Codex 前，請先完成正在執行的 Codex 工作。",
  },
  ja: {
    title: "アップデート", installed: "インストール済み", latest: "最新リリース", beta: "ベータ版を含める", check: "更新を確認", checking: "確認中…",
    download: "更新をダウンロード", releases: "リリースを表示", available: "新しいバージョンがあります。", current: "このチャンネルに新しいリリースはありません。",
    failed: "更新を確認できません。接続を確認して再試行してください。", hint: "ダウンロードはブラウザーで開きます。インストールや Fame Codex の終了前に、実行中の Codex タスクを完了してください。",
  },
  ko: {
    title: "업데이트", installed: "설치된 버전", latest: "최신 릴리스", beta: "베타 릴리스 포함", check: "업데이트 확인", checking: "확인 중…",
    download: "업데이트 다운로드", releases: "릴리스 보기", available: "새 버전을 사용할 수 있습니다.", current: "이 채널에 더 새로운 릴리스가 없습니다.",
    failed: "업데이트를 확인할 수 없습니다. 연결을 확인하고 다시 시도하세요.", hint: "다운로드는 브라우저에서 열립니다. 설치하거나 Fame Codex를 종료하기 전에 실행 중인 Codex 작업을 완료하세요.",
  },
};

export const updatesCopyFor = (language: Language): UpdatesCopy => translations[language];
