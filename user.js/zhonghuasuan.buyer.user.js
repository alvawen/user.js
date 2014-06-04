// ==UserScript==
// @name        zhonghuasuan buyer Helper
// @namespace   anyfly.com
// @description Help to zhonghuasuan
// @include     *buyer.zhonghuasuan.com*
// @include     *list.zhonghuasuan.com*
// @include     *www.zhonghuasuan.com/yzcm/*
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
if (!NYNO.config.codes) 
{
	NYNO.config.codes = {};
}

NYNO.data = {};
var url = window.location.toString();
if (url.indexOf("list.zhonghuasuan") >= 0)
{
	insertToItem("p.goodsShow-cont-buy a", 5);	
} else if (url.indexOf("/yzcm") >= 0)
{
	insertToItem("div.list-wrap li a", 4);
}
var liIndex = 0;
var eobj = {};
//eobj = {clicks:[".btn-buy", ".aui_state_highlight"]};  
//71466 http://trade.zhonghuasuan.com/?gid=71466&callback=_jqjsp&_1397964290640=
//1397964391062                                                   1397964391062
//75842 http://trade.zhonghuasuan.com/?gid=75842&callback=_jqjsp&_1397963944828=
//_jqjsp({"success":true,"new_oid":"6775615"});

var prefixUrl = "http://detail.zhonghuasuan.com/";
var suffixUrl = ".html";
//specialValiCode
var intervalstart = null;//setInterval(startHelper, 1*1000);
//var goodcode = window.location.pathname.replace('/', '').replace('.html', '');
//var goodcode = "http://detail.zhonghuasuan.com/94085.html".replace('http://detail.zhonghuasuan.com/', '').replace('.html', '');
var success = false;
var times = 0;
buildUI();
//$(startHelper);
//var n = 0; var max =
//----------------code here----------------
function insertToItem(selector, t) {	
	$(selector).each(function(i,el){
		var obj = $(el);
		//obj.after("");
		var a = document.createElement('a');	
		a.href="javascript:;";  
		a.innerHTML="add"; 
		a.addEventListener('click',function(evt){addGood(el.href) } ,true);
		if (t == 1) {
			obj.before(a);
		} else if (t == 2) {
			obj.append(a);
		} else if (t == 3) {
			obj.after(a);
		} else if (t == 5) {
			a = document.createElement('label');	
			a.setAttribute("style", "cursor:pointer");
			a.innerHTML="&nbsp;&nbsp;add&nbsp;&nbsp;"; 
			a.addEventListener('click',function(evt){addGood(el.href);$(this).css("text-decoration", "line-through"); } ,true);
			obj.parent().find("span:first").prepend(a);
		} else if (t == 4) {
			//obj.next().find("p:last").append(document.createTextNode("123"));
			a = document.createElement('i');	
			a.setAttribute("style", "cursor:pointer");
			a.innerHTML="add"; 
			a.addEventListener('click',function(evt){addGood(el.href) } ,true);
			obj.next().find("p:last").prepend(a);
		}
		
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
function clearAll() {
	clearInterval(intervalstart);
	$('#toolsuserjs ul').html("");
	NYNO.config.codes = {};
	saveConfig();
}
function buildUI() {
	addLeftSide(500);
	addTools();
	for(var code in NYNO.config.codes){
		addList("", code);
	}
	addList("", "");
}
function startHelper() {
	//GM_log("11111",2);;exec(eobj)
	for(var code in NYNO.config.codes){
		//alert(code);
		firstRequest(code);
	}
	addRowText("  " + ++times);
	if (success) 
	{
		clearInterval(intervalstart)
		//alert("success");
	}	
	
} 
function firstRequest(code) {		
	GM_xmlhttpRequest({
	method: 'GET',
	url: 'http://trade.zhonghuasuan.com/?gid='+code+'&callback=_jqjsp&_'+new Date().getTime()+'=',
	headers: {	
		"Accept": "*/*",		
		"Accept-Encoding": "gzip, deflate",
		"Accept-Language": "en-US,zh-cn;q=0.5",
		"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; QQDownload 731; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; InfoPath.3; .NET4.0C; .NET4.0E)"
	},	
	onload: firstResponse,
	context: {
            goodcode: code           
    }
	});
}
function firstResponse(response) {
	var context = response.context || this.context || context;
	
	var text = response.responseText;
	if (debugJS){
		GM_log("first response ..."+ text);
	}
	//try{window.eval("window."+text);}catch(e){};
	if (text.indexOf('success":true') >=0 || text.indexOf('BUY_REPEAT') >=0 || text.indexOf('BUY_TOO_MANY_YZCM') >=0)
	{
		if (context.goodcode)
		{
			successGood(context.goodcode);
		}
	} 	
	return false;	
}
function successGood(gcode) {
	delete NYNO.config.codes[gcode];	
	$("#toolsuserjs ul li[gcode=" + gcode + "]").css("text-decoration", "line-through");
	//addList("", code);
}
function addGood(code) {
	if (NYNO.config.codes[code])
	{
		return;
	}
	code = code.replace(prefixUrl, '').replace(suffixUrl, '');
	NYNO.config.codes[code] = 1;
	addList("", code);
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
function addTools(){
	var parent = $("#toolsuserjs #menu1");
	addInput(parent);
	addToolsBtn(parent, "one", ";").addEventListener('click',function(evt) {
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
