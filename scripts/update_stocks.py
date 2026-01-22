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

    # AI 數據中心與基礎設施
    "Vertiv Holdings": ("VRT", "2020-02-07"),
    "Eaton Corporation": ("ETN", "1972-06-01"),
    "Fabrinet": ("FN", "2010-06-25"),
    "Oracle": ("ORCL", "1986-03-12"),
    "Arista Networks": ("ANET", "2014-06-06"),
    "Nebius Group": ("NBIS", "2024-10-21"),
    "Iris Energy": ("IREN", "2021-11-17"),
    "Cipher Mining": ("CIFR", "2021-08-27"),
    "CrowdStrike": ("CRWV", "2019-06-12"),

    # 鈾礦與核能
    "Centrus Energy": ("LEU", "2014-09-30"),
    "Cameco": ("CCJ", "1996-07-15"),
    "Uranium Energy": ("UEC", "2005-12-21"),
    "Denison Mines": ("DNN", "2006-12-01"),
    "Constellation Energy": ("CEG", "2022-02-02"),
    "Vistra Corp": ("VST", "2016-10-03"),
    "Talen Energy": ("TLN", "2024-05-17"),
    "NextEra Energy": ("NEE", "1985-01-01"),
    "Southern Company": ("SO", "1982-01-01"),
    "Global X Uranium ETF": ("URA", "2010-11-04"),
    "Sprott Uranium Miners ETF": ("URNM", "2019-12-03"),
    "VanEck Uranium Nuclear ETF": ("NLR", "2007-08-13"),

    # 電力與基礎設施
    "Cleantech Grid ETF": ("GRID", "2009-06-16"),
    "Global X Defense Tech ETF": ("SHLD", "2023-02-21"),

    # 稀土與電池材料
    "MP Materials": ("MP", "2020-11-18"),
    "Lynas Rare Earths": ("LYSDY", "2011-01-03"),
    "4U Uranium": ("UUUU", "2005-11-22"),
    "Lynas Rare Earths Ltd": ("LYC", "2011-01-03"),
    "Albemarle": ("ALB", "1994-03-01"),
    "Sociedad Quimica y Minera": ("SQM", "1993-09-22"),
    "USA Rare Earth": ("USAR", "2024-03-22"),
    "American Battery Technology": ("ABAT", "2021-04-06"),
    "VanEck Rare Earth ETF": ("REMX", "2010-10-27"),

    # 半導體與科技
    "Broadcom": ("AVGO", "2009-08-06"),
    "Kratos Defense": ("KTOS", "2011-01-03"),
    "ThredUp": ("TMDX", "2021-03-26"),
    "EOSE Energy": ("EOSE", "2020-11-23"),
    "MercadoLibre": ("MELI", "2007-08-10"),
    "SoFi Technologies": ("SOFI", "2021-06-01"),
    "Rubrik": ("RBRK", "2024-04-25"),

    # 大型科技股
    "Google": ("GOOGL", "2004-08-19"),
    "Meta": ("META", "2012-05-18"),

    # 台股與日股
    "91APP": ("6741.TWO", "2021-05-17"),
    "Appier": ("4180.T", "2021-03-30"),
    "鴻海": ("2317.TW", "2000-01-04"),
    "仁寶": ("2324.TW", "2000-01-04"),
    "技嘉": ("2376.TW", "2000-01-04"),

    # 全球主要指數
    "道瓊工業指數": ("^DJI", "1985-01-01"),
    "日經225指數": ("^N225", "1985-01-01"),
    "台灣加權指數": ("^TWII", "1985-01-01"),
    "香港恆生指數": ("^HSI", "1985-01-01"),
    "上證綜合指數": ("000001.SS", "1991-01-01"),

    # 歐洲主要指數
    "德國DAX指數": ("^GDAXI", "1985-01-01"),
    "英國FTSE100指數": ("^FTSE", "1985-01-01"),
    "法國CAC40指數": ("^FCHI", "1985-01-01"),
    "歐洲STOXX50指數": ("^STOXX50E", "1987-01-01"),
    "荷蘭AEX指數": ("^AEX", "1985-01-01"),
    "瑞士SMI指數": ("^SSMI", "1988-01-01"),
    "西班牙IBEX35指數": ("^IBEX", "1992-01-01"),
    "義大利FTSE MIB指數": ("FTSEMIB.MI", "1998-01-01"),

    # 韓國
    "韓國KOSPI指數": ("^KS11", "1985-01-01"),
    "三星電子": ("005930.KS", "2000-01-04"),
    "SK海力士": ("000660.KS", "2000-01-04"),
    "LG電子": ("066570.KS", "2002-04-22"),

    # 半導體與記憶體
    "ASML": ("ASML", "1995-03-14"),
    "美光": ("MU", "1984-06-01"),

    # 日本企業
    "Sony": ("SONY", "1970-09-17"),
    "任天堂": ("NTDOY", "1985-01-01"),

    # 韓國娛樂
    "SM娛樂": ("041510.KQ", "2000-04-27"),
    "JYP娛樂": ("035900.KQ", "2001-10-01"),

    # 精品與奢侈品
    "愛馬仕": ("RMS.PA", "1993-06-03"),
    "LVMH": ("MC.PA", "1989-01-01"),
    "PRADA": ("1913.HK", "2011-06-24"),

    # 航太與國防
    "勞斯萊斯": ("RR.L", "1987-05-01"),
    "空中巴士": ("AIR.PA", "2000-07-10"),
    "波音": ("BA", "1962-01-02"),

    # 汽車產業
    "RIVIAN": ("RIVN", "2021-11-10"),
    "Toyota": ("TM", "1999-09-29"),
    "賓士": ("MBG.DE", "1998-01-01"),
    "BMW": ("BMW.DE", "1988-01-01"),
    "Aston Martin": ("AML.L", "2018-10-03"),
    "EPSON": ("SEKEY", "1985-01-01"),

    # 玻璃與材料
    "康寧": ("GLW", "1984-01-03"),
    "旭硝子AGC": ("5201.T", "1985-01-01"),
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
