// FinAstro v2 - 深色金融風格
const updateButton = document.querySelector('#update-button');
const stockSelector = document.querySelector('#stock-select');
const stockData = {};
const bodyData = {};

const angle_list = [360, 180, 90, 45, 30, 0];
const bodyDataType_list = ['Longitude', 'Latitude', 'Declination', 'Distance'];
const bodyDataType_zh = { 'Longitude': '黃經', 'Latitude': '黃緯', 'Declination': '赤緯', 'Distance': '距離' };
const stockdisplay_list = ['Close', 'High and Low', 'Close, High and Low', 'Volume', 'Candlestick'];
const stockdisplay_zh = { 'Close': '收盤價', 'High and Low': '最高與最低', 'Close, High and Low': '收盤、最高與最低', 'Volume': '成交量', 'Candlestick': 'K線圖' };

// 天體中文名稱對照
const bodyName_zh = {
    'Sun': '太陽', 'Moon': '月亮', 'Mercury': '水星', 'Venus': '金星',
    'Mars': '火星', 'Jupiter': '木星', 'Saturn': '土星', 'Uranus': '天王星',
    'Neptune': '海王星', 'Pluto': '冥王星', 'NorthNode': '北交點', 'SouthNode': '南交點'
};

// 天體符號對照
const bodySymbol = {
    'Sun': '☉', 'Moon': '☾', 'Mercury': '☿', 'Venus': '♀',
    'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '⛢',
    'Neptune': '♆', 'Pluto': '♇', 'NorthNode': '☊', 'SouthNode': '☋'
};

// 星座中文名稱對照
const signName_zh = {
    'Aries': '牡羊座', 'Taurus': '金牛座', 'Gemini': '雙子座', 'Cancer': '巨蟹座',
    'Leo': '獅子座', 'Virgo': '處女座', 'Libra': '天秤座', 'Scorpio': '天蠍座',
    'Sagittarius': '射手座', 'Capricorn': '摩羯座', 'Aquarius': '水瓶座', 'Pisces': '雙魚座'
};

const signSymbol = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

// 天體顏色（深色主題優化）
const bodyColors = {
    'Sun': '#ffd700', 'Moon': '#c0c0c0', 'Mercury': '#9370db', 'Venus': '#ff69b4',
    'Mars': '#ff4444', 'Jupiter': '#daa520', 'Saturn': '#32cd32', 'Uranus': '#ff8c00',
    'Neptune': '#4169e1', 'Pluto': '#20b2aa', 'NorthNode': '#a0a0a0', 'SouthNode': '#808080'
};

// Plotly 深色主題配置
const plotlyDarkLayout = {
    paper_bgcolor: '#1e222d',
    plot_bgcolor: '#1e222d',
    font: { color: '#d1d4dc', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    xaxis: {
        gridcolor: '#363a45',
        linecolor: '#363a45',
        tickcolor: '#787b86',
        tickfont: { color: '#787b86' }
    },
    yaxis: {
        gridcolor: '#363a45',
        linecolor: '#363a45',
        tickcolor: '#787b86',
        tickfont: { color: '#787b86' }
    },
    yaxis2: {
        gridcolor: '#363a45',
        linecolor: '#363a45',
        tickcolor: '#787b86',
        tickfont: { color: '#787b86' }
    }
};

function updateStatus(text) {
    document.getElementById('status-text').textContent = text;
}

function dataReadComplete() {
    updateButton.innerHTML = "更新圖表";
    updateButton.disabled = null;
    updateStatus('資料載入完成');
}

function get_colour(obj) {
    return bodyColors[obj] || '#888888';
}

function substitute_object(obj) {
    return bodySymbol[obj] || '?';
}

function substitute_sign(sign) {
    return signSymbol[sign] || '?';
}

function fillInSelectors() {
    loadStocks();
    loadBodies();

    for (let item in stockdisplay_list) {
        document.getElementById("stock-display-type").innerHTML +=
            '<option value="' + stockdisplay_list[item] + '">' + stockdisplay_zh[stockdisplay_list[item]] + '</option>';
    }
    for (let item in angle_list) {
        document.getElementById("body-angle").innerHTML +=
            '<option value="' + angle_list[item] + '">' + angle_list[item] + '°</option>';
    }
    for (let item in bodyDataType_list) {
        document.getElementById("body-data-type").innerHTML +=
            '<option value="' + bodyDataType_list[item] + '">' + bodyDataType_zh[bodyDataType_list[item]] + '</option>';
    }
}

const readDataFile = async (name, type) => {
    try {
        const folder = type == 'stock' ? 'finance' : 'astro';
        const res = await fetch("static/data/" + folder + "/" + name + ".csv");
        const data = await res.text();
        const lines = data.split(/\r?\n/);
        let firstline = true;
        let dataArray = [];
        let labels = [];

        for (let line in lines) {
            const items = lines[line].split(",");
            let dataRow = {};
            for (let item in items) {
                if (item != 0) {
                    if (firstline) {
                        labels.push(items[item]);
                    } else {
                        dataRow[labels[item - 1]] = items[item];
                    }
                }
            }
            dataArray.push(dataRow);
            firstline = false;
        }

        if (type == 'stock') {
            stockData[name] = dataArray;
        } else {
            bodyData[name] = dataArray;
        }

        if (name == 'Moon') {
            dataReadComplete();
        }
    } catch (e) {
        console.log("ERROR!!!", e);
    }
};

function addStock(line) {
    const item = line.split(",");
    if (item[1] != undefined && item[1] != "name") {
        document.getElementById("stock-select").innerHTML +=
            '<option value="' + item[1] + '">' + item[1] + '</option>';
        readDataFile(item[1], 'stock');
    }
}

function addBody(line) {
    const item = line.split(",");
    if (item[1] != undefined && item[1] != "object") {
        const bodyNameZh = bodyName_zh[item[1]] || item[1];
        const symbol = bodySymbol[item[1]] || '?';
        const color = bodyColors[item[1]] || '#888';

        document.getElementById("body-list").innerHTML +=
            `<label class="body-item" for="${item[1]}">
                <input type="checkbox" class="body-checkbox" id="${item[1]}" name="${item[1]}" value="${item[1]}">
                <span class="body-icon" style="color: ${color}">${symbol}</span>
                <span class="body-name">${bodyNameZh}</span>
            </label>`;
        readDataFile(item[1], 'body');
    }
}

const loadStocks = async () => {
    try {
        updateStatus('正在載入股票列表...');
        const res = await fetch("static/data/finance/symbols.csv");
        const data = await res.text();
        const lines = data.split(/\r?\n/);
        lines.forEach(addStock);
    } catch (e) {
        console.log("ERROR!!!", e);
    }
    document.getElementById("stock-select").innerHTML += '<option value="none">無</option>';
};

const loadBodies = async () => {
    try {
        updateStatus('正在載入天體資料...');
        const res = await fetch("static/data/astro/body.csv");
        const data = await res.text();
        const lines = data.split(/\r?\n/);
        lines.forEach(addBody);
    } catch (e) {
        console.log("ERROR!!!", e);
    }
};

function setInitialValues() {
    fillInSelectors();
}

// 股票選擇變更事件
stockSelector.addEventListener('change', function (e) {
    const stockName = e.target.value;
    document.getElementById('current-stock-name').textContent = stockName === 'none' ? '僅顯示天體' : stockName;

    // 更新價格顯示
    if (stockData[stockName] && stockData[stockName].length > 1) {
        const latestData = stockData[stockName][1]; // index 0 是空的
        if (latestData && latestData.close) {
            const price = parseFloat(latestData.close).toFixed(2);
            document.getElementById('current-price').textContent = price;

            // 計算漲跌
            if (stockData[stockName][2] && stockData[stockName][2].close) {
                const prevClose = parseFloat(stockData[stockName][2].close);
                const change = ((latestData.close - prevClose) / prevClose * 100).toFixed(2);
                const changeEl = document.getElementById('price-change');
                changeEl.textContent = (change >= 0 ? '+' : '') + change + '%';
                changeEl.className = 'price-change ' + (change >= 0 ? 'up' : 'down');
            }
        }
    }
});

// 更新按鈕事件
updateButton.addEventListener('click', function (e) {
    updateStatus('正在更新圖表...');
    presentGraph();
    updateStatus('圖表已更新');
});

// 天體選擇事件（點擊切換選中狀態）
document.getElementById('body-list').addEventListener('click', function(e) {
    const bodyItem = e.target.closest('.body-item');
    if (bodyItem) {
        const checkbox = bodyItem.querySelector('.body-checkbox');
        bodyItem.classList.toggle('selected', checkbox.checked);
    }
});

// 全螢幕按鈕
document.getElementById('btn-fullscreen').addEventListener('click', function() {
    const chartWrapper = document.querySelector('.chart-wrapper');
    if (chartWrapper.requestFullscreen) {
        chartWrapper.requestFullscreen();
    }
});

// 匯出按鈕
document.getElementById('btn-export').addEventListener('click', function() {
    Plotly.downloadImage('graph', { format: 'png', width: 1920, height: 1080, filename: 'finastro-chart' });
});

function get_bodyList() {
    let bodyList = [];
    for (let i in Object.keys(bodyData)) {
        const body = Object.keys(bodyData)[i];
        if (document.getElementById(body) && document.getElementById(body).checked) {
            bodyList.push(body);
        }
    }
    return bodyList;
}

function filterDatestr(value) {
    const start_date = document.getElementById('graph_start_date').value;
    const end_date = document.getElementById('graph_end_date').value;
    return value['datestr'] >= start_date && value['datestr'] <= end_date;
}

function filterDate(value) {
    const start_date = document.getElementById('graph_start_date').value;
    const end_date = document.getElementById('graph_end_date').value;
    return value['date'] >= start_date && value['date'] <= end_date;
}

function presentGraph() {
    const start_date = document.getElementById('graph_start_date').value;
    const end_date = document.getElementById('graph_end_date').value;
    const stockname = document.getElementById('stock-select').value;
    const stockgraph = document.getElementById('stock-display-type').value;

    const [body_chart_data, annotate_data, yrange, yautorange] = addBodyChart();
    let chart_data;
    let titleText;

    if (stockname != 'none') {
        const stock_chart_data = addStockChart(stockname);
        chart_data = body_chart_data.concat(stock_chart_data);
        titleText = stockname + ' ' + (stockdisplay_zh[stockgraph] || stockgraph);
    } else {
        chart_data = body_chart_data;
        titleText = '太陽系天體軌道';
    }

    const layout = {
        ...plotlyDarkLayout,
        title: { text: titleText, font: { size: 16, color: '#d1d4dc' } },
        xaxis: {
            ...plotlyDarkLayout.xaxis,
            title: { text: '日期', font: { color: '#787b86' } },
            range: [start_date, end_date],
            type: 'date'
        },
        yaxis: {
            ...plotlyDarkLayout.yaxis,
            title: { text: '天體數值', font: { color: '#787b86' } },
            range: yrange,
            autorange: yautorange
        },
        yaxis2: {
            ...plotlyDarkLayout.yaxis2,
            title: { text: '股價', font: { color: '#787b86' } },
            side: 'right',
            overlaying: 'y',
            autorange: true
        },
        annotations: annotate_data,
        margin: { t: 50, r: 60, b: 50, l: 60 },
        showlegend: false
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        displaylogo: false
    };

    Plotly.newPlot('graph', chart_data, layout, config);
}

function addBodyChart() {
    let angle = document.getElementById('body-angle').value;
    if (angle == 0) angle = 360;

    const show_markers = document.getElementById('show_markers').checked;
    const show_text = document.getElementById('show_text').checked;
    const body_data_type = document.getElementById('body-data-type').value;

    let body_data = [];
    let annotate_data = [];
    const bodylist = get_bodyList();

    let yrange, yautorange;
    if (body_data_type == "Longitude") {
        yrange = [angle, 0];
        yautorange = false;
    } else {
        yrange = [0, 0];
        yautorange = true;
    }

    for (let body in bodylist) {
        let x_data = [];
        let y_data = [];
        let oldY = 0;
        let oldSign = "";
        const bodyname = bodylist[body];
        const selected_bodyData = bodyData[bodyname].filter(filterDatestr);

        for (let i in selected_bodyData) {
            const x_val = selected_bodyData[i]['datestr'];
            const sign = selected_bodyData[i]['sign'];
            let y_val = 0;

            if (body_data_type == "Longitude") {
                y_val = selected_bodyData[i]['eclipticlongitude'] % angle;
            } else if (body_data_type == "Latitude") {
                y_val = selected_bodyData[i]['eclipticlatitude'];
            } else if (body_data_type == "Declination") {
                y_val = selected_bodyData[i]['declination'];
            } else if (body_data_type == "Distance") {
                y_val = selected_bodyData[i]['distant'];
            }

            // 星座變換標記
            if (oldSign != sign) {
                let text_marker;
                if (show_markers || oldSign == '') {
                    if (show_text) {
                        text_marker = (signName_zh[sign] || sign) + ":" + (bodyName_zh[bodyname] || bodyname);
                    } else {
                        text_marker = substitute_sign(sign) + ":" + substitute_object(bodyname);
                    }
                } else {
                    text_marker = '';
                }

                if (text_marker) {
                    annotate_data.push({
                        x: x_val,
                        y: y_val,
                        text: text_marker,
                        font: { color: get_colour(bodyname), size: 10 },
                        ax: 0,
                        ay: -20,
                        showarrow: false
                    });
                }
            }

            // 處理角度跳躍
            if (Math.abs(oldY - y_val) > angle - 20) {
                x_data.push(x_val);
                y_data.push(null);
            }
            x_data.push(x_val);
            y_data.push(y_val);
            oldY = y_val;
            oldSign = sign;
        }

        const bodyname_zh = bodyName_zh[bodyname] || bodyname;
        body_data.push({
            type: 'scatter',
            mode: 'lines',
            yaxis: 'y',
            x: x_data,
            y: y_data,
            showlegend: false,
            name: bodyname_zh,
            line: { color: get_colour(bodyname), width: 2 },
            hovertemplate: bodyname_zh + '<br>%{x}<br>%{y:.2f}<extra></extra>'
        });

        // 赤緯參考線
        if (body_data_type == "Declination" && selected_bodyData.length > 0) {
            const firstDate = selected_bodyData[0]['datestr'];
            const lastDate = selected_bodyData[selected_bodyData.length - 1]['datestr'];
            body_data.push({
                type: 'scatter',
                mode: 'lines',
                yaxis: 'y',
                x: [firstDate, lastDate],
                y: [23.6, 23.6],
                showlegend: false,
                line: { color: '#363a45', width: 1, dash: 'dot' }
            });
            body_data.push({
                type: 'scatter',
                mode: 'lines',
                yaxis: 'y',
                x: [firstDate, lastDate],
                y: [-23.6, -23.6],
                showlegend: false,
                line: { color: '#363a45', width: 1, dash: 'dot' }
            });
        }
    }

    return [body_data, annotate_data, yrange, yautorange];
}

function addStockChart(stockname) {
    const filteredData = stockData[stockname].filter(filterDate);
    const x_data = filteredData.map(v => v['date']);
    let stock_data = [];
    const extract_type = document.getElementById('stock-display-type').value;

    if (extract_type == 'Close') {
        const y_data = filteredData.map(v => v['close']);
        stock_data.push({
            type: 'scatter',
            mode: 'lines',
            yaxis: 'y2',
            name: stockname + " 收盤價",
            x: x_data,
            y: y_data,
            line: { color: '#2962ff', width: 2 },
            hovertemplate: stockname + '<br>%{x}<br>$%{y:.2f}<extra></extra>'
        });
    } else if (extract_type == 'High and Low') {
        stock_data.push({
            type: 'scatter',
            mode: 'lines',
            yaxis: 'y2',
            name: stockname + " 最高價",
            x: x_data,
            y: filteredData.map(v => v['high']),
            line: { color: '#26a69a', width: 1.5 }
        });
        stock_data.push({
            type: 'scatter',
            mode: 'lines',
            yaxis: 'y2',
            name: stockname + " 最低價",
            x: x_data,
            y: filteredData.map(v => v['low']),
            line: { color: '#ef5350', width: 1.5 }
        });
    } else if (extract_type == 'Close, High and Low') {
        stock_data.push({
            type: 'scatter',
            mode: 'lines',
            yaxis: 'y2',
            name: stockname + " 收盤價",
            x: x_data,
            y: filteredData.map(v => v['close']),
            line: { color: '#2962ff', width: 2 },
            error_y: {
                type: 'data',
                symmetric: false,
                color: '#787b86',
                thickness: 1,
                width: 0,
                array: filteredData.map(v => v['high'] - v['close']),
                arrayminus: filteredData.map(v => v['close'] - v['low'])
            }
        });
    } else if (extract_type == 'Volume') {
        stock_data.push({
            type: 'bar',
            yaxis: 'y2',
            name: stockname + " 成交量",
            x: x_data,
            y: filteredData.map(v => v['volume']),
            marker: { color: '#2962ff', opacity: 0.7 }
        });
    } else if (extract_type == 'Candlestick') {
        stock_data.push({
            type: 'candlestick',
            yaxis: 'y2',
            name: stockname + " K線圖",
            x: x_data,
            open: filteredData.map(v => v['open']),
            high: filteredData.map(v => v['high']),
            low: filteredData.map(v => v['low']),
            close: filteredData.map(v => v['close']),
            increasing: { line: { color: '#26a69a' } },
            decreasing: { line: { color: '#ef5350' } }
        });
    }

    return stock_data;
}

window.onload = setInitialValues;
