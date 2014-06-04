// ==UserScript==
// @name        xiaomiPhone Helper
// @namespace   anyfly.com
// @description Help to xiaomi
// @include     *www.*mi.com/event/choose/phone/*//
// @include     *s1.mi.com/open/choosePhone*
// @include     *www.mi.com/buyphone/hongmi1s*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @require     http://noyesno.net/include/JSON.js
// @author      anyfly@gmail.com
// ==/UserScript==

//----------------data struts----------------
var debugJS = true;
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
//buildUI();

var indexVal = GM_getValue("indexVal", 0) + 1;
var ptype = 3;//$("#stepTypeLists li").size();
var tindex = ptype == 0 ? 0 : Math.floor(indexVal%ptype);
var vindex = ptype == 0 ? 0 : Math.floor(indexVal/ptype);

addRowText("<br/>ptype=" + ptype + ":indexVal=" + indexVal + ":tindex=" + tindex + ":vindex=" + vindex);

//setTimeout(startHelper, 1000);
if (ptype != 0 && indexVal >= ptype * 3 )
{
	indexVal = 0;
}
//GM_openInTab
//$(startHelper);
if (debugJS){
	GM_log("run user js...");
}
//exec({clicks:["#xmDmError:visible #xmDmReload"]}, delay_default_short);
//GM_setValue("indexVal", indexVal);
//----------------code here----------------
function buildUI() {
	addLeftSide(500);
	addTools();
}
function command(text, eggindex) {
	exec({clicks:["#stepTypeLists li:visible:eq("+(tindex)+")"]}, delay_default_short);
	exec({clicks:["#stepVersionLists li:visible:eq("+(vindex)+"),#stepVersionLists li:visible:first"]}, delay_default_short);
	exec({clicks:["#stepColorLists li:visible:eq(0)"]}, delay_default_short);
	exec({clicks:["#submitBtn", "div:visible #boxCacheBtn"]}, delay_default_short);
}
function startHelper() {
	if (debugJS){
		GM_log("execute...");
	}	
	setTimeout(command, 100);
	//document.evaluate("a.phoneSku=1");	
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
	GM_addStyle("#toolsuserjs {border:2px solid #3366cc; width:" + spanWidth + "px;position:fixed;top:50px;left:-" + (spanWidth - 5) + "px;text-align:left;padding:1em 0.3em;overflow:scroll;background-color:white;height:80%;}");
	GM_addStyle(" input.text1 {color: #000000;text-decoration: none;height: 19px;border: 1px solid #C8D6E1;font-family: 'Arial';vertical-align:middle;font-size:12px; text-indent:1px !important;text-indent:0;margin:1px 0px !important; margin:0;}");
	var eSidepane = document.createElement('div');
	eSidepane.setAttribute('id','toolsuserjs');
	eSidepane.innerHTML = '<span id="menu1"></span><hr/><ul id="list1"></ul><hr/><span id="body1"></span>'; 

	$(document.body).append(eSidepane);
	$("#toolsuserjs").hover(function(){
                $(this).animate({left:"0px"}, 200);
            }, function(){
                $(this).animate({left:"-" + (spanWidth - 5) + "px"}, 200);
           });
}
function timeReq() {
	times = 0;
	intervalstart = setTimeout(startHelper, 500);
}
function startReq() {
	times = 0;
	intervalstart = setInterval(startHelper, 500);
}
function stopReq() {
	clearInterval(intervalstart);
}
function addTools(){
	var parent = $("#toolsuserjs #menu1");
	addInput(parent);
	addToolsBtn(parent, "open", ";").addEventListener('click',function(evt) {
		timeReq();
	} ,true);
	addToolsBtn(parent, "start", ";").addEventListener('click',function(evt) {
		startReq();
	} ,true);
	addToolsBtn(parent, "stop", ";").addEventListener('click',function(evt) {
		stopReq();
	} ,true);
	addToolsBtn(parent, "clear", ";").addEventListener('click',function(evt) {
		clearAll();
	} ,true);
	addToolsBtn(parent, "save", ";").addEventListener('click',function(evt) {
		saveConfig();
	} ,true);	
}

function addInput(parent){
	var oinput = document.createElement('input');
	oinput.setAttribute('type','text');
	oinput.setAttribute('size','50');
	oinput.setAttribute('class','text1');
	oinput.addEventListener('keypress',function(evt) {
		var event = evt || unsafeWindow.event;
		switch (event.keyCode) {
			case 13: //Enter		
				addGood(this.value);
				this.value="";
				event.cancelBubble = true;
				event.returnValue = false;
				break;
			case 27: //Escape
				this.value="";
				event.cancelBubble = true;				
				break;
			default:
				break;
		}
	} ,true);	
	parent.append(oinput).append(document.createTextNode("  "));
	//oinput.setAttribute('type','text');
}
function addToolsBtn(parent, html, js){
	var a = document.createElement('a');	
	a.href="javascript:" + js;  
	a.innerHTML=html;         
    parent.append(a).append(document.createTextNode("  "));
	return a;
}
function addRowText(html1){
	//var oLi    = document.createElement('li');
	
	//$(oLi).html(html1);
	$('#toolsuserjs #body1').append(html1);
}
function addList(html1, gcode){
	var oLi    = document.createElement('li');
	if (gcode != "")
	{
	
	oLi.setAttribute('gcode',gcode);
	
	var a = document.createElement('a');	
	a.href=prefixUrl + gcode + suffixUrl;  
	a.innerHTML=(++liIndex) + "&nbsp;&nbsp;&nbsp;"+gcode; 
	a.setAttribute('target','_blank');	
	oLi.appendChild(a).appendChild(document.createTextNode("  "));
	a = document.createElement('a');	
	a.href="javascript:;";  
	a.innerHTML="delete"; 
	a.addEventListener('click',function(evt){
		$("#toolsuserjs ul li[gcode=" + gcode + "]").remove();
		delete NYNO.config.codes[gcode];		
		} ,true);
	oLi.appendChild(a).appendChild(document.createTextNode("  "));
	}
	//oLi.appendChild(document.createTextNode('('+gcode+') '));
	//$(oLi).html(html1);
	$('#toolsuserjs ul').append(oLi);
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
	var obj1 = $(ename);
	var obj = obj1.get(0);
	if (!isObjExisted(obj)) {
		return;
	}
	obj1.removeClass("item-sold");
	obj1.removeClass("btn-disabled");
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