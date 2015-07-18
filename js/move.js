function addEvent(elem, type, listener, useCapture){ //事件注册兼容函数
	return document.addEventListener?elem.addEventListener(type, listener, useCapture):elem.attachEvent('on'+type,listener);
}
function doEvent(elem,type){  //事件触发兼容函数
	return document.dispatchEvent?elem.dispatchEvent(type):elem.fireEvent('on'+type);
}
function getStyle(obj,name){  //样式获取兼容函数
	return window.getComputedStyle?window.getComputedStyle(obj)[name]:obj.currentStyle[name];
}
function getByClass(obj,names){
    if(obj.getElementsByClassName){
        return obj.getElementsByClassName(names);
    }else{
        var _obj=obj.getElementsByTagName('*'),
                arr=[],
                names=names.split(' '),
                objStr,
                flag=true;
        for(var i=0;i<_obj.length;i++){
            objStr=' '+_obj[i].className+' ';
            for(var j=0;j<names.length;j++){
                if(objStr.indexOf(' ' +names[j]+' ')==-1){
                    flag=false;
                    break;
                }
            }
            if(flag){
                arr.push(_obj[i]);
            }else{
                flag=true;
            }
        }
        return arr;
    }
}

//用于单属性同步变化的匀速运动
function moveA(obj,property,to,time){  //运动函数 对象、属性、运动终点、执行时间
	//如果是opacity，请在css中写入opacity和filter属性以满足兼容需要
	clearInterval(obj.animate);
	var cur=parseFloat(getStyle(obj,property));		 //返回值居然是字符串类型，我算是栽在这货手里了
	var times=time*1000/20; //次数英文
	var speed=(to-cur)/times;
	var offset=0;
	
	function step(){  //逐次增加属性值
		offset+=speed;
		if(property=='opacity'){  //属性为opacity时的特殊处理
			if(Math.abs(to-cur)>Math.abs(offset)){
				obj.style.opacity=cur+offset;
				obj.style.filter='alpha(opacity:'+(cur+offset)*100+')';
			}else{
				obj.style.opacity=to;
				obj.style.filter='alpha(opacity:'+to*100+')';
				clearInterval(obj.animate);
			}	
		}else{  //正常px后缀属性处理
			if(Math.abs(to-cur)>Math.abs(offset)){
				obj.style[property]=cur+offset+'px';
			}else{
				obj.style[property]=to+'px';
				clearInterval(obj.animate);
			}				
		}
	}
	obj.animate=setInterval(step,20);  //设置定时器
}

//增强版，可用于多属性同步异步混合的匀速运动	
function move_A(obj,json,callback){  //运动函数 对象、属性、运动终点、执行时间、回调函数
	//如果是opacity，请在css中写入opacity和filter属性以满足兼容需要
	clearInterval(obj.animate);
	var cur={},times={},speed={},offset={};
	//算出所有属性的属性值、运动次数、速度
	for(var arr in json){ //json 写法举例:{height:[300,2]} 分别代表属性、目标点、动作时间
		cur[arr]=parseFloat(getStyle(obj,arr));	
		times[arr]=json[arr][1]*1000/20; //次数英文
		speed[arr]=(json[arr][0]-cur[arr])/times[arr];
		offset[arr]=0;
	}
	function step(){  //逐次增加属性值		
		var flag=true;  //假设：所有值都已经到达终点	
		for(var arr in json){			
			offset[arr]+=speed[arr];
			if(arr=='opacity'){  //属性为opacity时的特殊处理
				if(Math.abs(json[arr][0]-cur[arr])>Math.abs(offset[arr])){
					obj.style.opacity=cur[arr]+offset[arr];
					obj.style.filter='alpha(opacity:'+(cur[arr]+offset[arr])*100+')';
					flag=false; //同时运动的，只要有一个运动没结束，定时器就不能取消
				}else{
					obj.style.opacity=json[arr][0];
					obj.style.filter='alpha(opacity:'+json[arr][0]*100+')';
				}	
			}else{  //正常px后缀属性处理
				if(Math.abs(json[arr][0]-cur[arr])>Math.abs(offset[arr])){
					obj.style[arr]=cur[arr]+offset[arr]+'px';
					flag=false;
				}else{
					obj.style[arr]=json[arr][0]+'px';
				}				
			}
		}
		if(flag){
			clearInterval(obj.animate);  //如果没有未完成的动作则取消定时器
		}
	}
	obj.animate=setInterval(step,20);  //设置定时器
	if(callback) callback();  //可用于设置后续效果
}

//用于单属性同步变化的缓冲运动
function moveB(obj,property,to,rate){  //运动函数 对象、属性、运动终点、速率
	//如果是opacity，请在css中写入opacity和filter属性以满足兼容需要
	clearInterval(obj.animate);
	function step(){  //逐次增加属性值
		var cur=parseFloat(getStyle(obj,property));		 //返回值居然是字符串类型，我算是栽在这货手里了
		var speed=(to-cur)/rate;

		if(property=='opacity'){  //属性为opacity时的特殊处理
			speed=speed?(Math.ceil(speed*100)/100):(Math.floor(speed*100)/100);
			if(Math.abs(to-cur)>Math.abs(speed)){
				obj.style.opacity=cur+speed;
				obj.style.filter='alpha(opacity:'+(cur+speed)*100+')';
			}else{
				obj.style.opacity=to;
				obj.style.filter='alpha(opacity:'+to*100+')';
				clearInterval(obj.animate);
			}	
		}else{  //正常px后缀属性处理
			speed=speed?Math.ceil(speed):Math.floor(speed);
			if(Math.abs(to-cur)>Math.abs(speed)){
				obj.style[property]=cur+speed+'px';
			}else{
				obj.style[property]=to+'px';
				clearInterval(obj.animate);
			}				
		}
	}
	obj.animate=setInterval(step,20);  //设置定时器
}

//增强版，可用于多属性同步异步混合的缓冲运动	
function move_B(obj,json,callback){  //运动函数 对象、属性、运动终点、速率、回调函数
	//如果是opacity，请在css中写入opacity和filter属性以满足兼容需要
	clearInterval(obj.animate);
	var cur={},times={},speed={},offset={};

	function step(){  //逐次增加属性值		
		var flag=true;  //假设：所有值都已经到达终点	
		for(var arr in json){ //json 写法举例:{height:[300,10]} 分别代表属性、目标点、速率
			cur[arr]=parseFloat(getStyle(obj,arr));	
			speed[arr]=(json[arr][0]-cur[arr])/json[arr][1];

			if(arr=='opacity'){  //属性为opacity时的特殊处理
				speed[arr]=(speed[arr]>0)?(Math.ceil(speed[arr]*100)/100):(Math.floor(speed[arr]*100)/100);
				if(Math.abs(json[arr][0]-cur[arr])>Math.abs(speed[arr])){
					obj.style.opacity=cur[arr]+speed[arr];
					obj.style.filter='alpha(opacity:'+(cur[arr]+speed[arr])*100+')';
					flag=false; //同时运动的，只要有一个运动没结束，定时器就不能取消
				}else{
					obj.style.opacity=json[arr][0];
					obj.style.filter='alpha(opacity:'+json[arr][0]*100+')';
				}	
			}else{  //正常px后缀属性处理
				speed[arr]=(speed[arr]>0)?Math.ceil(speed[arr]):Math.floor(speed[arr]);
				if(Math.abs(json[arr][0]-cur[arr])>Math.abs(speed[arr])){
					obj.style[arr]=cur[arr]+speed[arr]+'px';
					flag=false;
				}else{
					obj.style[arr]=json[arr][0]+'px';
				}				
			}
		}
		if(flag){
			clearInterval(obj.animate);  //如果没有未完成的动作则取消定时器
		}
	}
	obj.animate=setInterval(step,20);  //设置定时器
	if(callback) callback();  //可用于设置后续效果
}

//以后还可以添加其它运动，如自由落体等
function move_All(obj,json,callback,num){
	if(num) move_A(obj,json,callback);  //num为0或不存在时，为匀速运动
	if(num==1) move_B(obj,json,callback);  //num为1时，为缓冲运动
}