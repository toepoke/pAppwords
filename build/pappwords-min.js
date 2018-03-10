!function(){"use strict";function t(t){t?(f[0]=f[16]=f[1]=f[2]=f[3]=f[4]=f[5]=f[6]=f[7]=f[8]=f[9]=f[10]=f[11]=f[12]=f[13]=f[14]=f[15]=0,this.blocks=f):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.h0=1732584193,this.h1=4023233417,this.h2=2562383102,this.h3=271733878,this.h4=3285377520,this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}var h="object"==typeof window?window:{},s=!h.JS_SHA1_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;s&&(h=global);var i=!h.JS_SHA1_NO_COMMON_JS&&"object"==typeof module&&module.exports,e="function"==typeof define&&define.amd,r="0123456789abcdef".split(""),o=[-2147483648,8388608,32768,128],n=[24,16,8,0],a=["hex","array","digest","arrayBuffer"],f=[],u=function(e){return function(s){return new t(!0).update(s)[e]()}},c=function(){var e=u("hex");s&&(e=p(e)),e.create=function(){return new t},e.update=function(t){return e.create().update(t)};for(var r=0;r<a.length;++r){var i=a[r];e[i]=u(i)}return e},p=function(t){var h=eval("require('crypto')"),s=eval("require('buffer').Buffer"),i=function(e){if("string"==typeof e)return h.createHash("sha1").update(e,"utf8").digest("hex");if(e.constructor===ArrayBuffer)e=new Uint8Array(e);else if(void 0===e.length)return t(e);return h.createHash("sha1").update(new s(e)).digest("hex")};return i};t.prototype.update=function(t){if(!this.finalized){var e="string"!=typeof t;e&&t.constructor===h.ArrayBuffer&&(t=new Uint8Array(t));for(var s,a,r=0,i=t.length||0,o=this.blocks;r<i;){if(this.hashed&&(this.hashed=!1,o[0]=this.block,o[16]=o[1]=o[2]=o[3]=o[4]=o[5]=o[6]=o[7]=o[8]=o[9]=o[10]=o[11]=o[12]=o[13]=o[14]=o[15]=0),e)for(a=this.start;r<i&&a<64;++r)o[a>>2]|=t[r]<<n[3&a++];else for(a=this.start;r<i&&a<64;++r)(s=t.charCodeAt(r))<128?o[a>>2]|=s<<n[3&a++]:s<2048?(o[a>>2]|=(192|s>>6)<<n[3&a++],o[a>>2]|=(128|63&s)<<n[3&a++]):s<55296||s>=57344?(o[a>>2]|=(224|s>>12)<<n[3&a++],o[a>>2]|=(128|s>>6&63)<<n[3&a++],o[a>>2]|=(128|63&s)<<n[3&a++]):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++r)),o[a>>2]|=(240|s>>18)<<n[3&a++],o[a>>2]|=(128|s>>12&63)<<n[3&a++],o[a>>2]|=(128|s>>6&63)<<n[3&a++],o[a>>2]|=(128|63&s)<<n[3&a++]);this.lastByteIndex=a,this.bytes+=a-this.start,a>=64?(this.block=o[16],this.start=a-64,this.hash(),this.hashed=!0):this.start=a}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,e=this.lastByteIndex;t[16]=this.block,t[e>>2]|=o[3&e],this.block=t[16],e>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.hBytes<<3|this.bytes>>>29,t[15]=this.bytes<<3,this.hash()}},t.prototype.hash=function(){var t,e,s=this.h0,a=this.h1,r=this.h2,i=this.h3,o=this.h4,n=this.blocks;for(t=16;t<80;++t)e=n[t-3]^n[t-8]^n[t-14]^n[t-16],n[t]=e<<1|e>>>31;for(t=0;t<20;t+=5)s=(e=(a=(e=(r=(e=(i=(e=(o=(e=s<<5|s>>>27)+(a&r|~a&i)+o+1518500249+n[t]<<0)<<5|o>>>27)+(s&(a=a<<30|a>>>2)|~s&r)+i+1518500249+n[t+1]<<0)<<5|i>>>27)+(o&(s=s<<30|s>>>2)|~o&a)+r+1518500249+n[t+2]<<0)<<5|r>>>27)+(i&(o=o<<30|o>>>2)|~i&s)+a+1518500249+n[t+3]<<0)<<5|a>>>27)+(r&(i=i<<30|i>>>2)|~r&o)+s+1518500249+n[t+4]<<0,r=r<<30|r>>>2;for(;t<40;t+=5)s=(e=(a=(e=(r=(e=(i=(e=(o=(e=s<<5|s>>>27)+(a^r^i)+o+1859775393+n[t]<<0)<<5|o>>>27)+(s^(a=a<<30|a>>>2)^r)+i+1859775393+n[t+1]<<0)<<5|i>>>27)+(o^(s=s<<30|s>>>2)^a)+r+1859775393+n[t+2]<<0)<<5|r>>>27)+(i^(o=o<<30|o>>>2)^s)+a+1859775393+n[t+3]<<0)<<5|a>>>27)+(r^(i=i<<30|i>>>2)^o)+s+1859775393+n[t+4]<<0,r=r<<30|r>>>2;for(;t<60;t+=5)s=(e=(a=(e=(r=(e=(i=(e=(o=(e=s<<5|s>>>27)+(a&r|a&i|r&i)+o-1894007588+n[t]<<0)<<5|o>>>27)+(s&(a=a<<30|a>>>2)|s&r|a&r)+i-1894007588+n[t+1]<<0)<<5|i>>>27)+(o&(s=s<<30|s>>>2)|o&a|s&a)+r-1894007588+n[t+2]<<0)<<5|r>>>27)+(i&(o=o<<30|o>>>2)|i&s|o&s)+a-1894007588+n[t+3]<<0)<<5|a>>>27)+(r&(i=i<<30|i>>>2)|r&o|i&o)+s-1894007588+n[t+4]<<0,r=r<<30|r>>>2;for(;t<80;t+=5)s=(e=(a=(e=(r=(e=(i=(e=(o=(e=s<<5|s>>>27)+(a^r^i)+o-899497514+n[t]<<0)<<5|o>>>27)+(s^(a=a<<30|a>>>2)^r)+i-899497514+n[t+1]<<0)<<5|i>>>27)+(o^(s=s<<30|s>>>2)^a)+r-899497514+n[t+2]<<0)<<5|r>>>27)+(i^(o=o<<30|o>>>2)^s)+a-899497514+n[t+3]<<0)<<5|a>>>27)+(r^(i=i<<30|i>>>2)^o)+s-899497514+n[t+4]<<0,r=r<<30|r>>>2;this.h0=this.h0+s<<0,this.h1=this.h1+a<<0,this.h2=this.h2+r<<0,this.h3=this.h3+i<<0,this.h4=this.h4+o<<0},t.prototype.hex=function(){this.finalize();var t=this.h0,e=this.h1,s=this.h2,a=this.h3,i=this.h4;return r[t>>28&15]+r[t>>24&15]+r[t>>20&15]+r[t>>16&15]+r[t>>12&15]+r[t>>8&15]+r[t>>4&15]+r[15&t]+r[e>>28&15]+r[e>>24&15]+r[e>>20&15]+r[e>>16&15]+r[e>>12&15]+r[e>>8&15]+r[e>>4&15]+r[15&e]+r[s>>28&15]+r[s>>24&15]+r[s>>20&15]+r[s>>16&15]+r[s>>12&15]+r[s>>8&15]+r[s>>4&15]+r[15&s]+r[a>>28&15]+r[a>>24&15]+r[a>>20&15]+r[a>>16&15]+r[a>>12&15]+r[a>>8&15]+r[a>>4&15]+r[15&a]+r[i>>28&15]+r[i>>24&15]+r[i>>20&15]+r[i>>16&15]+r[i>>12&15]+r[i>>8&15]+r[i>>4&15]+r[15&i]},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,e=this.h1,s=this.h2,a=this.h3,r=this.h4;return[t>>24&255,t>>16&255,t>>8&255,255&t,e>>24&255,e>>16&255,e>>8&255,255&e,s>>24&255,s>>16&255,s>>8&255,255&s,a>>24&255,a>>16&255,a>>8&255,255&a,r>>24&255,r>>16&255,r>>8&255,255&r]},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(20),e=new DataView(t);return e.setUint32(0,this.h0),e.setUint32(4,this.h1),e.setUint32(8,this.h2),e.setUint32(12,this.h3),e.setUint32(16,this.h4),t};var y=c();i?module.exports=y:(h.sha1=y,e&&define(function(){return y}))}();var PasswordData={url:"",suffix:"",prefix:"",sha:"",password:"",aside:null,checkComplete:null,isPwned:!1,hits:0,prettyHits:""},PasswordChecker={queryApi:function(t,e,s){var a=new XMLHttpRequest;a.open("GET",t,!0),a.onreadystatechange=function(){4==a.readyState&&200==a.status&&s(e,a)},a.send()},parseResponse:function(t,e){var s=e.responseText,a=s.indexOf(t.suffix);if(t.isPwned=!1,t.hits=null,t.prettyHits=null,a<0)return t;var r=s.indexOf(":",a),i=s.indexOf("\n",r),o=s.substring(r+1,i);return t.isPwned=!0,t.hits=parseInt(o),t.prettyHits=t.hits.toLocaleString(),t},checkForPawnage:function(t,e,s){var a="",r=new Object;return r.sha=sha1(t),r.checkComplete=s,r.password=t,r.aside=e,!(!r.sha||""===r.sha)&&(r.sha=r.sha.toUpperCase(),r.prefix=r.sha.substring(0,5),r.suffix=r.sha.substring(5),a="https://api.pwnedpasswords.com/range/"+r.prefix,this.queryApi(a,r,function(t,e){PasswordChecker.parseResponse(t,e);t.checkComplete&&t.checkComplete(t)}))}},PappwordsConfig={DEBUG:!1,FAILURE_PERCENTAGE_DEFAULT:33,WARN_ONLY_DEFAULT:!1,CLEAR_PASSWORD_FIELDS_DEFAULT:!0,SHOW_DIALOG:!0,MESSAGE_DEFAULT:"<p>This password has previously appeared in a data breach.</p><p>It has appeared {PRETTY-COUNT} time(s).</p><p>Please use a more secure alternative.</p>",onComplete:null,getMessage:function(){return PappwordsConfig.MESSAGE_DEFAULT},getWarnOnly:function(){return PappwordsConfig.WARN_ONLY_DEFAULT},getClearPasswords:function(){return PappwordsConfig.CLEAR_PASSWORD_FIELDS_DEFAULT},getFailurePercentage:function(){return PappwordsConfig.FAILURE_PERCENTAGE_DEFAULT},getShowDialog:function(){return this.SHOW_DIALOG},translateMessage:function(t,e){var s=this.getMessage();return s=(s=s.replace("{COUNT}",t)).replace("{PRETTY-COUNT}",e)},showSettings:function(){this.DEBUG&&console.info("settings",{warnOnly:this.getWarnOnly(),showDialog:this.getShowDialog(),clearPasswords:this.getClearPasswords(),failurePercentage:this.getFailurePercentage(),message:this.getMessage()})},applyOverrides:function(t){t&&(this.MESSAGE_DEFAULT=t.message||this.MESSAGE_DEFAULT,this.FAILURE_PERCENTAGE_DEFAULT=t.failurePercentage||this.FAILURE_PERCENTAGE_DEFAULT,this.WARN_ONLY_DEFAULT=t.warnOnly||this.WARN_ONLY_DEFAULT,this.CLEAR_PASSWORD_FIELDS_DEFAULT=t.clearPasswordFields||this.CLEAR_PASSWORD_FIELDS_DEFAULT,this.onComplete=t.onComplete||this.onComplete,!1===t.showDialog&&(this.SHOW_DIALOG=t.showDialog),!0===t.warnOnly&&(this.WARN_ONLY_DEFAULT=t.warnOnly))}},Pappwords={_activeForm:null,findPasswordFields:function(){if(document.querySelectorAll)return document.querySelectorAll("input[type='password']");for(var t=[],e=document.getElementsByTagName("input"),s=0;s<e.length;s++)"password"===e[s].type.toLowerCase()&&t.push(e[s]);return t},findPasswordForms:function(t){var e=[];for(var s in t){for(var a=t[s];null!=a.parentElement&&"form"!==a.tagName.toLowerCase();)a=a.parentElement;if(a&&a.tagName&&"form"===a.tagName.toLowerCase()){var r=!0;for(var i in e){e[i]==a&&(r=!1)}r&&e.push(a)}}return e},onSubmit:function(t){var e=t.currentTarget.querySelectorAll("input[type='password']"),s=[],a=e.length,r=0,i=0,o=0,n="";Pappwords._activeForm=t.target;for(var h=0;h<e.length;h++){var p=e[h],l=p.value;0!=l.length&&PasswordChecker.checkForPawnage(l,{field:p},function(t){if(i++,t.isPwned&&(r++,s.push(t.password),t.hits>o&&(o=t.hits,n=t.prettyHits)),i===a){var h=!1;if(t.message=PappwordsConfig.translateMessage(o,n),r/a*100>=PappwordsConfig.getFailurePercentage()&&(h=!0),h&&PappwordsConfig.getClearPasswords())for(var p=0;p<s.length;p++)for(var l=s[p],d=0;d<e.length;d++){var c=e[d];c.value===l&&(c.value="")}if(h&&PappwordsConfig.SHOW_DIALOG&&PappwordsModal.openPwndDialog(t.message,function(){PappwordsConfig.getWarnOnly()&&Pappwords._activeForm.submit()}),PappwordsConfig.onComplete){PappwordsConfig.translateMessage(o,n);PappwordsConfig.onComplete(t)}}})}return t.preventDefault(),!1},onLoad:function(t){PappwordsConfig.applyOverrides(t),PappwordsConfig.showSettings();var e=Pappwords.findPasswordFields(),s=Pappwords.findPasswordForms(e);for(var a in s){s[a].addEventListener("submit",Pappwords.onSubmit)}}};document.addEventListener("DOMContentLoaded",function(){Pappwords.onLoad()});var PappwordsModal={_overlay:null,_modal:null,_closeButton:null,_okButton:null,_modalHtml:null,_onClose:null,closePwndDialog:function(){_modal.classList.add("animated","fadeOut"),_overlay.classList.add("animated","fadeOut"),setTimeout(function(){var t=document.querySelector(".pappwords-dialog");null!=t&&document.body.removeChild(t)},800),_onClose&&_onClose()},openPwndDialog:function(t,e){this.attachDialog(t),_overlay.classList.remove("app-hide"),_modal.classList.remove("app-hide"),_overlay.classList.add("animated","fadeIn"),_modal.classList.add("animated","fadeIn"),e&&(_onClose=e)},attachDialog:function(t){var e=this.getModalDialog();e=e.replace("{MODAL-CONTENT}",t);var s=document.createElement("div");s.classList.add("pappwords-dialog"),s.innerHTML=e,document.body.appendChild(s),_overlay=document.querySelector(".app-modal-overlay"),_modal=document.querySelector(".app-modal-container"),_closeButton=document.querySelector("a.app-modal-closer"),_okButton=document.getElementById("app-modal-ok"),_closeButton.addEventListener("click",this.closePwndDialog),_okButton.addEventListener("click",this.closePwndDialog);var a=this;document.addEventListener("keyup",function(t){27===t.keyCode&&a.closePwndDialog()})},getModalDialog:function(){return'<div class="app-modal-overlay app-hide"></div><div class="app-modal-container app-hide"><div class="app-modal"><div class="app-modal-header"><a class="app-modal-closer" href="#">X</a><div class="app-modal-title app-modal-bar"><h1>Pawned Password</h1></div></div><div class="app-modal-content-container"><div class="app-modal-warning"><span class="app-modal-icon">!</span></div><div class="app-modal-content">{MODAL-CONTENT}</div></div><div class="app-clear"></div><div class="app-modal-footer"><input id="app-modal-ok" type="button" value="Ok" class="app-modal-ok app-float-right"><div class="app-clear"></div><div class="app-modal-bar"><p class="app-float-left app-inline">Password check by <a href="https://haveibeenpwned.com">haveibeenpwned.com</a></p><p class="app-float-right app-inline">Build with <span class="app-modal-heart">&hearts;</span> by <a href="https://toepoke.co.uk">toepoke.co.uk</a></p><div class="app-clear"></div></div></div></div></div>'}};
