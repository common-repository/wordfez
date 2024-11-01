function createCookie(name,value,days) {
if (days) {
var date = new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var expires = "; expires="+date.toGMTString();
}
else expires = "";
document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
var nameEQ = name + "=";
var ca = document.cookie.split(';');
for(var i=0;i < ca.length;i++) {
var c = ca[i];
while (c.charAt(0)==' ') c = c.substring(1,c.length);
if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
}
return null;
}

function language(lang_on, lang_off) {
createCookie("langue_on",lang_on,365);
createCookie("langue_off",lang_off,365);
for (var i=0; i<document.getElementsByTagName("span").length; i++ ) {
if (document.getElementsByTagName("span")[i].lang == lang_on) {
document.getElementsByTagName("span")[i].style.display="block";
}
if (document.getElementsByTagName("span")[i].lang == lang_off) {
document.getElementsByTagName("span")[i].style.display="none";
}
}
}

function startlanguage() {
var notdefined;
var lang_on = readCookie("langue_on");
var lang_off = readCookie("langue_off");
if (lang_on == notdefined) {lang_on = "fr";}
if (lang_off == notdefined) {lang_off = "en";}
language(lang_on,lang_off);
}

function langaddLoadEvent(func) {
var oldonload = window.onload;
if (typeof window.onload != 'function') {
window.onload = func;
} else {
window.onload = function() {
if (oldonload) {
oldonload();
}
func();
}
}
}

langaddLoadEvent(startlanguage);