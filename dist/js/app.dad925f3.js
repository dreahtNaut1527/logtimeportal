(function(e){function t(t){for(var n,s,i=t[0],c=t[1],d=t[2],f=0,u=[];f<i.length;f++)s=i[f],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&u.push(o[s][0]),o[s]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);l&&l(t);while(u.length)u.shift()();return r.push.apply(r,d||[]),a()}function a(){for(var e,t=0;t<r.length;t++){for(var a=r[t],n=!0,s=1;s<a.length;s++){var i=a[s];0!==o[i]&&(n=!1)}n&&(r.splice(t--,1),e=c(c.s=a[0]))}return e}var n={},s={app:0},o={app:0},r=[];function i(e){return c.p+"js/"+({about:"about"}[e]||e)+"."+{about:"b1d065b2"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,c),a.l=!0,a.exports}c.e=function(e){var t=[],a={about:1};s[e]?t.push(s[e]):0!==s[e]&&a[e]&&t.push(s[e]=new Promise((function(t,a){for(var n="css/"+({about:"about"}[e]||e)+"."+{about:"51bd0f8a"}[e]+".css",o=c.p+n,r=document.getElementsByTagName("link"),i=0;i<r.length;i++){var d=r[i],f=d.getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(f===n||f===o))return t()}var u=document.getElementsByTagName("style");for(i=0;i<u.length;i++){d=u[i],f=d.getAttribute("data-href");if(f===n||f===o)return t()}var l=document.createElement("link");l.rel="stylesheet",l.type="text/css",l.onload=t,l.onerror=function(t){var n=t&&t.target&&t.target.src||o,r=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");r.code="CSS_CHUNK_LOAD_FAILED",r.request=n,delete s[e],l.parentNode.removeChild(l),a(r)},l.href=o;var m=document.getElementsByTagName("head")[0];m.appendChild(l)})).then((function(){s[e]=0})));var n=o[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise((function(t,a){n=o[e]=[t,a]}));t.push(n[2]=r);var d,f=document.createElement("script");f.charset="utf-8",f.timeout=120,c.nc&&f.setAttribute("nonce",c.nc),f.src=i(e);var u=new Error;d=function(t){f.onerror=f.onload=null,clearTimeout(l);var a=o[e];if(0!==a){if(a){var n=t&&("load"===t.type?"missing":t.type),s=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\n("+n+": "+s+")",u.name="ChunkLoadError",u.type=n,u.request=s,a[1](u)}o[e]=void 0}};var l=setTimeout((function(){d({type:"timeout",target:f})}),12e4);f.onerror=f.onload=d,document.head.appendChild(f)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,a){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(c.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(a,n,function(t){return e[t]}.bind(null,n));return a},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/logtimeportal/",c.oe=function(e){throw console.error(e),e};var d=window["webpackJsonp"]=window["webpackJsonp"]||[],f=d.push.bind(d);d.push=t,d=d.slice();for(var u=0;u<d.length;u++)t(d[u]);var l=f;r.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},4678:function(e,t,a){var n={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn-bd":"9686","./bn-bd.js":"9686","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-in":"ec2e","./en-in.js":"ec2e","./en-nz":"6f50","./en-nz.js":"6f50","./en-sg":"b7e9","./en-sg.js":"b7e9","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-mx":"b5b7","./es-mx.js":"b5b7","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fil":"d69a","./fil.js":"d69a","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-deva":"aaf2","./gom-deva.js":"aaf2","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./oc-lnc":"167b","./oc-lnc.js":"167b","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tk":"5aff","./tk.js":"5aff","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-mo":"3a6c","./zh-mo.js":"3a6c","./zh-tw":"90ea","./zh-tw.js":"90ea"};function s(e){var t=o(e);return a(t)}function o(e){if(!a.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}s.keys=function(){return Object.keys(n)},s.resolve=o,e.exports=s,s.id="4678"},"56d7":function(e,t,a){"use strict";a.r(t),a.d(t,"SocketInstance",(function(){return ne}));a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("2b0e"),s=a("bc3a"),o=a.n(s),r=a("6821"),i=a.n(r),c=a("3d20"),d=a.n(c),f=a("c1df"),u=a.n(f),l=a("8e27"),m=a.n(l),b=a("5132"),p=a.n(b),j=a("b6d0"),h=a("19de"),g=a.n(h),v=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",{attrs:{id:"inspire"}},[void 0!=e.logtimeuserinfo.EmployeeCode?a("navdrawer"):e._e(),a("router-view")],1)},E=[],y=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app-bar",{attrs:{fixed:"",app:""}},[a("v-spacer"),a("v-avatar",{attrs:{size:"40"}},[a("v-img",{attrs:{src:e.photo+"/"+e.logtimeuserinfo.EmployeeCode+".jpg"}})],1),a("v-toolbar-items",[a("v-card-text",[e._v(e._s(e.logtimeuserinfo.FirstName))]),a("v-spacer"),0!=e.logtimeuserinfo.UserLevel?a("v-btn",{attrs:{icon:""},on:{click:function(t){return e.userLoggedOut(e.logtimeuserinfo)}}},[a("v-icon",[e._v("mdi-logout")])],1):e._e()],1)],1)},T=[],_=(a("99af"),a("b680"),{data:function(){return{}},methods:{userLoggedOut:function(e){var t=this.moment.utc(e.TimeIn),a=this.moment.utc(this.serverDateTime),n=a.format("YYYY-MM-DD HH:mm:ss");this.moment(e.LogDateTime).format("YYYY-MM-DD")!=a.format("YYYY-MM-DD")&&(n="".concat(this.moment(e.LogDateTime).format("YYYY-MM-DD")," ").concat(this.moment(e.EndTime).format("HH:mm:ss")));var s=this.calculateDates(a,t),o={procedureName:"Logtime.dbo.ProcInsertLogTimeData",values:["LT".concat(this.moment(e.LogDateTime).format("MMYYYY")),e.ShortName,e.IDCode,e.EmployeeCode,e.LogDateTime,e.TimeIn,n,parseFloat(s.hours.toFixed(2)-1),e.Undertime,e.Tardiness,e.Overtime,e.ND,e.Shift,e.SW1,1,e.UserAcct,e.UserAcctO,e.UserTime,e.UserTimeO,e.ManualRem,"121",e.ND1,e.ND2,e.NoHrs1,"RD"==e.OTCode?"R":"O",e.DayOff,e.OTCode,e.Meal,e.MealOCC,e.PostOT,e.Leave,e.TransIn,e.TransOut,e.DepartmentCode,e.SectionCode,e.TeamCode,e.DesignationCode,1]};1==e.LogType&&this.axios.post("".concat(this.api,"/execute"),{data:JSON.stringify(o)}),this.$store.commit("CHANGE_USER_INFO",{}),this.$store.commit("CHANGE_USER_LOGGING",!1),this.$store.commit("CHANGE_SERVERDATETTIME",""),this.$router.push("/")}}}),N=_,O=a("2877"),C=a("6544"),k=a.n(C),A=a("40dc"),w=a("8212"),D=a("8336"),S=a("99d9"),I=a("132d"),G=a("adda"),L=a("2fa4"),R=a("2a7f"),x=Object(O["a"])(N,y,T,!1,null,null,null),z=x.exports;k()(x,{VAppBar:A["a"],VAvatar:w["a"],VBtn:D["a"],VCardText:S["b"],VIcon:I["a"],VImg:G["a"],VSpacer:L["a"],VToolbarItems:R["a"]});var H={mounted:function(){var e=this;setInterval((function(){e.checkAppVersion()}),1e3)},components:{navdrawer:z}},M=H,V=a("7496"),Y=Object(O["a"])(M,v,E,!1,null,null,null),P=Y.exports;k()(Y,{VApp:V["a"]});var U=a("9483");Object(U["a"])("".concat("/logtimeportal/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});a("d3b7");var F=a("8c4f"),$=a("2f62"),q=a("0e44");n["a"].use($["a"]);var B=new $["a"].Store({state:{logtimeuserinfo:{},isLoggedIn:!1,isConnect:!0,appVersion:null,serverDateTime:""},plugins:[Object(q["a"])()],mutations:{CHANGE_USER_INFO:function(e,t){e.logtimeuserinfo=t},CHANGE_USER_LOGGING:function(e,t){e.isLoggedIn=t},CHANGE_CONNECTION:function(e,t){e.isConnect=t},CHANGE_APP_VERSION:function(e,t){e.appVersion=t},CHANGE_SERVERDATETTIME:function(e,t){e.serverDateTime=t}},actions:{},modules:{}});n["a"].use(F["a"]);var J=[{path:"/",name:"login",component:function(){return a.e("about").then(a.bind(null,"dd7b"))}},{path:"/dashboard",name:"dashboard",component:function(){return a.e("about").then(a.bind(null,"4601"))}},{path:"/dashboardleaders",name:"dashboardleaders",component:function(){return a.e("about").then(a.bind(null,"2a87"))}}],K=new F["a"]({mode:"history",base:"/logtimeportal/",routes:J});K.beforeEach((function(e,t,a){"/"!==e.path&&void 0==B.state.logtimeuserinfo.EmployeeCode?a("/"):"/"===e.path&&void 0!=B.state.logtimeuserinfo.EmployeeCode?0==B.state.logtimeuserinfo.UserLevel?a("/dashboard"):a("/dashboardleaders"):a()}));var W=K,Q=a("f309");a("5363");n["a"].use(Q["a"]);var X=new Q["a"]({icons:{iconfont:"mdi"},theme:{dark:!1,themes:{light:{primary:"#1976D2",secondary:"#455A64",accent:"#8c9eff",error:"#b71c1c",info:"#2196F3",success:"#4CAF50",warning:"#FFC107",highlightcolor:"#42A5F5",icon_color:"#212121",table_header_color:"#213c57"}}}}),Z=(a("b0c0"),a("5530")),ee={install:function(e){e.mixin({data:function(){return{api:null,asd_sql:"http://adminsql1/asdserver/api",photo:"http://adminsql1/photos"}},created:function(){this.getServerDateTime(),this.api="http://adminsql1/api",this.axios.defaults.headers.common["master-api"]="db588403f0a1d3b897442a28724166b4"},computed:Object(Z["a"])({},Object($["c"])(["logtimeuserinfo","isLoggedIn","isConnect","appVersion","serverDateTime"])),methods:Object(Z["a"])(Object(Z["a"])({},Object($["b"])(["CHANGE_USER_INFO","CHANGE_USER_LOGGING","CHANGE_CONNECTION","CHANGE_APP_VERSION","CHANGE_SERVERDATETTIME"])),{},{getServerDateTime:function(){this.axios.get("".concat(this.asd_sql,"/getclientip.php")).then((function(e){var t=e.data;B.commit("CHANGE_SERVERDATETTIME",t.SERVERDATETIME)}))},calculateDates:function(e,t){var a=e.diff(t,"year");t.add(a,"years");var n=e.diff(t,"months");t.add(n,"months");var s=e.diff(t,"days");t.add(s,"days");var o=e.diff(t,"hours",!0);t.add(o,"hours");var r=e.diff(t,"minutes",!0);t.add(r,"minutes");var i=e.diff(t,"seconds");return{years:a,months:n,days:s,hours:o,minutes:r,seconds:i}},checkAppVersion:function(){var e=this,t=null;this.axios.get("".concat(this.api,"/appversion")).then((function(a){t=a.data,t!=e.appVersion&&(e.$store.commit("CHANGE_APP_VERSION",t),e.$store.commit("CHANGE_USER_INFO",{}),e.$store.commit("CHANGE_USER_LOGGING",!1),e.$store.commit("CHANGE_SERVERDATETTIME",""),"login"!=e.$route.name&&e.$router.push("/"))}))}})})}},te=ee,ae="http://adminsql1:8700",ne=m()(ae);n["a"].config.productionTip=!1,n["a"].prototype.axios=o.a,n["a"].prototype.md5=i.a,n["a"].prototype.swal=d.a,n["a"].prototype.moment=u.a,n["a"].prototype.jsfiledownload=g.a,n["a"].use(te),n["a"].use(j["a"]),n["a"].use(new p.a({debug:!1,connection:ne})),new n["a"]({router:W,store:B,vuetify:X,render:function(e){return e(P)}}).$mount("#app")}});