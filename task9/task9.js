/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * /*aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };*/

var aqiData = {};


/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityName=document.getElementById('aqi-city-input').value.trim();
    var aqiValue=document.getElementById('aqi-value-input').value.trim();
    var cityTip= document.getElementById('cityTip');
    var aqiTip= document.getElementById('aqiTip');
    if(cityName==''){
      cityTip .innerHTML='城市名不能为空'
        return;
    }
    if(aqiValue==''){
      aqiTip .innerHTML='质量指数不能为空';
        return;
    }
    var regCity=/[\u4e00-\u9fa5a-zA-Z]+/;
    var regAqi=/\d/;
    if(!cityName.match(regCity)){
        cityTip.innerHTML='城市名为中文名或英文名';
        return;
    }else {
        cityTip.innerHTML='城市名输入正确';
    }
    if(!aqiValue.match(regAqi)){
        aqiTip.innerHTML='质量指数必须为整数';
        return;
    }else {
        aqiTip.innerHTML='质量指数正确';
    }
    //判断输入的城市是否已经存在
    var isExist=false;
    for(var c in aqiData){
        if(cityName==c){
            isExist=true;
        }else {
            isExist=false;
        }
    }
    //不存在则加入保存
    if(!isExist){
        aqiData[cityName]=aqiValue;
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
   var table=document.getElementById('aqi-table');
    var trStr='';
    for (var c in aqiData) {
        var tr ='<tr><td>'+c+'</td><td>'+aqiData[c]+'</td><td><button>'+'删除'+'</button></td>';
        trStr+=tr;
    }
    table.innerHTML=trStr;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
    // do sth.
    delete aqiData[city];
    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById('add-btn').addEventListener('click',addBtnHandle,false);
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    document.getElementById('aqi-table').addEventListener('click',function (e) {
       if(e.target.nodeName.toLowerCase()=='button'){
           var city=e.target.parentElement.parentNode.firstElementChild.innerHTML;
           delBtnHandle(city);
       }
    });
}
window.onload=function () {
    init();
}
