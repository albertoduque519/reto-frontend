(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-17b9936f"],{"0038":function(t,e,a){},"7ede":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container",attrs:{id:"user-profile",tag:"section"}},[a("div",{staticClass:"row row-base"},[a("div",{staticClass:"col-md-4 col-md-offset-2"},[a("base-material-card",{scopedSlots:t._u([{key:"heading",fn:function(){return[a("div",{staticClass:"display-2 font-weight-light"},[t._v("Login")])]},proxy:!0}])},[a("div",{staticClass:"main"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12 col-md-offset-3 col-xs-12"},[a("form",{on:{submit:function(e){return e.preventDefault(),t.handleSubmit(e)}}},[a("div",{staticClass:"form-group"},[a("v-text-field",{staticClass:"purple-input",attrs:{label:"Username",placeholder:"Username",name:"username"},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}})],1),a("div",{staticClass:"form-group"},[a("v-text-field",{staticClass:"purple-input",attrs:{label:"Password",type:"password",placeholder:"password",name:"password"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),a("v-btn",{staticClass:"v-btn--block",attrs:{color:"primary",default:"",type:"submit"}},[t._v(" Sign up ")])],1)])])])])],1)])])},n=[],r=(a("96cf"),a("1da1")),i={name:"Apps",data:function(){return{username:"",password:"",submitted:!1}},computed:{loggingIn:function(){return this.$store.state.authentication.status.loggingIn}},created:function(){this.$store.dispatch("authentication/logout")},methods:{handleSubmit:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var a,s,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.submitted=!0,a=t.username,s=t.password,n=t.$store.dispatch,!a||!s){e.next=6;break}return e.next=6,n("authentication/logins",{username:a,password:s}).then((function(e){"undefined"!==typeof e.data.token&&t.$router.push({name:"Dashboard"})}));case 6:case"end":return e.stop()}}),e)})))()}}},o=i,u=(a("daa4"),a("2877")),c=a("6544"),l=a.n(c),d=a("8336"),p=a("8654"),m=Object(u["a"])(o,s,n,!1,null,null,null);e["default"]=m.exports;l()(m,{VBtn:d["a"],VTextField:p["a"]})},daa4:function(t,e,a){"use strict";var s=a("0038"),n=a.n(s);n.a}}]);
//# sourceMappingURL=chunk-17b9936f.3d2d8b3f.js.map