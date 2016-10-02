/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-08-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(600),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: '北京',
    nowGraTime: "day"
};



/**
 * 渲染图表
 */
function renderChart() {
    //首先获得需要的对应数据
    var Data=chartData[pageState.nowGraTime][pageState.nowSelectCity];
    var divObj=getWidth(Data);
    console.log(Data);
    var innerHtml='';
    var i=0;
    for(var key in Data){

        var color = "#"+Math.floor(Math.random()*16777215).toString(16);
        innerHtml+='<div title="'+pageState.nowSelectCity+key+'的AQI为：'+Data[key]+'" class="aqi-bar lt" style="height:' + Data[key]+'px;'+'width:'+divObj.width+'px;'
           +'margin-left:'+divObj.margin+'px;left:'+(divObj.width*i+divObj.margin*i)+'px;' +'background:'+color+'"></div>';
        i++;
        console.log(divObj.leftOffset)
    }
    //console.log(innerHtml);
    console.log(document.getElementsByClassName('aqi-chart-wrap')[0]);
    document.getElementsByClassName('aqi-chart-wrap')[0].innerHTML=innerHtml;
}

function getWidth(o) {
    var divObj={};
    var aqiChart=document.getElementsByClassName('aqi-chart-wrap')[0];
    var Width=aqiChart.clientWidth;
    var cols=Object.getOwnPropertyNames(o).length;//获得对应有多少条柱体
    var divWidth=Math.ceil(Width/(cols*2));
    var margin=divWidth*0.6;
     divObj.width=divWidth;
    divObj.leftOffset=(Width-divWidth*cols-(cols-1)*margin)/2;
    divObj.margin=margin;
    return divObj
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
    // 确定是否选项发生了变化
    if(e.value!=pageState.nowGraTime){
        pageState.nowGraTime=e.value;//选项发生变化则需要将变化后的粒度存放到pageState中
    }
    // 设置对应数据

    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
    // 确定是否选项发生了变化
    if(e.target.value!=pageState.nowSelectCity){
        // 设置对应数据
        pageState.nowSelectCity=e.target.value;
    }


    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio=document.getElementsByName('gra-time');
    for(var i=0;i<radio.length;++i){
        (function (m) {
            radio[m].addEventListener('click',function () {
                graTimeChange(radio[m])
            },false)
        })(i);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var cities=Object.getOwnPropertyNames(aqiSourceData);
    var select=document.getElementById('city-select');
    var Select_html=cities.map(function (item) {
        return '<option value='+item+'>'+item+'</option>';
    });
   select.innerHTML=Select_html;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    select.addEventListener('change',citySelectChange,false);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var weekData={},singleWeek={};
    var monthData={},singleMonth={};
    var city=Object.getOwnPropertyNames(aqiSourceData);
    for(var key in aqiSourceData){
        var singleCity= aqiSourceData[key];//获得单个城市下面的所有数据
        var cityArr = Object.getOwnPropertyNames(singleCity);//返回单个城市的所有日期（为数组）

        var weekCounter=0;
        var monthCounter=0;
        var weekaqiCounter=0;
        var monthaqiCounter=0;
        var weekInit=new Date(cityArr[0].slice(0,10)).getDay()-1;
        var preMonth=cityArr[0].slice(5,7);

        for(var i=0;i<cityArr.length;++i,weekInit++){

            weekaqiCounter+=aqiSourceData[key][cityArr[i]];//每周aqi总量
            monthaqiCounter+=aqiSourceData[key][cityArr[i]];//每月aqi总量
            weekCounter++;//每周天数
            monthCounter++;//每月天数
            //计算周平均

           if((i==cityArr.length-1||cityArr[i+1].slice(5,7)!=preMonth||(weekInit+1)%7==0)){
                var weeks=cityArr[i].slice(0,7)+'月第'+(Math.floor(weekInit/7)+1)+'周';
               singleWeek[weeks]=Math.floor(weekaqiCounter/weekCounter);
               weekaqiCounter=0;
               weekCounter=0;

               if((i!=cityArr.length-1)&&cityArr[i+1].slice(5,7)!=preMonth){
                   weekInit=weekInit%7;
               }
           }
           //计算月平均
            if(i==cityArr.length-1||cityArr[i+1].slice(5,7)!=preMonth){
                preMonth=(i==cityArr.length-1)? cityArr[i].slice(5,7):cityArr[i+1].slice(5,7);
                var months=cityArr[i].slice(0,7)+'月';
                singleMonth[months]=Math.floor(monthaqiCounter/monthCounter);
                monthCounter=0;
                monthaqiCounter=0;
            }
        }
        weekData[key]=singleWeek;
        monthData[key]=singleMonth;
        singleMonth={};
        singleWeek={};
    }
    // 处理好的数据存到 chartData 中
    chartData.day=aqiSourceData;
    chartData.week=weekData;
    chartData.month=monthData;
    console.log(chartData)
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();