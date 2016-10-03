//以下为测试之用
function printObj(obj) {
    for(var key in obj){
        //console.log(obj[key])
        if(obj[key]){
            if(obj[key] instanceof Array){
                var len=obj[key].length;
                for(var i=0;i<len;++i){
                    if(obj[key][i] instanceof Object){
                        cloneObj(obj[key][i]);
                    }else {
                        console.log(key+'->'+i+':'+obj[key][i]);
                    }
                }
            }else if(obj[key] instanceof Object){
                cloneObj(obj[key]);
            }else {
                console.log(key+':'+ obj[key]);
            }
        }else {console.log(2);}
    }
}
//printObj(srcObj);

//以下为深度克隆对象的代码
function cloneObj(obj,newObj) {
    console.time('t');
    var newObj=newObj||{};
    for(var key in obj){
        if(obj[key]){
            if(obj[key] instanceof Array){
                newObj[key]=[];
                var len=obj[key].length;
                for(var i=0;i<len;++i){
                    if(obj[key][i] instanceof Object){
                        var thisObj={};
                        cloneObj(obj[key][i],thisObj);
                        newObj[key][i]=thisObj;
                    }else {
                        newObj[key][i]=obj[key][i];
                    }
                }
            }else if(obj[key] instanceof Object){
                var iObj={};
                cloneObj(obj[key],iObj);
                newObj[key]=iObj;
            }else {
                newObj[key]=obj[key];
            }
        }else {return;}
    }
    console.timeEnd('t');
   return newObj;
}
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi",{c:33,d:66,jj:['你好','我好',{b12:88,b13:226}]}],
        b2: "JavaScript"
    },
    h:'2016-01-02',
    f:['20','fdfd',{dd:56}]
};
console.log('源对象：',srcObj);
var k=cloneObj(srcObj);
console.log('复制的：',k)
