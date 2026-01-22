# FinAstro - 股票與天文數據視覺化網站

## 專案概述

將股票價格與太陽系天體軌道數據疊加顯示的視覺化應用，部署在 GitHub Pages。

- **GitHub Repo**: https://github.com/yunjintw/FinAstro
- **線上網址**: https://yunjintw.github.io/FinAstro/

## 核心功能

1. **股票數據視覺化** - 收盤價、最高/最低價、成交量、K線圖
2. **天文數據疊加** - 太陽系天體軌道數據疊加在股票圖表上
3. **日期範圍篩選** - 可選擇開始與結束日期
4. **角度調整** - 支援 360°, 180°, 90°, 45°, 30° 角度顯示
5. **多種數據類型** - 黃經(Longitude)、黃緯(Latitude)、赤緯(Declination)、距離(Distance)
6. **星座標記** - 天體進入新星座時顯示符號標記

## 技術堆疊

- **前端**: 原生 HTML5 + CSS3 + JavaScript
- **圖表庫**: Plotly.js 3.0.1 (CDN)
- **數據格式**: CSV 靜態檔案
- **數據更新**: Python + yfinance + GitHub Actions
- **部署**: GitHub Pages

## 檔案結構

```
FinAstro/
├── index.html                      # 主頁面
├── CLAUDE.md                       # 專案說明文件
├── static/
│   ├── css/
│   │   └── base.css               # 樣式表
│   ├── js/
│   │   └── financescript.js       # 主要 JavaScript 邏輯
│   └── data/
│       ├── finance/               # 股票數據目錄
│       │   ├── symbols.csv        # 股票代號列表
│       │   └── [股票名].csv       # 各股票歷史數據
│       └── astro/                 # 天體數據目錄
│           ├── body.csv           # 天體列表
│           └── [天體名].csv       # 各天體位置數據
├── scripts/
│   └── update_stocks.py           # 股票數據更新腳本
└── .github/
    └── workflows/
        └── update-data.yml        # GitHub Actions 自動更新
```

## 股票列表（61 支）

### 原有股票
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| NVIDIA Corp | NVDA | 2020-01-01 |
| Amazon | AMZN | 1997-05-15 |
| IBM | IBM | 2020-01-01 |
| BP | BP | 2020-01-01 |
| Gold | GC=F | 2020-01-01 |
| Silver | SI=F | 2020-01-01 |
| Brent Crude | BZ=F | 2020-01-01 |
| Bitcoin to USD | BTC-USD | 2020-01-01 |
| Dow Jones Industrial Average | ^DJI | 2020-01-01 |
| S and P 500 | ^GSPC | 2020-01-01 |

### 台股與美股科技
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| 台積電ADR | TSM | 1997-10-09 |
| 台積電 | 2330.TW | 2000-01-04 |
| Intel | INTC | 1980-03-17 |
| Apple | AAPL | 1980-12-12 |
| AMD | AMD | 1980-03-17 |
| 可口可樂 | KO | 1962-01-02 |
| 廣達 | 2382.TW | 2000-01-04 |
| 宏碁 | 2353.TW | 2000-01-04 |
| 微星 | 2377.TW | 2000-01-04 |
| 緯創 | 3231.TW | 2003-08-19 |
| 緯穎 | 6669.TW | 2017-11-13 |
| 和碩 | 4938.TW | 2009-01-12 |

### AI 數據中心與基礎設施
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| Vertiv Holdings | VRT | 2020-02-07 |
| Eaton Corporation | ETN | 1972-06-01 |
| Fabrinet | FN | 2010-06-25 |
| Oracle | ORCL | 1986-03-12 |
| Arista Networks | ANET | 2014-06-06 |
| Nebius Group | NBIS | 2024-10-21 |
| Iris Energy | IREN | 2021-11-17 |
| Cipher Mining | CIFR | 2021-08-27 |
| CrowdStrike | CRWV | 2019-06-12 |

### 鈾礦與核能
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| Centrus Energy | LEU | 2014-09-30 |
| Cameco | CCJ | 1996-07-15 |
| Uranium Energy | UEC | 2005-12-21 |
| Denison Mines | DNN | 2006-12-01 |
| Constellation Energy | CEG | 2022-02-02 |
| Vistra Corp | VST | 2016-10-03 |
| Talen Energy | TLN | 2024-05-17 |
| NextEra Energy | NEE | 1985-01-01 |
| Southern Company | SO | 1982-01-01 |
| Global X Uranium ETF | URA | 2010-11-04 |
| Sprott Uranium Miners ETF | URNM | 2019-12-03 |
| VanEck Uranium Nuclear ETF | NLR | 2007-08-13 |

### 電力與基礎設施
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| Cleantech Grid ETF | GRID | 2009-06-16 |
| Global X Defense Tech ETF | SHLD | 2023-02-21 |

### 稀土與電池材料
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| MP Materials | MP | 2020-11-18 |
| Lynas Rare Earths | LYSDY | 2011-01-03 |
| 4U Uranium | UUUU | 2005-11-22 |
| Lynas Rare Earths Ltd | LYC | 2011-01-03 |
| Albemarle | ALB | 1994-03-01 |
| Sociedad Quimica y Minera | SQM | 1993-09-22 |
| USA Rare Earth | USAR | 2024-03-22 |
| American Battery Technology | ABAT | 2021-04-06 |
| VanEck Rare Earth ETF | REMX | 2010-10-27 |

### 半導體與科技
| 顯示名稱 | Yahoo Finance 代號 | 起始日期 |
|---------|-------------------|----------|
| Broadcom | AVGO | 2009-08-06 |
| Kratos Defense | KTOS | 2011-01-03 |
| ThredUp | TMDX | 2021-03-26 |
| EOSE Energy | EOSE | 2020-11-23 |
| MercadoLibre | MELI | 2007-08-10 |
| SoFi Technologies | SOFI | 2021-06-01 |
| Rubrik | RBRK | 2024-04-25 |

## 天體列表

| 天體 | 說明 |
|------|------|
| Sun | 太陽 |
| Moon | 月亮 |
| Mercury | 水星 |
| Venus | 金星 |
| Mars | 火星 |
| Jupiter | 木星 |
| Saturn | 土星 |
| Uranus | 天王星 |
| Neptune | 海王星 |
| Pluto | 冥王星 |
| NorthNode | 北交點 |

## 數據格式

### symbols.csv（股票列表）
```csv
,name
0,NVIDIA Corp
1,Amazon
2,Apple
...
```

### 股票數據格式（如 Apple.csv）
```csv
,date,open,close,high,low,volume
0,2026-01-21,248.71,247.65,251.56,245.19,54151253
1,2026-01-20,252.73,246.70,254.79,243.42,80267500
...
```

### 天體數據格式（如 Sun.csv）
```csv
,datestr,eclipticlatitude,eclipticlongitude,distant,declination,sign
0,1940-01-01 12:00:00,-4.706e-05,279.934,0.983,-23.01,Capricorn
1,1940-01-02 12:00:00,-1.173e-05,280.954,0.983,-22.92,Capricorn
...
```

## 開發指令

### 更新股票數據
```bash
cd scripts
pip install yfinance pandas
python update_stocks.py
```

### 推送到 GitHub
```bash
git add .
git commit -m "更新股票數據"
git push origin main
```

## GitHub Actions 自動更新

每日自動執行 `scripts/update_stocks.py` 更新股票數據。

設定檔：`.github/workflows/update-data.yml`

## 常見問題

### 瀏覽器快取問題
部署後如果看不到新股票，使用以下方法清除快取：
- **Windows Chrome**: `Ctrl + Shift + R` 或 `Ctrl + F5`
- **Mac Safari**: `Cmd + Option + R`
- **無痕模式測試**: 開啟無痕視窗訪問網站

### GitHub Actions 部署失敗（500 錯誤）
這是 GitHub 伺服器暫時性問題，等待幾分鐘後重新觸發 workflow 即可。

## 新增股票步驟

1. 編輯 `scripts/update_stocks.py`，在 `SYMBOLS` 字典中加入：
   ```python
   "顯示名稱": ("Yahoo Finance 代號", "起始日期"),
   ```

2. 執行腳本下載數據：
   ```bash
   python scripts/update_stocks.py
   ```

3. 提交並推送：
   ```bash
   git add .
   git commit -m "新增股票: XXX"
   git push origin main
   ```

## 注意事項

- GitHub Pages 僅支援靜態網站，所有數據必須預先生成為 CSV
- 天體數據從 1940 年開始（與原網站一致）
- 股票數據每日透過 GitHub Actions 自動更新
- Plotly.js 使用 CDN 載入，無需本地安裝
- Yahoo Finance 代號查詢：https://finance.yahoo.com/
