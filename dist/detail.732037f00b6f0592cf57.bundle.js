webpackJsonp([1],{24:function(e,t,n){"use strict";function a(e){n(30)}Object.defineProperty(t,"__esModule",{value:!0});var r=n(26),o=n.n(r);for(var u in r)"default"!==u&&function(e){n.d(t,e,function(){return r[e]})}(u);var c=n(32),i=n(6),s=a,l=i(o.a,c.a,!1,s,null,null);t.default=l.exports},26:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=n(1),o=n(2),u=(0,r.createNamespacedHelpers)("detail"),c=u.mapState,i=u.mapMutations;t.default={computed:a({path:function(){return"/detal"}},c({name:function(e){return e.name}})),methods:a({},i({updateName:o.UPDATE_DETAIL_NAME}))}},30:function(e,t,n){var a=n(31);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n(22)("0c1cee6d",a,!0)},31:function(e,t,n){t=e.exports=n(21)(!1),t.push([e.i,"",""])},32:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"home"}},[n("div",[e._v("path: "+e._s(e.path))]),e._v("\n\t"+e._s(e.name)+"\n\t"),n("button",{on:{click:e.updateName}},[e._v("change name")])])},r=[],o={render:a,staticRenderFns:r};t.a=o}});