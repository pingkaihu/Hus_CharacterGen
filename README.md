# DnD 5e 角色產生器

一個基於 React + TypeScript + Vite 的純前端 D&D 5e 角色產生網站，採用經典紙本角色卡風格設計。

## 🎮 線上體驗

[**點此開始冒險 →**](https://pingkaihu.github.io/Hus_CharacterGen/)

## ✨ 功能特色

### 角色資料輸入
- **基本資料**：姓名、種族、職業、等級、陣營
- **能力值系統**：六項基本能力值（STR、DEX、CON、INT、WIS、CHA）與即時修正值計算
- **角色背景故事**：多行文字輸入
- **角色圖像上傳**：本機預覽（使用 URL.createObjectURL）

### 自動計算衍生數值
- 最大生命值（HP）
- 護甲等級（AC）
- 熟練加值
- 豁免值
- 法術位（根據職業類型）
- 技能加值
- 先攻（Initiative）
- 速度（Speed）

### 角色卡預覽
- **經典 D&D 5e 風格**：羊皮紙質感、黑墨邊框、襯線字體
- **三欄式佈局**：
  - 左欄：能力值圓圈與修正值
  - 中欄：AC 盾牌、先攻、速度、HP 區塊
  - 右欄：人格特質、理想、羈絆、缺點
- **響應式設計**：支援桌面與行動裝置

### 匯出功能
- JSON 格式匯出
- 列印 / PDF 匯出（使用瀏覽器列印功能，已優化列印樣式）

### 其他特色
- **自動生成人物介紹**：根據種族、職業、能力值與背景故事生成描述
- **本地儲存**：自動儲存到 localStorage，重新載入時自動還原

## 🛠 技術棧

- **React 18** + **TypeScript**
- **Vite** - 建置工具
- **Tailwind CSS** - 樣式框架
- **GitHub Actions** - 自動部署到 GitHub Pages
- **純前端** - 無需後端伺服器

## 🚀 安裝與執行

### 前置需求

- Node.js 18+ 與 npm

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173/Hus_CharacterGen/`

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 📁 專案結構

```
src/
├── types/
│   └── character.ts          # 角色相關型別定義
├── rules/
│   ├── constants.ts          # D&D 5e 規則常數
│   ├── calculations.ts       # 規則計算函式
│   └── description.ts        # 人物介紹生成
├── components/
│   ├── CharacterForm/        # 表單組件
│   │   ├── BasicInfoForm.tsx
│   │   ├── AbilityScoresForm.tsx
│   │   ├── BackgroundForm.tsx
│   │   └── ImageUpload.tsx
│   ├── Preview/              # 預覽組件
│   │   ├── CharacterCard.tsx
│   │   └── DescriptionPanel.tsx
│   └── Export/               # 匯出組件
│       └── ExportControls.tsx
├── App.tsx                   # 主應用組件
├── main.tsx                  # 入口檔案
└── index.css                 # 全域樣式與 D&D 設計系統
```

## 📖 D&D 5e 規則實作

### 能力值修正

公式：`mod = floor((score - 10) / 2)`

### 熟練加值

根據等級查表：
- 等級 1-4: +2
- 等級 5-8: +3
- 等級 9-12: +4
- 等級 13-16: +5
- 等級 17-20: +6

### 最大生命值

- 等級 1：生命骰最大值 + CON 修正
- 更高等級：簡化為 (生命骰平均值 + CON 修正) × 等級

### 護甲等級（AC）

簡化處理：`10 + DEX 修正`（無裝甲時）

### 豁免值

能力修正值 +（若該豁免熟練則加上熟練加值）

### 法術位

根據職業類型（全施法者/半施法者/無）與等級查表

## 📋 使用說明

1. **填寫基本資料**：輸入角色姓名、選擇種族與職業、設定等級與陣營
2. **設定能力值**：輸入六項基本能力值（範圍 1-30），系統會自動計算修正值
3. **撰寫背景故事**：在文字框中輸入角色的背景、經歷與動機
4. **上傳角色圖像**（選填）：選擇圖片檔案進行本機預覽
5. **查看角色卡**：右側會即時顯示計算後的角色卡與自動生成的人物介紹
6. **匯出角色**：點擊「Export JSON」下載 JSON 檔案，或點擊「Print Sheet」使用瀏覽器列印功能

## ⚠️ 注意事項

- 圖片上傳僅為本機預覽，不會上傳到任何伺服器
- 角色資料會自動儲存到瀏覽器的 localStorage
- 列印功能使用瀏覽器的列印對話框，可選擇「另存為 PDF」

## 🔮 未來擴充方向

- [ ] 技能熟練選擇系統
- [ ] 裝備與裝甲選擇
- [ ] 多職業支援
- [ ] 子職業選擇
- [ ] 完整的 PDF 模板輸出
- [ ] 多角色管理與列表
- [ ] 後端整合與帳號系統

## 📄 授權

MIT License
