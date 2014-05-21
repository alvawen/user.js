// ==UserScript==

// @name        xiaomi
// @namespace   anyfly.com
// @include     http://static.xiaomi.cn/515
// @version     1
// @grant       none
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
var url = window.location.toString();
var delay_default = 200;
var delay_default_short = 50;
var delay_default_long = 800;
var intervalstart = setInterval(startHelper, 300);
//$(startHelper);
if (debugJS){
	GM_log("run user js...");
}
//----------------code here----------------
function command(text, eggindex) {
	exec({vals:[['#commentContent',text]], 
	clicks:["#sentBtn"]}, delay_default_short);
	exec({clicks:[".egg[data-index=" + eggindex + "]"]}, delay_default);
	exec({clicks:[".close",".playagain"]}, delay_default_short);
}
function startHelper() {
	if (debugJS){
		GM_log("execute...");
	}
	command("1267abc123xasd2", 3); 	
	command("abc123456", 2); 
	command("1abc234addf", 1); 
	
} 
//----------------ajax----------------
function getRequest(url1, callbackfunc) {		
	GM_xmlhttpRequest({
	method: 'GET',
	url: url1,
	headers: {	
		"Accept": "*/*",		
		"Accept-Encoding": "gzip, deflate",
		"Accept-Language": "en-US,zh-cn;q=0.5",
		"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; QQDownload 731; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; InfoPath.3; .NET4.0C; .NET4.0E)"
	},	
	onload: callbackfunc
	});
}
function processResponse(response) {	
	//var json = eval("(" + response.responseText + ")");
	var text = response.responseText;
	if (debugJS){
		GM_log("response ..."+ text);
	}
	addRow(text);
	//try{window.eval("window."+text);}catch(e){};
}
//----------------left side----------------
function addLeftSide(spanWidth) {
	GM_addStyle("#tools {border:2px solid #3366cc; width:" + spanWidth + "px;position:fixed;top:15px;left:-" + (spanWidth - 5) + "px;text-align:left;padding:1em 0.3em;overflow:scroll;background-color:white;height:96%;}");
	var eSidepane = document.createElement('div');
	eSidepane.setAttribute('id','tools');
	eSidepane.innerHTML = '<span></span><hr/><ul></ul>'; 

	$(document.body).append(eSidepane);
	$("#tools").hover(function(){
                $(this).animate({left:"0px"}, 200);
            }, function(){
                $(this).animate({left:"-" + (spanWidth - 5) + "px"}, 200);
           });
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
function addRow(html1){
	var oLi = document.createElement('li');
/*
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
	oLi.appendChild(oCheck);*/
	$(oLi).html(html1);	

	$('#tools ul').append(oLi);
}

//----------------util----------------
function exec(eobj, delay) {
	var result = false;
	if (eobj.vals)	{
		//for(var i=eobj.vals.length-1;i>=0;i--) {
		result = setValue(eobj.vals) || result;
		//}
	} 
	//var clickfunc = 
	if (delay)
	{
		setTimeout(function(){clickfunc(eobj.clicks);}, delay);
	} else {
		result = clickfunc(eobj.clicks) || result;
	}
	
	return result;
}
function clickfunc(clicks) {
	var result = false;
	if (clicks)	{
		for(var i=clicks.length-1;i>=0;i--) {
			var namearr = clicks[i].split(",");
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
			if (setobj.get(0)){
				if (debugJS){
					GM_log("set value:" + namearr[j]);
				}
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
