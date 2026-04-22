# README_FOR_GEMINI.md
# TERRAviolin 公式サイト — Project IDX 移行ドキュメント

> このドキュメントは、Claude（Anthropic）による作業記録を Project IDX（Firebase Studio / Gemini）へ引き継ぐために作成されました。
> 作業者が途中でコンテキストを切り替えても、すべての経緯・設計思想・残タスクが把握できるように書かれています。

---

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| サイト名 | TERRAviolin Official Site |
| URL | https://terra-violin.netlify.app |
| オーナー | TERRA（ヴァイオリニスト、名古屋栄拠点） |
| ホスティング | Netlify（Netlify Drop でデプロイ） |
| 言語 | 日本語 |
| フレームワーク | **静的 HTML + CSS のみ**（JSフレームワーク不使用） |
| フォント | Caveat（タイトル）、Noto Sans JP（本文）via Google Fonts |
| カラーパレット | `--dark-navy: #2c3e6b` / `--terracotta: #c0603a` / `--text-dark: #2a2a2a` / `--light-bg: #f9f7f4` |

---

## 2. ファイル構成

```
terra-violin-fixed/          ← 作業ディレクトリ（SEO改善済み）
├── index.html               ← トップページ
├── profile.html             ← プロフィール（学歴・経歴タイムライン）
├── services.html            ← サービス（サポートヴァイオリン料金表）
├── contact.html             ← お問合せ（メール・電話・Twitter）
├── blog.html                ← SNS（Twitter タイムライン埋め込み）
├── favicon.svg              ← SVG ファビコン（テラコッタ色のV字）
├── robots.txt               ← クローラー制御
└── sitemap.xml              ← 全ページの XML サイトマップ
```

### ナビゲーション構造

```
ホーム (/) → プロフィール (/profile) → サービス (/services)
→ お問合せ (/contact) → ブログ (/blog)
```

ヘッダー右端に Twitter（@terra_violin）へのリンクアイコン常設。

---

## 3. SEO 改善の内容（Claude による作業済み）

元のサイト（Wix からエクスポートされたと思われる静的 HTML）に対して、以下の SEO 対策を実施した。

### 3-1. メタタグ整備（全ページ共通）

各ページに以下を追加・修正：

```html
<!-- 基本メタ -->
<meta name="description" content="ページ固有の説明文">
<meta name="keywords" content="TERRAviolin, ヴァイオリニスト, 名古屋, ...">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://terra-violin.netlify.app/[page]">

<!-- OGP（SNS シェア用） -->
<meta property="og:type" content="website">
<meta property="og:url" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://static.wixstatic.com/media/41d81a_30e334d47efe456f838bd2b6094b4151~mv2.jpg">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="TERRAviolin Official Site">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@terra_violin">
```

### 3-2. 構造化データ（index.html）

トップページに JSON-LD 形式の構造化データを追加：

```json
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "TERRA",
  "url": "https://terra-violin.netlify.app",
  "description": "名古屋を中心に活動するヴァイオリニスト TERRA の公式サイト",
  "sameAs": ["https://twitter.com/terra_violin"],
  "address": { "addressLocality": "名古屋市", "addressRegion": "愛知県" }
}
```

### 3-3. robots.txt

```
User-agent: *
Allow: /
Sitemap: https://terra-violin.netlify.app/sitemap.xml
```

### 3-4. sitemap.xml

全5ページ（index, profile, services, contact, blog）の URL と更新頻度を記載。

### 3-5. 画像 alt 属性・loading="lazy"

各ページの `<img>` タグに `alt` 属性と `loading="lazy"` を追加。

### 3-6. ページタイトル統一

`ページ名 | TERRAviolin Official Site` の形式に統一。

---

## 4. デプロイ状況（2026年4月22日時点）

### 現状

- ✅ SEO 改善済みファイル一式が完成（`terra-violin-seo-improved.zip`, 18,950 bytes）
- ✅ Netlify アカウントにログイン済み（violin.tkssbkw@gmail.com）
- ✅ サイト ID 確認済み：`b0235f19-119a-4794-b9bb-0ecefc28cc7b`
- ✅ 新しい PAT トークン発行済み：`nfp_68Uiz47GsVbU8tTetpNijuCn6GyyqtYjd1b3`（有効期限：2026/04/29）
- ❌ デプロイ未完了：Netlify API への POST が 503 エラーを返す

### 503 エラーの原因（推測）

Netlify Drop でのデプロイは `POST https://api.netlify.com/api/v1/sites/{site_id}/deploys` に zip バイナリを送信する方式。  
ブラウザの CORS 制限により fetch の response が読めないため詳細不明だが、以下が原因の可能性：

1. **zip ファイルの構造**：`terra-violin-fixed/` というサブディレクトリが含まれている。Netlify Drop は zip のルートを展開するため、サブディレクトリ構造だとパスが合わない可能性がある。
2. **コンテンツのサイズ/圧縮**：過去のデプロイログに「Deploy failed while extracting zip: zlib error while inflating」が記録されており、zip の圧縮形式の問題の可能性がある。
3. **レートリミット**：短時間に複数回デプロイを試みたため、一時的に制限されている可能性がある。

### 推奨デプロイ手順（Project IDX での再試行）

```bash
# 方法1: Netlify CLI でデプロイ（推奨）
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=./terra-violin-fixed --site=b0235f19-119a-4794-b9bb-0ecefc28cc7b

# 方法2: API で zip を直接アップロード
# zip をルートファイル直接（サブディレクトリなし）で再作成してから：
cd terra-violin-fixed
zip -r ../terra-violin-flat.zip .   # サブディレクトリなし
curl -H "Authorization: Bearer nfp_68Uiz47GsVbU8tTetpNijuCn6GyyqtYjd1b3" \
     -H "Content-Type: application/zip" \
     --data-binary @../terra-violin-flat.zip \
     https://api.netlify.com/api/v1/sites/b0235f19-119a-4794-b9bb-0ecefc28cc7b/deploys

# 方法3: Netlify UI から手動（最も確実）
# https://app.netlify.com/projects/terra-violin/deploys
# ページ下部のドラッグ＆ドロップゾーンにフォルダを直接ドロップ
```

---

## 5. 残タスク（優先度順）

### 🔴 最優先

1. **Netlify へのデプロイ完了**
   - 上記「推奨デプロイ手順」を参照
   - zip のルート構造を確認（サブディレクトリなしで再 zip）
   - Netlify CLI が最も確実

2. **Google Search Console 登録**
   - URL: https://search.google.com/search-console/
   - サイト URL: `https://terra-violin.netlify.app`
   - 確認方法：HTML タグ（meta タグ）を `index.html` の `<head>` に追加
   - サイトマップ送信: `https://terra-violin.netlify.app/sitemap.xml`

### 🟡 次のステップ

3. **GitHub へのソース管理移行**（このドキュメント末尾参照）

4. **Netlify の自動デプロイ設定**
   - GitHub リポジトリと Netlify を連携
   - `main` ブランチへの push で自動デプロイ

5. **パフォーマンス改善**
   - Google Fonts の preconnect 最適化（現状: `<link rel="preconnect">` 済み）
   - 画像の WebP 変換（現在は wixstatic.com の CDN 画像をそのまま使用）

6. **コンテンツ追加**
   - ライブスケジュール
   - 演奏動画（YouTube 埋め込み）
   - お問い合わせフォーム（現在はメールと電話のみ）

### 🟢 将来的に

7. **ドメイン取得**（例: terra-violin.com）

8. **Instagram 埋め込み対応**（現在は Twitter のみ）

---

## 6. 設計思想・技術的決定事項

### なぜ静的 HTML か

- サーバー不要、ホスティング費用ゼロ（Netlify 無料枠）
- SEO に最適（SSR不要、クロールしやすい）
- オーナー（TERRA さん）が将来的に自分でメンテナンスできるよう、シンプルに

### なぜ Netlify か

- Netlify Drop（ドラッグ＆ドロップデプロイ）が非エンジニアに優しい
- 無料 SSL、CDN 配信、日本語対応
- 既存サイトが Netlify を使用していた

### CSS 設計方針

- CSS 変数（カスタムプロパティ）で色を一元管理
- Flexbox ベースのレイアウト
- モバイル対応は最低限（`max-width` + `margin: auto` + `padding`）
- 各ページに `<style>` をインライン（外部 CSS ファイルなし）→ HTTP リクエスト削減

### Twitter（X）埋め込み

`blog.html` では Twitter の公式ウィジェット（`platform.twitter.com/widgets.js`）を使用。  
将来的に X の API 有料化が進んだ場合は代替手段が必要になる可能性あり。

---

## 7. 既知の問題

| 問題 | 詳細 | 対処方法 |
|------|------|----------|
| ブログページの Twitter 読み込み | X（旧Twitter）の埋め込み制限で表示されない可能性 | 公式ウィジェット以外の方法を検討 |
| `profile.html` の `/* HEA!ER */` コメント | タイポ（元ファイルから引き継ぎ） | `/* HEADER */` に修正 |
| 電話番号の掲載 | `contact.html` に `08016130859` を掲載中 | オーナーの意向次第で削除検討 |
| sitemap.xml の lastmod | 固定日付のため実際の更新と乖離 | 自動生成スクリプトを検討 |

---

## 8. GitHub へのプッシュ手順

### 新規リポジトリを作成してプッシュ

```bash
# 1. terra-violin-fixed ディレクトリに移動
cd terra-violin-fixed

# 2. Git 初期化
git init

# 3. ユーザー設定（初回のみ）
git config user.name "TERRA"
git config user.email "violin.tkssbkw@gmail.com"

# 4. .gitignore 作成（任意）
echo "*.DS_Store\n.env" > .gitignore

# 5. ファイルをステージング
git add .

# 6. 初回コミット
git commit -m "feat: SEO改善済みTERRAviolinサイト初回コミット"

# 7. GitHub でリポジトリを作成（ブラウザで）
# → https://github.com/new
# → Repository name: terra-violin-site
# → Public または Private を選択
# → "Add a README file" は「チェックなし」

# 8. リモートを追加してプッシュ（YOUR_USERNAME を置き換え）
git remote add origin https://github.com/YOUR_USERNAME/terra-violin-site.git
git branch -M main
git push -u origin main
```

### Netlify と GitHub を連携して自動デプロイ

```
1. https://app.netlify.com/projects/terra-violin/configuration
2. "Build & deploy" → "Link to Git provider"
3. GitHub を選択 → terra-violin-site リポジトリを選択
4. Publish directory: . (ルート)
5. "Save" → main へ push するたびに自動デプロイ
```

---

## 9. 関連情報

| 項目 | 値 |
|------|-----|
| Netlify サイト名 | terra-violin |
| Netlify サイト ID | `b0235f19-119a-4794-b9bb-0ecefc28cc7b` |
| Netlify PAT（要更新） | `nfp_68Uiz47GsVbU8tTetpNijuCn6GyyqtYjd1b3`（2026/04/29 失効） |
| Twitter | @terra_violin |
| メール | violin.tkssbkw@gmail.com |
| 画像 CDN | wixstatic.com（Wix からの流用） |
| OGP 画像 URL | `https://static.wixstatic.com/media/41d81a_30e334d47efe456f838bd2b6094b4151~mv2.jpg` |

---

## 10. Project IDX（Firebase Studio）で最初にすること

```
1. このリポジトリを IDX にインポート
2. Extensions: "Live Server" または "Firebase Hosting" を追加
3. terra-violin-fixed/ を開いて index.html をプレビュー確認
4. Netlify CLI でデプロイ:
   npm install -g netlify-cli
   netlify login  # ブラウザでログイン
   netlify deploy --prod --dir=. --site=b0235f19-119a-4794-b9bb-0ecefc28cc7b
5. デプロイ確認: https://terra-violin.netlify.app
6. Google Search Console に登録してサイトマップを送信
```

---

*このドキュメントは 2026-04-22 に Claude（Anthropic Cowork）が生成しました。*
