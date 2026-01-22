# StockAppl - 股票與天文數據視覺化網站

## 專案目標

複製 https://aoauk.co/peter/ 網站，建立一個可部署在 GitHub Pages 上的靜態股票與天文數據視覺化應用。

## 原網站功能分析

### 核心功能
1. **股票數據視覺化** - 顯示股票的收盤價、最高/最低價、成交量、K線圖
2. **天文數據疊加** - 將太陽系天體的軌道數據疊加在股票圖表上
3. **日期範圍篩選** - 可選擇開始與結束日期
4. **角度調整** - 支援 360°, 180°, 90°, 45°, 30° 角度顯示
5. **多種數據類型** - 黃經(Longitude)、黃緯(Latitude)、赤緯(Declination)、距離(Distance)
6. **星座標記** - 在天體進入新星座時顯示符號標記

### 技術堆疊
- **前端框架**: 原生 HTML5 + CSS3 + JavaScript（無框架）
- **圖表庫**: Plotly.js 3.0.1 (CDN)
- **數據格式**: CSV 靜態檔案
- **圖表類型**: Scatter、Candlestick、雙 Y 軸

## 檔案結構

```
stockappl/
├── index.html                 # 主頁面
├── static/
│   ├── css/
│   │   └── base.css          # 樣式表
│   ├── js/
│   │   └── financescript.js  # 主要 JavaScript 邏輯
│   └── data/
│       ├── symbols.csv       # 股票代號列表
│       ├── body.csv          # 天體列表
│       ├── [股票名].csv      # 各股票歷史數據
│       └── [天體名].csv      # 各天體位置數據
├── scripts/
│   └── update_stocks.py      # 數據更新腳本
├── .github/
│   └── workflows/
│       └── update-data.yml   # GitHub Actions 自動更新
└── README.md
```

## 數據格式

### symbols.csv（股票列表）
```csv
,name
0,NVIDIA Corp
1,Brent Crude
2,Dow Jones Industrial Average
3,Gold
4,Bitcoin to USD
5,S and P 500
6,Apple
7,Amazon
8,IBM
9,BP
10,Silver
```

### body.csv（天體列表）
```csv
,object
0,Sun
1,Moon
2,Mercury
3,Venus
4,Mars
5,Jupiter
6,Saturn
7,Uranus
8,Neptune
9,Pluto
10,NorthNode
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

## 開發任務

### Phase 1: 基礎架構
- [ ] 建立專案目錄結構
- [ ] 複製 index.html 主頁面
- [ ] 複製 base.css 樣式表
- [ ] 複製 financescript.js 主程式

### Phase 2: 數據準備
- [ ] 建立 symbols.csv 股票列表
- [ ] 建立 body.csv 天體列表
- [ ] 撰寫 Python 腳本下載股票數據（使用 yfinance）
- [ ] 準備或生成天體位置數據（使用 Skyfield 或 Astropy）

### Phase 3: 數據更新自動化
- [ ] 撰寫 update_stocks.py 腳本
- [ ] 設定 GitHub Actions workflow
- [ ] 測試自動更新流程

### Phase 4: 部署
- [ ] 建立 GitHub Repository
- [ ] 推送所有檔案
- [ ] 啟用 GitHub Pages
- [ ] 測試網站功能

## 股票數據來源

使用 Python yfinance 套件下載：

```python
import yfinance as yf
import pandas as pd

# 股票代號對應
SYMBOLS = {
    "NVIDIA Corp": "NVDA",
    "Apple": "AAPL",
    "Amazon": "AMZN",
    "IBM": "IBM",
    "BP": "BP",
    "Gold": "GC=F",
    "Silver": "SI=F",
    "Brent Crude": "BZ=F",
    "Bitcoin to USD": "BTC-USD",
    "Dow Jones Industrial Average": "^DJI",
    "S and P 500": "^GSPC"
}

# 下載範例
for name, ticker in SYMBOLS.items():
    data = yf.download(ticker, start="2020-01-01", end="2026-12-31")
    data.to_csv(f"static/data/{name}.csv")
```

## 天體數據來源

使用 Python Skyfield 套件計算：

```python
from skyfield.api import load
from skyfield.framelib import ecliptic_frame

# 載入星曆表
eph = load('de421.bsp')
earth = eph['earth']
sun = eph['sun']

# 計算太陽位置
ts = load.timescale()
t = ts.utc(2024, 1, 1)
position = earth.at(t).observe(sun).apparent()
lat, lon, distance = position.frame_latlon(ecliptic_frame)
```

## GitHub Pages 設定

1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. 網址: `https://{username}.github.io/{repo-name}/`

## 注意事項

- GitHub Pages 僅支援靜態網站，所有數據必須預先生成為 CSV
- 天體數據需要從 1940 年開始（與原網站一致）
- 股票數據建議每日透過 GitHub Actions 更新
- Plotly.js 使用 CDN 載入，無需本地安裝
