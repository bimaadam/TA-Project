# 🌸 桜会計ダッシュボード (Sakura Accounting Dashboard)

<div align="center">
  <img src="https://raw.githubusercontent.com/vercel/next.js/canary/packages/next/src/web/spec-extension/unstable-cache.ts" width="100" alt="Next.js Logo" />
  
  **～ 美しい会計管理の世界へようこそ ～**
  
  *A modern and minimal accounting dashboard to manage finances & project reports, built with love using Next.js 15, TypeScript, and Tailwind CSS.*
</div>

<div align="center">
  <img src="https://img.shields.io/badge/next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/typescript-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/tailwindcss-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/api-restful-ff69b4" />
  <img src="https://img.shields.io/badge/prisma-2D3748?logo=prisma&logoColor=white" />
</div>

---

## 🌸 概要 (Overview)

**桜会計ダッシュボード** adalah dashboard akuntansi modern dan minimal untuk mengelola keuangan & laporan proyek dengan cinta menggunakan Next.js 15, TypeScript, dan Tailwind CSS. Dibangun dengan filosofi desain Jepang yang mengutamakan kesederhanaan, efisiensi, dan keindahan.

*A modern and minimal accounting dashboard to manage finances & project reports, built with love and Japanese design philosophy emphasizing simplicity, efficiency, and beauty.*

---

## 🎨 作者 (Creator)

**Hikari Takahashi** ✨  
*Digital Craftsman & Code Poet*

**開発者 (Developer):** Bima Adam  
*Backend Architecture Specialist*

---

## 🏯 技術スタック (Tech Stack)

<div align="center">

| 技術 | 説明 |
|------|------|
| 🔥 **Next.js 15** | App router with Server Actions |
| ⚡ **TypeScript** | Type-safe frontend & backend |
| 🎨 **Tailwind CSS** | Beautiful, responsive UI |
| 🎯 **Prisma** | Elegant database ORM |
| 🌐 **REST API** | Clean & structured endpoints |
| 🐘 **PostgreSQL** | 強力なリレーショナルデータベース |

</div>

---

## 🌅 セットアップ (Setup)

### 前提条件 (Prerequisites)
```bash
# Node.js 18+ が必要
node --version

# pnpm パッケージマネージャー
npm install -g pnpm
```

### インストール (Installation)
```bash
# プロジェクトをクローン
git clone https://github.com/bimaadam/TA-Project.git
cd TA-Project

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
```

### データベース設定 (Database Setup)
```bash
# Prisma マイグレーション
pnpm prisma migrate dev

# データベースシード
pnpm prisma db seed
```

---

## 🚀 実行方法 (Running the Application)

```bash
# 開発モード - 桜のように美しく開発
pnpm dev

# 本番ビルド - 富士山のように安定
pnpm build

# 本番モード実行
pnpm start

# テストモード - 武士道のように厳格
pnpm test
```

アプリケーションを開く: **http://localhost:3000** ✨

---

## 🏮 プロジェクト構造 (Project Structure)

```
桜会計ダッシュボード/
├── 🌸 src/
│   ├── 📁 app/
│   │   ├── 📊 dashboard/
│   │   ├── 📋 projects/
│   │   ├── 💰 finances/
│   │   └── 🔗 api/
│   ├── 🎨 components/
│   │   ├── 🖼️ ui/
│   │   └── 📈 charts/
│   ├── 🧩 lib/
│   └── 🎯 utils/
├── 🎨 public/
│   ├── images/
│   └── icons/
├── 🐘 prisma/
│   ├── schema.prisma
│   └── migrations/
└── 📚 docs/
```

---

## 🎋 主要機能 (Key Features)

### 📊 財務ダッシュボード (Financial Dashboard)
- ✨ 美しい財務記録の概要表示
- 📈 リアルタイム財務データ分析
- 🎨 Soft, pastel-friendly UI powered by Tailwind CSS

### 🗂️ プロジェクト管理 (Project Management)
- 📋 プロジェクト予算管理＆追跡
- 📊 視覚的なプロジェクト進捗表示
- 📤 多形式レポートエクスポート

### 🔒 セキュリティ (Security)
- 🛡️ Secure RESTful API endpoints
- 🔐 役割ベースのアクセス制御
- ⚡ Fast and scalable, built on Next.js 15

### 🎨 UI/UX の美学 (UI/UX Aesthetics)
- 🌸 日本の美学に inspired されたデザイン
- 🎯 レスポンシブでモダンなインターフェース
- 💫 滑らかなアニメーションとトランジション

---

## 🌺 開発コマンド (Development Commands)

```bash
# 開発サーバー起動
pnpm dev

# 本番用ビルド
pnpm build

# 本番サーバー起動
pnpm start

# コード品質チェック
pnpm lint

# コードフォーマット
pnpm format

# テスト実行
pnpm test

# データベース管理
pnpm prisma studio     # データベースGUI
pnpm prisma generate   # クライアント生成
```

---

## 🎌 デプロイメント (Deployment)

### Vercel での展開 (推奨)

```bash
# Vercel CLIインストール
npm install -g vercel

# デプロイ
vercel --prod
```

### 手動デプロイメント

```bash
# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

---

## 🎪 スクリーンショット (Screenshots)

> *Coming soon!* 🖼️  
> 美しいUIスクリーンショットを準備中です...

---

## 🌟 貢献方法 (Contributing)

Pull Requests are welcome! 🤍

1. 🍴 このリポジトリをフォーク
2. 🌱 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 📝 変更をコミット (`git commit -m '✨ Add amazing feature'`)
4. 🚀 ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. 🎯 プルリクエストを作成

**Special thanks to:** ririn-bytes 🌷 for forking this project

---

## 🏆 ライセンス (License)

このプロジェクトは **MIT License** の下で公開されています。

---

## 🙏 謝辞 (Acknowledgments)

- 🌸 **CV Abyzain Jaya Teknika** - Real needs inspiration
- 🎯 **Next.js Team** - 素晴らしいフレームワーク
- 🐘 **Prisma Team** - 優れたORM
- 🎨 **Tailwind CSS** - Beautiful styling system
- 🌍 **Open Source Community** - 継続的なインスピレーション

---

## 📞 連絡先 (Contact)

**Hikari Takahashi**  
📧 Email: hikari.takahashi@example.com  
🐦 Twitter: [@hikari_dev](https://twitter.com/hikari_dev)  
💼 LinkedIn: [hikari-takahashi](https://linkedin.com/in/hikari-takahashi)

**Bima Adam Nugraha**  
📧 Email: bima.adam@abyzain.com  
🐱 GitHub: [@bimaadam](https://github.com/bimaadam)  
💼 Developed with 💖 by Bima Adam Nugraha

---

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />
  
  **桜のように美しく、富士山のように安定したダッシュボードを目指して**
  
  *Striving for a dashboard as beautiful as cherry blossoms and as stable as Mount Fuji*
  
  <sub>💼 @TA-Project — 2025</sub>
  
  Made with 💖 and ☕ in Indonesia
</div>
