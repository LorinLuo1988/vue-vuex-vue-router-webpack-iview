webpackJsonp([0],{65:function(e,t,n){"use strict";function a(e){n(69)}Object.defineProperty(t,"__esModule",{value:!0});var r=n(67),o=n.n(r);for(var u in r)"default"!==u&&function(e){n.d(t,e,function(){return r[e]})}(u);var s=n(71),c=n(0),i=a,p=c(o.a,s.a,!1,i,null,null);t.default=p.exports},67:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=n(4),o=(0,r.createNamespacedHelpers)("home"),u=o.mapState,s=o.mapMutations;t.default={computed:a({},u(["name"])),methods:a({},s({updateName:function(e,t){e("updateHomeName",t.target.value)}}))}},69:function(e,t,n){var a=n(70);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n(3)("03e05a95",a,!0)},70:function(e,t,n){t=e.exports=n(2)(!1),t.push([e.i,"",""])},71:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._v("\n\t"+e._s(e.name)+"\n\t"),n("input",{attrs:{type:"text"},domProps:{value:e.name},on:{input:e.updateName}})])},r=[],o={render:a,staticRenderFns:r};t.a=o}});