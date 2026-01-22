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

# 數據目錄
DATA_DIR = Path(__file__).parent.parent / "static" / "data"

def download_stock(name: str, ticker: str, start_date: str = "2020-01-01"):
    """下載單支股票數據"""
    try:
        print(f"正在下載 {name} ({ticker})...")

        # 下載數據
        data = yf.download(ticker, start=start_date, progress=False)

        if data.empty:
            print(f"  警告: {name} 沒有數據")
            return False

        # 重設索引，將日期變成欄位
        data = data.reset_index()

        # 重新命名欄位以符合原網站格式
        data.columns = ['date', 'open', 'high', 'low', 'close', 'volume']
        if 'Adj Close' in data.columns:
            data = data.drop('Adj Close', axis=1)

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
    print("=" * 50)
    print("股票數據更新腳本")
    print(f"更新時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)

    # 確保目錄存在
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 更新 symbols.csv
    update_symbols_csv()

    # 下載所有股票
    success_count = 0
    for name, ticker in SYMBOLS.items():
        if download_stock(name, ticker):
            success_count += 1

    print("=" * 50)
    print(f"完成! 成功更新 {success_count}/{len(SYMBOLS)} 支股票")
    print("=" * 50)

if __name__ == "__main__":
    main()
