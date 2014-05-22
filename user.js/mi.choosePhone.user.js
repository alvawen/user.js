// ==UserScript==
// @name        xiaomiPhone Helper
// @namespace   anyfly.com
// @description Help to xiaomi
// @include     *www.*mi.com/event/choose/phone/*//
// @include     *s1.mi.com/open/choosePhone*
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
var url = window.location.toString();
var delay_default = 200;
var delay_default_short = 50;
var delay_default_long = 800;
addLeftSide(300);

var indexVal = GM_getValue("indexVal", 0) + 1;
var ptype = 3;//$("#stepTypeLists li").size();
var tindex = ptype == 0 ? 0 : Math.floor(indexVal%ptype);
var vindex = ptype == 0 ? 0 : Math.floor(indexVal/ptype);

addRow("ptype=" + ptype + ":indexVal=" + indexVal + ":tindex=" + tindex + ":vindex=" + vindex);

setTimeout(startHelper, 1000);

if (ptype != 0 && indexVal >= ptype * 3 )
{
	indexVal = 0;
}
//GM_openInTab
//$(startHelper);
if (debugJS){
	GM_log("run user js...");
}
GM_setValue("indexVal", indexVal);
//----------------code here----------------
function command(text, eggindex) {
	exec({clicks:["#stepTypeLists li:eq("+(tindex)+")"]}, delay_default_short);
	exec({clicks:["#stepVersionLists li:eq("+(vindex)+"),#stepVersionLists li:first"]}, delay_default_short);
	exec({clicks:["#stepColorLists li:eq(0)"]}, delay_default_short);
	exec({clicks:["#submitBtn", ":visible #boxCacheBtn"]}, delay_default_short);
}
function startHelper() {
	if (debugJS){
		GM_log("execute...");
	}	
	setInterval(command, 100);
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
	var oLi = document.createElement('span');
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
		result = setValue(eobj.vals, ) || result;
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
 * ��������ָ���������е��������ƺ�ֵ
 * obj ��Ҫ�����Ķ���
 */ 
 function allPrpos(obj) { 
	 // �����������е��������ƺ�ֵ
	 var props = "";
	 // ��ʼ����
	 for(var p in obj){ 
		 // ����
		 if(typeof(obj[p])=="function"){ 
			 obj[p]();
		 }else{ 
			 // p Ϊ�������ƣ�obj[p]Ϊ��Ӧ���Ե�ֵ
			 props+= p + "=" + obj[p] + "\t";
		 } 
	 } 
	 // �����ʾ���е�����
	 alert(props);
 }