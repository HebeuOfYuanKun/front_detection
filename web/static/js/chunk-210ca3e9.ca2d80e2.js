(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-210ca3e9"],{"061b":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],style:"height:"+t.height},[n("iframe",{staticStyle:{width:"100%",height:"100%"},attrs:{src:t.src,frameborder:"no",scrolling:"auto"}})])},r=[],a={props:{src:{type:String,required:!0}},data:function(){return{height:document.documentElement.clientHeight-94.5+"px;",loading:!0,url:this.src}},mounted:function(){var t=this;setTimeout((function(){t.loading=!1}),300);var e=this;window.onresize=function(){e.height=document.documentElement.clientHeight-94.5+"px;"}}},o=a,u=n("2877"),c=Object(u["a"])(o,i,r,!1,null,null,null);e["a"]=c.exports},5194:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("i-frame",{attrs:{src:t.url}})},r=[],a=n("061b"),o={name:"Druid",components:{iFrame:a["a"]},data:function(){return{url:"http://127.0.0.1:8081/service/druid/login.html"}}},u=o,c=n("2877"),l=Object(c["a"])(u,i,r,!1,null,null,null);e["default"]=l.exports}}]);