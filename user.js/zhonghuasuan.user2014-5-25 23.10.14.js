// ==UserScript==
// @name        zhonghuasuan Helper
// @namespace   anyfly.com
// @description Help to zhonghuasuan
// @include     *detail.zhonghuasuan.com/*.html
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @require     http://noyesno.net/include/JSON.js
// @author      anyfly@gmail.com
// ==/UserScript==
//----------------data struts----------------
var NYNO = {};
var debugJS = false;
//class="btn-buy"
NYNO.config = JSON.parse(GM_getValue('config','{}'));
if (!NYNO.config.haveConfig)
{
	NYNO.config.haveConfig = true;	
	saveConfig();
}
NYNO.data = {};
var url = window.location.toString();
var eobj = {};
eobj = {clicks:[".btn-buy", ".aui_state_highlight"]};  
//71466 http://trade.zhonghuasuan.com/?gid=71466&callback=_jqjsp&_1397964290640=
//1397964391062                                                   1397964391062
//75842 http://trade.zhonghuasuan.com/?gid=75842&callback=_jqjsp&_1397963944828=
//_jqjsp({"success":true,"new_oid":"6775615"});

addLeftSide(500);

var intervalstart = setInterval(startHelper, 1*1000);
var goodcode = window.location.pathname.replace('/', '').replace('.html', '');
var success = false;
//$(startHelper);
//var n = 0; var max =
//----------------code here----------------
function startHelper() {
	//GM_log("11111",2);;exec(eobj)
	firstRequest();
	if (success) 
	{
		clearInterval(intervalstart)
		alert("success");
	}	
	
} 
function firstRequest() {		
	GM_xmlhttpRequest({
	method: 'GET',
	url: 'http://trade.zhonghuasuan.com/?gid='+goodcode+'&callback=_jqjsp&_'+new Date().getTime()+'=',
	headers: {	
		"Accept": "*/*",		
		"Accept-Encoding": "gzip, deflate",
		"Accept-Language": "en-US,zh-cn;q=0.5",
		"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; QQDownload 731; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; InfoPath.3; .NET4.0C; .NET4.0E)"
	},	
	onload: firstResponse
	});
}
function firstResponse(response) {	
	//var json = eval("(" + response.responseText + ")");
	var text = response.responseText;
	if (debugJS){
		GM_log("first response ..."+ text);
	}
	try{window.eval("window."+text);}catch(e){};
	if (text.indexOf('success":true') >=0 || text.indexOf('BUY_REPEAT') >=0)
	{
		clearInterval(intervalstart)
		alert("success");
		return true;
	} 
	addRow(text);
	//else if (text.indexOf('errcode') >=0) {
		//GM_log("first response ..."+ text);
		//clearInterval(intervalstart)
		//alert("errcode");
	//}
	return false;	
}
//----------------left side----------------
function addLeftSide(spanWidth) {
	GM_addStyle("#tools {border:2px solid #3366cc; width:" + spanWidth + "px;position:fixed;top:10px;left:-" + (spanWidth - 5) + "px;text-align:left;padding:1em 0.3em;overflow:scroll;background-color:white;height:96%;}");
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
	var oLi    = document.createElement('li');
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
	oLi.appendChild(oCheck);
	*/
	$(oLi).html(html1);
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
