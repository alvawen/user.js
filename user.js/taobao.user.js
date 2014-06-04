// ==UserScript==
// @name        taobao Helper
// @namespace   anyfly.com
// @description Help to taobao
// @include     *http://miao.item.taobao.com/*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @require     http://noyesno.net/include/JSON.js
// @author      anyfly@gmail.com
// ==/UserScript==

//----------------data struts----------------
var debugJS = false;
var NYNO = {};
/*
NYNO.config = JSON.parse(GM_getValue('config','{}'));
if (!NYNO.config.haveConfig)
{
	NYNO.config.haveConfig = true;	
	saveConfig();
}
*/
NYNO.data = {};
var host = window.location.host;
/*
if (host.indexOf("cart/recommend") >=0){
	window.location.href = "http://order.xiaomi.com/cart/index"
}
*/
var eobj = {};

eobj = {clicks:["#checkoutToPay","dl[data-zipcode=541000]","#toCheckBtn",".URLNext","#btnpack","dd[xmtype=d]","#btnphone","dd[xmtype=m16]","dd[xmtype=dx]"]};  
eobj.callback=function(){alert(1);}
setTimeout(startHelper, 20);

//$(startHelper);
if (debugJS){
	GM_log("run user js...");
}
//----------------code here----------------
function startHelper() {
	if (debugJS){
		GM_log("start execute...");
	}
	if (exec(eobj, 200))
	{
		
		//clearInterval(intervalstart)
	}	
	if (eobj.callback) {
		//eobj.callback();
	}
	
} 
//----------------left side----------------
function addLeftSide() {
	GM_addStyle("#tools {border:2px solid #3366cc; width:200px;position:fixed;top:0;left:-198px;text-align:left;padding:1em 0.3em;overflow:scroll;background-color:white;height:96%;}");
	var eSidepane = document.createElement('div');
	eSidepane.setAttribute('id','tools');
	eSidepane.innerHTML = '<span></span><hr/><ul></ul>'; 

	$(document.body).append(eSidepane);
}
function addTools(){
	var parent = $("#tools span");
	addToolsBtn(parent, "view all", ";").addEventListener('click',function(evt) {
		
	} ,true);
	//addToolsBtn(parent, "Btn1", ";");
	//addToolsBtn(parent, "Btn2", ";");
}
function addToolsBtn(parent, html, js){
	var a = document.createElement('a');	
	a.href="javascript:" + js;  
	a.innerHTML=html;         
    parent.append(a).append(document.createTextNode("  "));
	return a;
}
function addRow(user_name, ischecked){
	var oLi    = document.createElement('li');
	var oCheck = document.createElement('input');
	oCheck.setAttribute('type','checkbox');
	oCheck.setAttribute('muser12',user_name);
	if (ischecked)
	{
		oCheck.setAttribute('checked','checked');
	}	
	oCheck.addEventListener('click',function(evt) {
		var u = evt.target.getAttribute('muser12');
		
	} ,true);
	oLi.appendChild(oCheck);
	

	$('#tools ul').append(oLi);
}

//----------------util----------------
function exec(eobj, delay) {
	var result = false;
	if (eobj.vals)	{
		//for(var i=eobj.vals.length-1;i>=0;i--) {
		result = result || setValue(eobj.vals);
		//}
	} 
	//var clickfunc = 
	if (delay)
	{
		setTimeout(clickfunc, delay);
	} else {
		result = clickfunc() || result;
	}
	
	return result;
}
function clickfunc() {
	var result = false;
	if (eobj.clicks)	{
		for(var i=eobj.clicks.length-1;i>=0;i--) {
			var namearr = eobj.clicks[i].split(",");
			for(var j=namearr.length-1;j>=0;j--) {	
				result = simulateClickEvent(namearr[j]) || result;
			}
		}
	}
	return result;
}
function setValue(nameValues) {
	var result = false;
	for(var i=nameValues.length-1;i>=0;i--) {	
		var namearr = nameValues[i][0].split(",");
		for(var j=namearr.length-1;j>=0;j--) {	
			var setobj = $(namearr[j]);
			if (debugJS){
				GM_log("set value:" + namearr[j]);
			}
			if (setobj.get(0)){
				setobj.val(nameValues[i][1]);
				result = true;
			}
		}		
	}
	return result;
}
var _elementWindow = window;
function saveConfig(){
	GM_setValue('config',JSON.stringify(NYNO.config));
}
function isObjExisted(obj) {
  	return (typeof(obj) != "undefined" && obj != null);
}
function simulateClickEvent(ename) {
	GM_log("click event:" + ename);
	var obj = $(ename).get(0);
	if (!isObjExisted(obj)) {
		return;
	}
	if (debugJS){
		GM_log("click element:" + ename);
	}
	//
	//clearInterval(intervalstart);
	if (document.createEvent) {		
		var evt = document.createEvent("MouseEvents");   
    	evt.initEvent("click", true, true);   
    	obj.dispatchEvent(evt);
		if (obj.getAttribute("href") != null) {
		   //event.returnValue = false;
		   //event.cancelBubble = true;
		   //if (_elementWindow != null) _elementWindow.eval("function _fn() {" + btn.getAttribute("href") + "} _fn()");
		}
	} else {
		obj.click();
	}
}
function saveConfig(){
	GM_setValue('config',JSON.stringify(NYNO.config));
}
 /* 
 * 用来遍历指定对象所有的属性名称和值
 * obj 需要遍历的对象
 */ 
 function allPrpos(obj) { 
	 // 用来保存所有的属性名称和值
	 var props = "";
	 // 开始遍历
	 for(var p in obj){ 
		 // 方法
		 if(typeof(obj[p])=="function"){ 
			 obj[p]();
		 }else{ 
			 // p 为属性名称，obj[p]为对应属性的值
			 props+= p + "=" + obj[p] + "\t";
		 } 
	 } 
	 // 最后显示所有的属性
	 alert(props);
 }
