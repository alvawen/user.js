// ==UserScript==
// @name        zhonghuasuan Helper
// @namespace   anyfly.com
// @description Help to zhonghuasuan
// @include     *detail.zhonghuasuan.com/76415.html
// @include     *detail.zhonghuasuan.com/77319.html
// @include     *detail.zhonghuasuan.com/76983.html
// @include     *detail.zhonghuasuan.com/73178.html
// @include     *detail.zhonghuasuan.com/75368.html
// @include     *detail.zhonghuasuan.com/77459.html
// @include     *detail.zhonghuasuan.com/76992.html
// @include     *detail.zhonghuasuan.com/*.html
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @require     http://noyesno.net/include/JSON.js
// @author      anyfly@gmail.com
// ==/UserScript==
//----------------data struts----------------
var NYNO = {};
//class="btn-buy"
NYNO.config = JSON.parse(GM_getValue('config','{}'));
if (!NYNO.config.haveConfig)
{
	NYNO.config.haveConfig = true;	
	saveConfig();
}
NYNO.data = {};
var host = window.location.host;
var eobj = {};
eobj = {clicks:[".btn-buy", ".aui_state_highlight"]};  

var intervalstart = setTimeout(startHelper, 2*1000);
//$(startHelper);
//var n = 0; var max =
//----------------code here----------------
function startHelper() {
	//GM_log("11111",2);
	if (exec(eobj))
	{
		clearInterval(intervalstart)
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
		result = result || clickfunc();
	}
	
	return result;
}
function clickfunc() {
	var result = false;
	if (eobj.clicks)	{
		for(var i=eobj.clicks.length-1;i>=0;i--) {
			result = result || simulateClickEvent($(eobj.clicks[i]).get(0));
		}
	}
	return result;
}
function setValue(nameValues) {
	for(var i=nameValues.length-1;i>=0;i--) {	
		var setobj = $(nameValues[i][0]);
		if (setobj.get(0)){
			setobj.val(nameValues[i][1]);
			return true;
		}
		
	}
	return false;
}
var _elementWindow = window;
function saveConfig(){
	GM_setValue('config',JSON.stringify(NYNO.config));
}
function isObjExisted(obj) {
  	return (typeof(obj) != "undefined" && obj != null);
}
function simulateClickEvent(obj) {
	if (!isObjExisted(obj)) {
		return;
	}
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
