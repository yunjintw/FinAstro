#!/usr/bin/env python3
"""
股票數據更新腳本
使用 yfinance 下載最新股票數據並更新 CSV 檔案

使用方式:
    pip install yfinance pandas
    python scripts/update_stocks.py
"""

import yfinance as yf
import pandas as pd
from pathlib import Path
from datetime import datetime

# 股票名稱對應 Yahoo Finance 代號
# 格式: "顯示名稱": ("Yahoo Finance 代號", "上市日期或None表示從最早開始")
SYMBOLS = {
    # 原有股票
    "NVIDIA Corp": ("NVDA", "2020-01-01"),
    "Amazon": ("AMZN", "2020-01-01"),
    "IBM": ("IBM", "2020-01-01"),
    "BP": ("BP", "2020-01-01"),
    "Gold": ("GC=F", "2020-01-01"),
    "Silver": ("SI=F", "2020-01-01"),
    "Brent Crude": ("BZ=F", "2020-01-01"),
    "Bitcoin to USD": ("BTC-USD", "2020-01-01"),
    "Dow Jones Industrial Average": ("^DJI", "2020-01-01"),
    "S and P 500": ("^GSPC", "2020-01-01"),

    # 新增股票 - 從上市日期開始抓取全部數據
    "台積電ADR": ("TSM", "1997-10-09"),
    "台積電": ("2330.TW", "2000-01-04"),
    "Intel": ("INTC", "1980-03-17"),
    "Apple": ("AAPL", "1980-12-12"),
    "AMD": ("AMD", "1980-03-17"),
    "可口可樂": ("KO", "1962-01-02"),
    "廣達": ("2382.TW", "2000-01-04"),
    "宏碁": ("2353.TW", "2000-01-04"),
    "微星": ("2377.TW", "2000-01-04"),
    "緯創": ("3231.TW", "2003-08-19"),
    "緯穎": ("6669.TW", "2017-11-13"),
    "和碩": ("4938.TW", "2009-01-12"),
}

# 數據目錄（財經數據放在 finance 子目錄）
DATA_DIR = Path(__file__).parent.parent / "static" / "data" / "finance"

def download_stock(name: str, ticker: str, start_date: str = "2020-01-01"):
    """下載單支股票數據"""
    try:
        print(f"正在下載 {name} ({ticker}) 從 {start_date} 開始...")

        # 下載數據
        data = yf.download(ticker, start=start_date, progress=False)

        if data.empty:
            print(f"  警告: {name} 沒有數據")
            return False

        # 重設索引，將日期變成欄位
        data = data.reset_index()

        # 處理欄位名稱（yfinance 新版可能有 MultiIndex）
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = [col[0] for col in data.columns]

        # 統一欄位名稱為小寫
        data.columns = [col.lower() for col in data.columns]

        # 確保有必要的欄位
        required_cols = ['date', 'open', 'high', 'low', 'close', 'volume']
        for col in required_cols:
            if col not in data.columns:
                # 嘗試找類似的欄位
                for c in data.columns:
                    if col in c.lower():
                        data = data.rename(columns={c: col})
                        break

        # 只保留需要的欄位
        data = data[['date', 'open', 'high', 'low', 'close', 'volume']]

        # 格式化日期
        data['date'] = pd.to_datetime(data['date']).dt.strftime('%Y-%m-%d')

        # 加入索引欄位（原網站格式）
        data.insert(0, '', range(len(data)))

        # 按日期降序排列（最新的在前面）
        data = data.sort_values('date', ascending=False).reset_index(drop=True)
        data[''] = range(len(data))

        # 儲存 CSV
        output_path = DATA_DIR / f"{name}.csv"
        data.to_csv(output_path, index=False)

        print(f"  成功: 儲存 {len(data)} 筆記錄到 {output_path.name}")
        return True

    except Exception as e:
        print(f"  錯誤: {name} 下載失敗 - {e}")
        return False

def update_symbols_csv():
    """更新 symbols.csv 檔案"""
    symbols_data = pd.DataFrame({
        '': range(len(SYMBOLS)),
        'name': list(SYMBOLS.keys())
    })
    symbols_path = DATA_DIR / "symbols.csv"
    symbols_data.to_csv(symbols_path, index=False)
    print(f"更新 symbols.csv: {len(SYMBOLS)} 支股票")

def main():
    print("=" * 60)
    print("股票數據更新腳本")
    print(f"更新時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # 確保目錄存在
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 更新 symbols.csv
    update_symbols_csv()

    # 下載所有股票
    success_count = 0
    for name, (ticker, start_date) in SYMBOLS.items():
        if download_stock(name, ticker, start_date):
            success_count += 1

    print("=" * 60)
    print(f"完成! 成功更新 {success_count}/{len(SYMBOLS)} 支股票")
    print("=" * 60)

if __name__ == "__main__":
    main()
