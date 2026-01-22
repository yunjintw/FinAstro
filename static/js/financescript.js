const updateButton = document.querySelector('#update-button');
const temp='xx';
const stockSelector = document.querySelector('#stock-select');
const stockData = {};
// stockname1: [{row1},{date: xxxx, high: xxxx, low:xxxxx, open:xxxx, close:xxxx, volume:xxxxx}...], stockname2: [] ...

const bodyData = {};
// bodyname1: [{  },{row2}...]

const angle_list= [360,180,90,45,30,0]
const bodyDataType_list = ['Longitude','Latitude','Declination','Distance']
const bodyDataType_zh = {'Longitude': '黃經', 'Latitude': '黃緯', 'Declination': '赤緯', 'Distance': '距離'}
const stockdisplay_list = ['Close', 'High and Low', 'Close, High and Low', 'Volume', 'Candlestick']
const stockdisplay_zh = {'Close': '收盤價', 'High and Low': '最高與最低', 'Close, High and Low': '收盤、最高與最低', 'Volume': '成交量', 'Candlestick': 'K線圖'}

// 天體中文名稱對照
const bodyName_zh = {
    'Sun': '太陽',
    'Moon': '月亮',
    'Mercury': '水星',
    'Venus': '金星',
    'Mars': '火星',
    'Jupiter': '木星',
    'Saturn': '土星',
    'Uranus': '天王星',
    'Neptune': '海王星',
    'Pluto': '冥王星',
    'NorthNode': '北交點',
    'SouthNode': '南交點'
}

// 星座中文名稱對照
const signName_zh = {
    'Aries': '牡羊座',
    'Taurus': '金牛座',
    'Gemini': '雙子座',
    'Cancer': '巨蟹座',
    'Leo': '獅子座',
    'Virgo': '處女座',
    'Libra': '天秤座',
    'Scorpio': '天蠍座',
    'Sagittarius': '射手座',
    'Capricorn': '摩羯座',
    'Aquarius': '水瓶座',
    'Pisces': '雙魚座'
}

function dataReadComplete(){
    updateButton.innerHTML = "更新圖表"
    updateButton.disabled = null
}

function get_colour(obj) {
    if (obj=="Sun") {
        col = ['grey']
    }
    else if (obj == "Moon") {
        col = ['lightblue']
    }
    else if (obj == "Mercury") {
        col = ['purple']
    }
    else if (obj == "Venus") {
        col = ['pink']
    }
    else if (obj == "Mars") {
        col = ['red']
    }
    else if (obj == "Jupiter") {
        col = ['goldenrod']
    }
    else if (obj == "Saturn") {
        col = ['green',]
    }
    else if (obj == "Uranus") {
        col = ['darkorange']
    }
    else if (obj == "Neptune") {
        col = ['blue']
    }
    else if (obj == "Pluto") {
        col = ['teal']
    }
    else if (obj == "SouthNode") {
        col = ['lightgrey']
    }
    else if (obj == "NorthNode") {
        col = ['lightgrey']
    }
    return col

}

function  substitute_object(obj) {
    if (obj=="Sun") {
        symbol = '☉'
    }
    else if ( obj == "Moon") {
        symbol = '☾'
    }
    else if  (obj == "Mercury") {
        symbol = '☿'
    }
    else if  (obj == "Venus") {
        symbol = '♀'
    }
    else if  (obj == "Mars") {
        symbol = '♂'
    }
    else if ( obj == "Jupiter") {
        symbol = '♃'
    }
    else if ( obj == "Saturn") {
        symbol = '♄'
    }
    else if ( obj == "Uranus") {
        symbol = '⛢'
    }
    else if ( obj == "Neptune") {
        symbol = '♆'
    }
    else if ( obj == "Pluto") {
        symbol = '♇'
    }
    else if ( obj == "SouthNode") {
        symbol = '☋'
    }
    else if ( obj == "NorthNode") {
        symbol = '☊'
    }
    return symbol
}
function  substitute_sign(sign) {
    if ( sign=="Aries") {
        symbol = '♈︎'
    }
    else if ( sign=="Taurus") {
        symbol = 'ȣ'
    }
    else if ( sign=="Gemini") {
        symbol = '♊︎'
    }
    else if ( sign=="Cancer") {
        symbol = '♋︎'
    }
    else if ( sign=="Leo") {
        symbol = '♌︎'
    }
    else if ( sign=="Virgo") {
        symbol = '♍︎'
    }
    else if ( sign=="Libra") {
        symbol = '♎︎'
    }
    else if ( sign=="Scorpio") {
        symbol = '♏︎'
    }
    else if ( sign=="Sagittarius") {
        symbol = '♐︎'
    }
    else if ( sign=="Capricorn") {
        symbol = '♑︎'
    }
    else if ( sign=="Aquarius") {
        symbol = '♒︎'
    }
    else if ( sign=="Pisces") {
        symbol = '♓︎'
    }
    else {
        symbol = 'x'

    }
    return symbol
}


function  fillInSelectors() {
    loadStocks();
    loadBodies();

    for (item in stockdisplay_list){
        document.getElementById("stock-display-type").innerHTML += '<option value="' + stockdisplay_list[item] + '">' + stockdisplay_zh[stockdisplay_list[item]] + '</option>'
    }
    for (item in angle_list){
        document.getElementById("body-angle").innerHTML += '<option value="' + angle_list[item] + '">' + angle_list[item] + '°</option>'
    }
    for (item in bodyDataType_list){
        document.getElementById("body-data-type").innerHTML += '<option value="' + bodyDataType_list[item] + '">' + bodyDataType_zh[bodyDataType_list[item]] + '</option>'
    }
    console.log(Object.keys(bodyData))


}



const readDataFile  = async (name, type) => {
    try {
        console.log("in readDataFile " + name)
        // 根據類型決定路徑
        const folder = type == 'stock' ? 'finance' : 'astro';
        const res = await fetch("static/data/" + folder + "/" + name + ".csv");
        const data = await res.text();
        lines = data.split(/\r?\n/);
        firstline=true
        dataArray = [];
        labels = []
        for (line in lines) {
            items = lines[line].split(",")
            dataRow = {}
            for (item in items) {
                if (item!=0){

                    if (firstline) {
                        labels.push(items[item])
                    }
                    else {
                        dataRow[labels[item-1]] = items[item]
                    }
                }

            }
            dataArray.push(dataRow)
            firstline= false

        }
        if (type == 'stock'){
            stockData[name] = dataArray
        }
        else {
            bodyData[name] = dataArray
        }
        // As the moon takes longest to load - mark complete once it is loaded
        if (name == 'Moon') {
            dataReadComplete()
        }
    } catch (e) {
        console.log("ERROR!!!", e);
    }

};



function parseStockLine(line){
    item = line.split(",")
    if (item[1] != undefined  ) {
        document.getElementById("graph").innerHTML += '<div id="' +item[1] +'" name="' + item[1] + '">' + item+ '</div>'
    }

}

function addStock(line) {
    item = line.split(",")
    if (item[1] != undefined && item[1] != "name" ) {
        document.getElementById("stock-select").innerHTML += '<option value="' + item[1] + '">' + item[1] + '</option>'
        readDataFile(item[1], 'stock');
    }
}

function addBody(line) {
    item = line.split(",")
    if (item[1] != undefined && item[1] != "object" ) {
        const bodyNameZh = bodyName_zh[item[1]] || item[1];
        document.getElementById("body-list").innerHTML += '<input type="checkbox" id="' +item[1] +'" name="' + item[1] + '" value="' + item+ '">'
        document.getElementById("body-list").innerHTML += '<label for="' + item[1] +'"> ' + bodyNameZh +'</label>'
        readDataFile(item[1], 'body');
    }


//    console.log(item[1]);
}
const loadStocks = async () => {
    try {
        const res = await fetch("static/data/finance/symbols.csv");
        const data = await res.text();
        lines = data.split(/\r?\n/);
        lines.forEach(addStock);

    } catch (e) {
        console.log("ERROR!!!", e);
    }
    // add in none option for stocks
    document.getElementById("stock-select").innerHTML += '<option value="none">無</option>'
};

const loadBodies = async () => {
    try {
        const res = await fetch("static/data/astro/body.csv");
        const data = await res.text();
        lines = data.split(/\r?\n/);
        lines.forEach(addBody);
    } catch (e) {
        console.log("ERROR!!!", e);
    }
    console.log("Bodies added");
};

function setInitialValues() {
    console.log("in setInitialValues")
    fillInSelectors();
    console.log("left setInitialValues");

}

stockSelector.addEventListener('change', function (e) {
    console.log("stockSelector clicked");

    let storeddata = document.getElementById("stored-data");
    storeddata.setAttribute("tempValue",'stockSelector');
    console.log("stockSelector finished");

})

updateButton.addEventListener('click', function (e) {
    console.log("updateButton clicked");

    presentGraph()

    console.log("updateButton finished " );

})

function get_bodyList() {
    bodyList = []
    for (i in Object.keys(bodyData)) {
        body = Object.keys(bodyData)[i]
        if (document.getElementById(body).checked) {
            bodyList.push(body)
        }
    }
    return bodyList
}
function presentGraph() {
    console.log("Doing Plot");


    start_date = document.getElementById('graph_start_date').value;
    end_date = document.getElementById('graph_end_date').value;

    stockname = document.getElementById('stock-select').value;
    stockgraph = document.getElementById('stock-display-type').value;

    [body_chart_data, annotate_data, yrange, yautorange] = addBodyChart()
    if (stockname != 'none') {
        stock_chart_data = addStockChart(stockname)
        chart_data = body_chart_data.concat(stock_chart_data)
    }
    else {
        chart_data = body_chart_data
        stockname = '僅顯示太陽系天體'
        stockgraph = ""
    }

    const stockgraph_zh = stockdisplay_zh[stockgraph] || stockgraph;

    layout = {
        title: {text: stockname + ' ' + stockgraph_zh + ' 圖表'},
        xaxis: {
            title: '日期',
            range: [start_date, end_date],
            type: 'date'
        },
        yaxis: {
            title: '天體數值',
            range: yrange,
            autorange: yautorange
        },
        yaxis2: {
            title: '股價',
            side: 'right',
            overlaying: 'y',
            autorange: 'true'
        },
        annotations: annotate_data
    }


//    document.getElementById("graph").innerHTML = x_data
    Plotly.newPlot('graph', chart_data, layout);

    console.log("Done Plot");

}

function extract_datestr(value, index,array) {
    return value['datestr']
}
function extract_eclipticlongitude(value, index,array) {
    return value['eclipticlongitude']
}
function extract_eclipticlatitude(value, index,array) {
    return value['eclipticlatitude']
}
function extract_distant(value, index,array) {
    return value['distant']
}
function extract_declination(value, index,array) {
    return value['declination']
}
function extract_sign(value, index,array) {
    return value['sign']
}

function filterDatestr(value, index,array){
    start_date = document.getElementById('graph_start_date').value;
    end_date = document.getElementById('graph_end_date').value;
    return value['datestr']>= start_date && value['datestr']<=end_date
}

function addBodyChart() {
    // need to filter the  data to the max and min dates, so that the autorange feature works correctly
    angle = document.getElementById('body-angle').value
    if (angle == 0) {
        angle = 360
    }
    show_markers = document.getElementById('show_markers').checked // True if checked
    show_text = document.getElementById('show_text').checked
    body_data_type = document.getElementById('body-data-type').value


    let body_data = []
    let annotate_data = []
    let text_marker = 'X'
    console.log(Object.keys(bodyData))
    console.log(Object.keys(bodyData['Sun'][1]))
    bodylist =  get_bodyList() //['Sun']

    // values for y axis, based on body data type
    if (body_data_type == "Longitude"){
        yrange = [angle,0]
        yautorange = false
    }
    else {
        yrange = [0,0]
        yautorange = true

    }

    for (body in bodylist) {
        x_data = []
        y_data = []
        oldY=0
        oldSign = ""
        bodyname = bodylist[body]
        selected_bodyData = bodyData[bodyname].filter(filterDatestr)
        for (i in selected_bodyData) {
            let x_val = selected_bodyData[i]['datestr']
            let sign =  selected_bodyData[i]['sign']
// set y value based on body data type
            let y_val = 0
            if (body_data_type == "Longitude"){
                y_val = selected_bodyData[i]['eclipticlongitude']  % angle
            }
            else if (body_data_type == "Latitude"){
                y_val = selected_bodyData[i]['eclipticlatitude']
            }
            else if (body_data_type == "Declination"){
                y_val = selected_bodyData[i]['declination']
            }
            else if (body_data_type == "Distance"){
                y_val = selected_bodyData[i]['distant']
            }


 // setting up annotations for sign changes
            if (oldSign != selected_bodyData[i]['sign']){
                if (show_markers || oldSign ==''){
                    if(show_text ) {
                        const sign_zh = signName_zh[sign] || sign;
                        const body_zh = bodyName_zh[bodyname] || bodyname;
                        text_marker = sign_zh + ":" + body_zh
                    }
                    else {
                        text_marker = substitute_sign(sign) + ":" + substitute_object( bodyname)

                    }
                }
                else {
                    text_marker = 'X'
                }

                annotate_data.push({
                    x: x_val,
                    y: y_val,
                    text: text_marker,
                    font:{
                        color: get_colour(bodyname)[0]
                    },
                    ax: 0,
                    ay: 0,
                    showarrow: false
                })
            }


            if (Math.abs(oldY - y_val) > angle -20) {
                x_data.push(x_val)
                y_data.push(null)
            }
            x_data.push(x_val)
            y_data.push(y_val)
            oldY=y_val
            oldSign = sign
        }
        selected_bodyData_len = i
        const bodyname_zh = bodyName_zh[bodyname] || bodyname;
        body_data.push({
            type: 'scatter',
            yaxis: 'y',
            x: x_data,
            y: y_data,
        showlegend: false,
        name: bodyname_zh,
        marker: { color: get_colour(bodyname)[0],  'size': 1 }
        })
        if (body_data_type == "Declination"){
            body_data.push({
                type: 'scatter',
                yaxis: 'y',
                x: [selected_bodyData[0]['datestr'],selected_bodyData[selected_bodyData_len]['datestr']],
                y: [23.6,23.6],
            showlegend: false,
            marker: { color: 'lightgrey',  'size': 1 }
            })
            body_data.push({
                type: 'scatter',
                yaxis: 'y',
                x: [selected_bodyData[0]['datestr'],selected_bodyData[selected_bodyData_len]['datestr']],
                y: [-23.6,-23.6],
            showlegend: false,
            marker: { color: 'lightgrey',  'size': 1 }
            })

        }

    }
    console.log(annotate_data)
    return [body_data, annotate_data, yrange, yautorange]

}



function extract_date(value, index,array) {
    return value['date']
}
function extract_close(value, index,array) {
    return value['close']
}
function extract_open(value, index,array) {
    return value['open']
}
function extract_volume(value, index,array) {
    return value['volume']
}
function extract_high(value, index,array) {
    return value['high']
}
function extract_low(value, index,array) {
    return value['low']
}
function extract_highdif(value, index,array) {
    return value['high'] - value['close']
}
function extract_lowdif(value, index,array) {
    return value['close'] - value['low']
}
function filterDate(value, index,array){
    start_date = document.getElementById('graph_start_date').value;
    end_date = document.getElementById('graph_end_date').value;
    return value['date']>= start_date && value['date']<=end_date
}

function addStockChart(stockname) {

    // need to filter the  data to the max and min dates, so that the autorange feature works correctly

    x_data = stockData[stockname].filter(filterDate).map(extract_date)
    let stock_data = []

    let extract_type = document.getElementById('stock-display-type').value;
    if (extract_type == 'Close' ){
        y_data = stockData[stockname].filter(filterDate).map(extract_close)
        stock_data.push({
            type: 'scatter',
            yaxis: 'y2',
            name: stockname  + " 收盤價",
            x: x_data,
            y: y_data
        })
    }
    else if (extract_type == 'High and Low' ){
        y_data = stockData[stockname].filter(filterDate).map(extract_high)
        y2_data = stockData[stockname].filter(filterDate).map(extract_low)
        stock_data.push({
            type: 'scatter',
            yaxis: 'y2',
            name: stockname  + " 最高價",
            x: x_data,
            y: y_data
        })
        stock_data.push({
            type: 'scatter',
            yaxis: 'y2',
            name: stockname  + " 最低價",
            x: x_data,
            y: y2_data
        })

    }
    else if (extract_type == 'Close, High and Low' ){
        y_data = stockData[stockname].filter(filterDate).map(extract_highdif)
        y2_data = stockData[stockname].filter(filterDate).map(extract_lowdif)
        y3_data = stockData[stockname].filter(filterDate).map(extract_close)
        stock_data.push({
            type: 'scatter',
            yaxis: 'y2',
            name: stockname  + " 收盤價",
            x: x_data,
            y: y3_data,
            error_y: {
                type: 'data',
                symmetric: 'false',
                color: 'grey',
                thickness: 2,
                width: 1,
                array: y_data,
                arrayminus: y2_data }

        })

    }
    else if (extract_type == 'Volume' ){
        y_data = stockData[stockname].filter(filterDate).map(extract_volume)
        stock_data.push({
            type: 'scatter',
            yaxis: 'y2',
            name: stockname  + " 成交量",
            x: x_data,
            y: y_data
        })
    }
    else if (extract_type == 'Candlestick' ){
        high_data = stockData[stockname].filter(filterDate).map(extract_high)
        low_data = stockData[stockname].filter(filterDate).map(extract_low)
        open_data = stockData[stockname].filter(filterDate).map(extract_open)
        close_data = stockData[stockname].filter(filterDate).map(extract_close)
        stock_data.push({
            mode: 'lines',
            type: 'candlestick',
            showlegend: 'false',
            marker: { 'color': 'grey',  'size': 1 },
            visible: 'false',
            showlegend: 'false',
            yaxis: 'y2',
            name: stockname  + " K線圖",
            x: x_data,
            close: close_data,
            open: open_data,
            high: high_data,
            low: low_data
        })

    }
    return stock_data

}

window.onload = setInitialValues
