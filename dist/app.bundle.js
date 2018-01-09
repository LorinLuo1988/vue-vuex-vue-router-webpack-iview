webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(33)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var UPDATE_HOME_NAME = exports.UPDATE_HOME_NAME = 'UPDATE_HOME_NAME';
var UPDATE_DETAIL_NAME = exports.UPDATE_DETAIL_NAME = 'UPDATE_DETAIL_NAME';

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//

var prefixCls = 'ivu-icon';

exports.default = {
    name: 'Icon',
    props: {
        type: String,
        size: [Number, String],
        color: String
    },
    computed: {
        classes: function classes() {
            return prefixCls + ' ' + prefixCls + '-' + this.type;
        },
        styles: function styles() {
            var style = {};

            if (this.size) {
                style['font-size'] = this.size + 'px';
            }

            if (this.color) {
                style.color = this.color;
            }

            return style;
        }
    }
};

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Main = __webpack_require__(34);

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {
		MainLayout: _Main2.default
	}
}; //
//
//
//
//
//

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _sider = __webpack_require__(37);

var _sider2 = _interopRequireDefault(_sider);

var _content = __webpack_require__(41);

var _content2 = _interopRequireDefault(_content);

var _header = __webpack_require__(43);

var _header2 = _interopRequireDefault(_header);

var _layout = __webpack_require__(45);

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	data: function data() {
		return {
			isCollapsed: false
		};
	},

	computed: {
		rotateIcon: function rotateIcon() {
			return ['menu-icon', this.isCollapsed ? 'rotate-icon' : ''];
		}
	},
	methods: {
		collapsedSider: function collapsedSider() {
			this.$refs['app-sider'].toggleCollapse();
		}
	},
	components: {
		Layout: _layout2.default,
		Header: _header2.default,
		Content: _content2.default,
		Sider: _sider2.default
	},
	mounted: function mounted() {
		console.log(this.isCollapsed);
	}
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_sider_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_sider_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_sider_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_5d2cf180_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_sider_vue__ = __webpack_require__(40);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_sider_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_5d2cf180_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_sider_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dom = __webpack_require__(38);

var _assist = __webpack_require__(39);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var prefixCls = 'ivu-layout-sider';
(0, _assist.setMatchMedia)();
exports.default = {
    name: 'Sider',
    props: {
        value: { // if it's collpased now
            type: Boolean,
            default: false
        },
        width: {
            type: [Number, String],
            default: 200
        },
        collapsedWidth: {
            type: [Number, String],
            default: 64
        },
        hideTrigger: {
            type: Boolean,
            default: false
        },
        breakpoint: {
            type: String,
            validator: function validator(val) {
                return (0, _assist.oneOf)(val, ['xs', 'sm', 'md', 'lg', 'xl']);
            }
        },
        collapsible: {
            type: Boolean,
            default: false
        },
        defaultCollapsed: {
            type: Boolean,
            default: false
        },
        reverseArrow: {
            type: Boolean,
            default: false
        }
    },
    data: function data() {
        return {
            prefixCls: prefixCls,
            mediaMatched: false,
            isCollapsed: false
        };
    },

    computed: {
        wrapClasses: function wrapClasses() {
            return ['' + prefixCls, this.siderWidth ? '' : prefixCls + '-zero-width', this.isCollapsed ? prefixCls + '-collapsed' : ''];
        },
        wrapStyles: function wrapStyles() {
            return {
                width: this.siderWidth + 'px',
                minWidth: this.siderWidth + 'px',
                maxWidth: this.siderWidth + 'px',
                flex: '0 0 ' + this.siderWidth + 'px'
            };
        },
        triggerClasses: function triggerClasses() {
            return [prefixCls + '-trigger', this.isCollapsed ? prefixCls + '-trigger-collapsed' : ''];
        },
        childClasses: function childClasses() {
            return this.prefixCls + '-children';
        },
        zeroWidthTriggerClasses: function zeroWidthTriggerClasses() {
            return [prefixCls + '-zero-width-trigger', this.reverseArrow ? prefixCls + '-zero-width-trigger-left' : ''];
        },
        triggerIconClasses: function triggerIconClasses() {
            return ['ivu-icon', 'ivu-icon-chevron-' + (this.reverseArrow ? 'right' : 'left'), prefixCls + '-trigger-icon'];
        },
        siderWidth: function siderWidth() {
            return this.collapsible ? this.isCollapsed ? this.mediaMatched ? 0 : parseInt(this.collapsedWidth) : parseInt(this.width) : this.width;
        },
        showZeroTrigger: function showZeroTrigger() {
            return this.collapsible ? this.mediaMatched && !this.hideTrigger || parseInt(this.collapsedWidth) === 0 && this.isCollapsed && !this.hideTrigger : false;
        },
        showBottomTrigger: function showBottomTrigger() {
            return this.collapsible ? !this.mediaMatched && !this.hideTrigger : false;
        }
    },
    methods: {
        toggleCollapse: function toggleCollapse() {
            this.isCollapsed = this.collapsible ? !this.isCollapsed : false;
            this.$emit('input', this.isCollapsed);
            this.$emit('on-collapse', this.isCollapsed);
        },
        matchMedia: function matchMedia() {
            var matchMedia = void 0;
            if (window.matchMedia) {
                matchMedia = window.matchMedia;
            }
            var mediaMatched = this.mediaMatched;
            this.mediaMatched = matchMedia('(max-width: ' + _assist.dimensionMap[this.breakpoint] + ')').matches;

            if (this.mediaMatched !== mediaMatched) {
                this.isCollapsed = this.collapsible ? this.mediaMatched : false;
                this.$emit('input', this.mediaMatched);
                this.$emit('on-collapse', this.mediaMatched);
            }
        },
        onWindowResize: function onWindowResize() {
            this.matchMedia();
        }
    },
    mounted: function mounted() {
        if (this.defaultCollapsed) {
            this.isCollapsed = true;
            this.$emit('input', this.defaultCollapsed);
        } else {
            if (this.value !== undefined) {
                this.isCollapsed = this.value;
            }
        }
        if (this.breakpoint !== undefined) {
            (0, _dom.on)(window, 'resize', this.onWindowResize);
            this.matchMedia();
        }
    },
    beforeDestroy: function beforeDestroy() {
        if (this.breakpoint !== undefined) {
            (0, _dom.off)(window, 'resize', this.onWindowResize);
        }
    }
};

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_content_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_content_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_content_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_21d93cfe_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_content_vue__ = __webpack_require__(42);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_content_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_21d93cfe_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_content_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//

var prefixCls = 'ivu-layout';
exports.default = {
    name: 'Content',
    computed: {
        wrapClasses: function wrapClasses() {
            return prefixCls + '-content';
        }
    }
};

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_header_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_header_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_b0b580b2_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_header_vue__ = __webpack_require__(44);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_header_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_b0b580b2_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//

var prefixCls = 'ivu-layout';
exports.default = {
    name: 'Header',
    computed: {
        wrapClasses: function wrapClasses() {
            return prefixCls + '-header';
        }
    }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//

var prefixCls = 'ivu-layout';

exports.default = {
    name: 'Layout',
    data: function data() {
        return {
            hasSider: false
        };
    },

    computed: {
        wrapClasses: function wrapClasses() {
            return ['' + prefixCls, _defineProperty({}, prefixCls + '-has-sider', this.hasSider)];
        }
    },
    methods: {
        findSider: function findSider() {
            return this.$children.some(function (child) {
                return child.$options.name === 'Sider';
            });
        }
    },
    mounted: function mounted() {
        this.hasSider = this.findSider();
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//

var prefixCls = 'ivu-layout';
exports.default = {
    name: 'Footer',
    computed: {
        wrapClasses: function wrapClasses() {
            return prefixCls + '-footer';
        }
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//

//    import { oneOf } from '../../utils/assist';

var prefixCls = 'ivu-loading-bar';

exports.default = {
    props: {
        //            percent: {
        //                type: Number,
        //                default: 0
        //            },
        color: {
            type: String,
            default: 'primary'
        },
        failedColor: {
            type: String,
            default: 'error'
        },
        height: {
            type: Number,
            default: 2
        }
        //            status: {
        //                type: String,
        //                validator (value) {
        //                    return oneOf(value, ['success', 'error']);
        //                },
        //                default: 'success'
        //            },
        //            show: {
        //                type: Boolean,
        //                default: false
        //            }
    },
    data: function data() {
        return {
            percent: 0,
            //                color: 'primary',
            //                failedColor: 'error',
            //                height: 2,
            status: 'success',
            show: false
        };
    },

    computed: {
        classes: function classes() {
            return '' + prefixCls;
        },
        innerClasses: function innerClasses() {
            var _ref;

            return [prefixCls + '-inner', (_ref = {}, _defineProperty(_ref, prefixCls + '-inner-color-primary', this.color === 'primary' && this.status === 'success'), _defineProperty(_ref, prefixCls + '-inner-failed-color-error', this.failedColor === 'error' && this.status === 'error'), _ref)];
        },
        outerStyles: function outerStyles() {
            return {
                height: this.height + 'px'
            };
        },
        styles: function styles() {
            var style = {
                width: this.percent + '%',
                height: this.height + 'px'
            };

            if (this.color !== 'primary' && this.status === 'success') {
                style.backgroundColor = this.color;
            }

            if (this.failedColor !== 'error' && this.status === 'error') {
                style.backgroundColor = this.failedColor;
            }

            return style;
        }
    }
};

/***/ }),
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _icon = __webpack_require__(21);

var _icon2 = _interopRequireDefault(_icon);

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

__webpack_require__(27);

var _App = __webpack_require__(30);

var _App2 = _interopRequireDefault(_App);

var _router = __webpack_require__(52);

var _router2 = _interopRequireDefault(_router);

var _store = __webpack_require__(58);

var _store2 = _interopRequireDefault(_store);

__webpack_require__(61);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.component('Icon', _icon2.default);

exports.default = new _vue2.default({
	el: '#app',
	router: _router2.default,
	store: _store2.default,
	template: '<App />',
	components: { App: _App2.default }
});

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__icon_vue__ = __webpack_require__(22);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__icon_vue__["default"]);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_icon_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_3fcae35a_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_icon_vue__ = __webpack_require__(23);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_icon_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_3fcae35a_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_icon_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('i',{class:_vm.classes,style:(_vm.styles)})}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(29);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 29 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_044ddcff_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue__ = __webpack_require__(51);
function injectStyle (ssrContext) {
  __webpack_require__(31)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_044ddcff_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_node_modules_iview_loader_index_js_ref_1_1_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("4a162fe8", content, true);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1fefb5c2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue__ = __webpack_require__(50);
function injectStyle (ssrContext) {
  __webpack_require__(35)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1fefb5c2"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1fefb5c2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_node_modules_iview_loader_index_js_ref_1_1_Main_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("ac5dbab2", content, true);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, ".app-sider[data-v-1fefb5c2]{color:gray;position:fixed;top:0;bottom:0;left:0;overflow:auto}.ivu-layout-header[data-v-1fefb5c2]{padding:0;background:#fff;box-shadow:0 1px 1px rgba(0,0,0,.1)}.right-layout[data-v-1fefb5c2]{transition:padding-left .2s}.menu-icon[data-v-1fefb5c2]{transition:all .2s}.rotate-icon[data-v-1fefb5c2]{transform:rotate(-90deg)}", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_sider_vue__ = __webpack_require__(10);


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__layout_sider_vue__["default"]); 

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);

const isServer = __WEBPACK_IMPORTED_MODULE_0_vue__["default"].prototype.$isServer;

/* istanbul ignore next */
const on = (function() {
    if (!isServer && document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();
/* harmony export (immutable) */ __webpack_exports__["on"] = on;


/* istanbul ignore next */
const off = (function() {
    if (!isServer && document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();
/* harmony export (immutable) */ __webpack_exports__["off"] = off;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["oneOf"] = oneOf;
/* harmony export (immutable) */ __webpack_exports__["camelcaseToHyphen"] = camelcaseToHyphen;
/* harmony export (immutable) */ __webpack_exports__["getScrollBarSize"] = getScrollBarSize;
/* harmony export (immutable) */ __webpack_exports__["getStyle"] = getStyle;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "firstUpperCase", function() { return firstUpperCase; });
/* harmony export (immutable) */ __webpack_exports__["warnProp"] = warnProp;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepCopy", function() { return deepCopy; });
/* harmony export (immutable) */ __webpack_exports__["scrollTop"] = scrollTop;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findComponentUpward", function() { return findComponentUpward; });
/* harmony export (immutable) */ __webpack_exports__["findComponentDownward"] = findComponentDownward;
/* harmony export (immutable) */ __webpack_exports__["findComponentsDownward"] = findComponentsDownward;
/* harmony export (immutable) */ __webpack_exports__["hasClass"] = hasClass;
/* harmony export (immutable) */ __webpack_exports__["addClass"] = addClass;
/* harmony export (immutable) */ __webpack_exports__["removeClass"] = removeClass;
/* harmony export (immutable) */ __webpack_exports__["setMatchMedia"] = setMatchMedia;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);

const isServer = __WEBPACK_IMPORTED_MODULE_0_vue__["default"].prototype.$isServer;
// 判断参数是否是其中之一
function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

function camelcaseToHyphen (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// For Modal scrollBar hidden
let cached;
function getScrollBarSize (fresh) {
    if (isServer) return 0;
    if (fresh || cached === undefined) {
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer);

        cached = widthContained - widthScroll;
    }
    return cached;
}

// watch DOM change
const MutationObserver = isServer ? false : window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false;
/* harmony export (immutable) */ __webpack_exports__["MutationObserver"] = MutationObserver;


const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}
// getStyle
function getStyle (element, styleName) {
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch(e) {
        return element.style[styleName];
    }
}

// firstUpperCase
function firstUpperCase(str) {
    return str.toString()[0].toUpperCase() + str.toString().slice(1);
}


// Warn
function warnProp(component, prop, correctType, wrongType) {
    correctType = firstUpperCase(correctType);
    wrongType = firstUpperCase(wrongType);
    console.error(`[iView warn]: Invalid prop: type check failed for prop ${prop}. Expected ${correctType}, got ${wrongType}. (found in component: ${component})`);    // eslint-disable-line
}

function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
}

// deepCopy
function deepCopy(data) {
    const t = typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if ( t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if ( t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}



// scrollTop animation
function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000/60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

// Find components upward
function findComponentUpward (context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}


// Find component downward
function findComponentDownward (context, componentName) {
    const childrens = context.$children;
    let children = null;

    if (childrens.length) {
        for (const child of childrens) {
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}

// Find components downward
function findComponentsDownward (context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentsDownward(child, componentName);
        return components.concat(foundChilds);
    }, []);
}

/* istanbul ignore next */
const trim = function(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

/* istanbul ignore next */
function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

/* istanbul ignore next */
function addClass(el, cls) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else {
            if (!hasClass(el, clsName)) {
                curClass += ' ' + clsName;
            }
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

/* istanbul ignore next */
function removeClass(el, cls) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else {
            if (hasClass(el, clsName)) {
                curClass = curClass.replace(' ' + clsName + ' ', ' ');
            }
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}

const dimensionMap = {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1600px',
};
/* harmony export (immutable) */ __webpack_exports__["dimensionMap"] = dimensionMap;


function setMatchMedia () {
    if (typeof window !== 'undefined') {
        const matchMediaPolyfill = mediaQuery => {
            return {
                media: mediaQuery,
                matches: false,
                on() {},
                off() {},
            };
        };
        window.matchMedia = window.matchMedia || matchMediaPolyfill;
    }
}

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.wrapClasses,style:(_vm.wrapStyles)},[_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.showZeroTrigger),expression:"showZeroTrigger"}],class:_vm.zeroWidthTriggerClasses,on:{"click":_vm.toggleCollapse}},[_c('i',{staticClass:"ivu-icon ivu-icon-navicon-round"})]),_vm._v(" "),_c('div',{class:_vm.childClasses},[_vm._t("default")],2),_vm._v(" "),_vm._t("trigger",[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showBottomTrigger),expression:"showBottomTrigger"}],class:_vm.triggerClasses,style:({width: _vm.siderWidth + 'px'}),on:{"click":_vm.toggleCollapse}},[_c('i',{class:_vm.triggerIconClasses})])])],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_content_vue__ = __webpack_require__(12);


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__layout_content_vue__["default"]); 

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.wrapClasses},[_vm._t("default")],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_header_vue__ = __webpack_require__(14);


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__layout_header_vue__["default"]); 

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.wrapClasses},[_vm._t("default")],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layout_vue__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sider_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__content_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__footer_vue__ = __webpack_require__(48);






__WEBPACK_IMPORTED_MODULE_0__layout_vue__["default"].Header = __WEBPACK_IMPORTED_MODULE_1__header_vue__["default"];
__WEBPACK_IMPORTED_MODULE_0__layout_vue__["default"].Sider = __WEBPACK_IMPORTED_MODULE_2__sider_vue__["default"];
__WEBPACK_IMPORTED_MODULE_0__layout_vue__["default"].Content = __WEBPACK_IMPORTED_MODULE_3__content_vue__["default"];
__WEBPACK_IMPORTED_MODULE_0__layout_vue__["default"].Footer = __WEBPACK_IMPORTED_MODULE_4__footer_vue__["default"];

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__layout_vue__["default"]); 

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_layout_vue__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_layout_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_layout_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_dc9c8d52_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_layout_vue__ = __webpack_require__(47);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_layout_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_dc9c8d52_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_layout_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.wrapClasses},[_vm._t("default")],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_footer_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_footer_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_6fa8b099_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_footer_vue__ = __webpack_require__(49);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_footer_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_6fa8b099_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_footer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.wrapClasses},[_vm._t("default")],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Layout',[_c('Sider',{ref:"app-sider",staticClass:"app-sider",attrs:{"collapsible":"","hide-trigger":"","width":200,"collapsed-width":64},model:{value:(_vm.isCollapsed),callback:function ($$v) {_vm.isCollapsed=$$v},expression:"isCollapsed"}},[_c('router-link',{attrs:{"to":"/"}},[_vm._v("Home")]),_vm._v(" "),_c('router-link',{attrs:{"to":"/detail"}},[_vm._v("Detail")])],1),_vm._v(" "),_c('Layout',{staticClass:"right-layout",style:({paddingLeft: _vm.isCollapsed ? '64px' : '200px'})},[_c('Header',[_c('Icon',{class:_vm.rotateIcon,style:({margin: '20px 20px 0'}),attrs:{"type":"navicon-round","size":"24"},nativeOn:{"click":function($event){if($event.target !== $event.currentTarget){ return null; }_vm.collapsedSider($event)}}})],1),_vm._v(" "),_c('Content',[_vm._t("default")],2)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('MainLayout',[_c('router-view',{attrs:{"id":"app"}})],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _loadingBar = __webpack_require__(53);

var _loadingBar2 = _interopRequireDefault(_loadingBar);

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(19);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _page = __webpack_require__(57);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [{ path: '/', component: _page.Home }, { path: '/detail', component: _page.Detail }];

_vue2.default.use(_vueRouter2.default);

var router = new _vueRouter2.default({
	mode: 'history',
	routes: routes
});

router.beforeEach(function (to, from, next) {
	_loadingBar2.default.start();
	next();
});

router.afterEach(function (to, from) {
	_loadingBar2.default.finish();
});

exports.default = router;

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loading_bar__ = __webpack_require__(54);


let loadingBarInstance;
let color = 'primary';
let failedColor = 'error';
let height = 2;
let timer;

function getLoadingBarInstance () {
    loadingBarInstance = loadingBarInstance || __WEBPACK_IMPORTED_MODULE_0__loading_bar__["a" /* default */].newInstance({
        color: color,
        failedColor: failedColor,
        height: height
    });

    return loadingBarInstance;
}

function update(options) {
    let instance  = getLoadingBarInstance();

    instance.update(options);
}

function hide() {
    setTimeout(() => {
        update({
            show: false
        });
        setTimeout(() => {
            update({
                percent: 0
            });
        }, 200);
    }, 800);
}

function clearTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

/* harmony default export */ __webpack_exports__["default"] = ({
    start () {
        if (timer) return;

        let percent = 0;

        update({
            percent: percent,
            status: 'success',
            show: true
        });

        timer = setInterval(() => {
            percent += Math.floor(Math.random () * 3 + 5);
            if (percent > 95) {
                clearTimer();
            }
            update({
                percent: percent,
                status: 'success',
                show: true
            });
        }, 200);
    },
    update (percent) {
        clearTimer();
        update({
            percent: percent,
            status: 'success',
            show: true
        });
    },
    finish () {
        clearTimer();
        update({
            percent: 100,
            status: 'success',
            show: true
        });
        hide();
    },
    error () {
        clearTimer();
        update({
            percent: 100,
            status: 'error',
            show: true
        });
        hide();
    },
    config (options) {
        if (options.color) {
            color = options.color;
        }
        if (options.failedColor) {
            failedColor = options.failedColor;
        }
        if (options.height) {
            height = options.height;
        }
    },
    destroy () {
        clearTimer();
        let instance = getLoadingBarInstance();
        loadingBarInstance = null;
        instance.destroy();
    }
});


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loading_bar_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(1);



__WEBPACK_IMPORTED_MODULE_0__loading_bar_vue__["default"].newInstance = properties => {
    const _props = properties || {};

    const Instance = new __WEBPACK_IMPORTED_MODULE_1_vue__["default"]({
        data: _props,
        render (h) {
            return h(__WEBPACK_IMPORTED_MODULE_0__loading_bar_vue__["default"], {
                props: _props
            });
        }
    });

    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const loading_bar = Instance.$children[0];

    return {
        update (options) {
            if ('percent' in options) {
                loading_bar.percent = options.percent;
            }
            if (options.status) {
                loading_bar.status = options.status;
            }
            if ('show' in options) {
                loading_bar.show = options.show;
            }
        },
        component: loading_bar,
        destroy () {
            document.body.removeChild(document.getElementsByClassName('ivu-loading-bar')[0]);
        }
    };
};

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__loading_bar_vue__["default"]);


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_loading_bar_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_loading_bar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_loading_bar_vue__);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_ae104b6a_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_loading_bar_vue__ = __webpack_require__(56);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_iview_loader_index_js_ref_1_1_loading_bar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_ae104b6a_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_iview_loader_index_js_ref_1_1_loading_bar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"}],class:_vm.classes,style:(_vm.outerStyles)},[_c('div',{class:_vm.innerClasses,style:(_vm.styles)})])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Home = function Home(resolve) {
	return __webpack_require__.e/* require.ensure */(0).then((function () {
		return resolve(__webpack_require__(65));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var Detail = function Detail(resolve) {
	return __webpack_require__.e/* require.ensure */(1).then((function () {
		return resolve(__webpack_require__(66));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

exports.Home = Home;
exports.Detail = Detail;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(4);

var _vuex2 = _interopRequireDefault(_vuex);

var _home = __webpack_require__(59);

var _home2 = _interopRequireDefault(_home);

var _detail = __webpack_require__(60);

var _detail2 = _interopRequireDefault(_detail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({
	state: {},
	getters: {
		name: function name(state) {
			return state.home.name + ' ' + state.detail.name;
		}
	},
	mutations: {},
	actions: {},
	modules: {
		home: _home2.default,
		detail: _detail2.default
	},
	strict: "production" !== 'production'
});

if (false) {
	module.hot.accept(['./modules/home', './modules/detail'], function () {
		var home = require('./modules/home').default;
		var detail = require('./modules/detail').default;

		store.hotUpdate({
			modules: {
				home: home,
				detail: detail
			}
		});
	});
}

exports.default = store;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mutaionTypes = __webpack_require__(5);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
	name: 'Home Page'
};

var getters = {};

var mutations = _defineProperty({
	updateHomeName: function updateHomeName(state, value) {
		state.name = value;
	}
}, _mutaionTypes.UPDATE_HOME_NAME, function (state) {
	state.name = 'Home Page Vue';
});

var actions = {
	updateHomeName: function updateHomeName(_ref) {
		var state = _ref.state,
		    commit = _ref.commit,
		    rootState = _ref.rootState;
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				commit({
					type: _mutaionTypes.UPDATE_HOME_NAME
				});

				resolve('resolve');
			}, 1000);
		});
	}
};

exports.default = {
	namespaced: true,
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mutaionTypes = __webpack_require__(5);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
	name: 'Detail Page'
};

var getters = {};

var mutations = _defineProperty({}, _mutaionTypes.UPDATE_DETAIL_NAME, function (state) {
	state.name = 'Detail Page Vue';
});

var actions = {};

exports.default = {
	namespaced: true,
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(28)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!../../node_modules/less-loader/dist/cjs.js!./common.less", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!../../node_modules/less-loader/dist/cjs.js!./common.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "body {\n  transition: color .5s;\n  color: #333;\n}\n.margin-top-1 {\n  margin-top: 1px;\n}\n.margin-top-2 {\n  margin-top: 2px;\n}\n.margin-top-3 {\n  margin-top: 3px;\n}\n.margin-top-4 {\n  margin-top: 4px;\n}\n.margin-top-5 {\n  margin-top: 5px;\n}\n.margin-top-6 {\n  margin-top: 6px;\n}\n.margin-top-7 {\n  margin-top: 7px;\n}\n.margin-top-8 {\n  margin-top: 8px;\n}\n.margin-top-9 {\n  margin-top: 9px;\n}\n.margin-top-10 {\n  margin-top: 10px;\n}\n.margin-top-11 {\n  margin-top: 11px;\n}\n.margin-top-12 {\n  margin-top: 12px;\n}\n.margin-top-13 {\n  margin-top: 13px;\n}\n.margin-top-14 {\n  margin-top: 14px;\n}\n.margin-top-15 {\n  margin-top: 15px;\n}\n.margin-top-16 {\n  margin-top: 16px;\n}\n.margin-top-17 {\n  margin-top: 17px;\n}\n.margin-top-18 {\n  margin-top: 18px;\n}\n.margin-top-19 {\n  margin-top: 19px;\n}\n.margin-top-20 {\n  margin-top: 20px;\n}\n.margin-top-21 {\n  margin-top: 21px;\n}\n.margin-top-22 {\n  margin-top: 22px;\n}\n.margin-top-23 {\n  margin-top: 23px;\n}\n.margin-top-24 {\n  margin-top: 24px;\n}\n.margin-top-25 {\n  margin-top: 25px;\n}\n.margin-top-26 {\n  margin-top: 26px;\n}\n.margin-top-27 {\n  margin-top: 27px;\n}\n.margin-top-28 {\n  margin-top: 28px;\n}\n.margin-top-29 {\n  margin-top: 29px;\n}\n.margin-top-30 {\n  margin-top: 30px;\n}\n.margin-top-31 {\n  margin-top: 31px;\n}\n.margin-top-32 {\n  margin-top: 32px;\n}\n.margin-top-33 {\n  margin-top: 33px;\n}\n.margin-top-34 {\n  margin-top: 34px;\n}\n.margin-top-35 {\n  margin-top: 35px;\n}\n.margin-top-36 {\n  margin-top: 36px;\n}\n.margin-top-37 {\n  margin-top: 37px;\n}\n.margin-top-38 {\n  margin-top: 38px;\n}\n.margin-top-39 {\n  margin-top: 39px;\n}\n.margin-top-40 {\n  margin-top: 40px;\n}\n.margin-top-41 {\n  margin-top: 41px;\n}\n.margin-top-42 {\n  margin-top: 42px;\n}\n.margin-top-43 {\n  margin-top: 43px;\n}\n.margin-top-44 {\n  margin-top: 44px;\n}\n.margin-top-45 {\n  margin-top: 45px;\n}\n.margin-top-46 {\n  margin-top: 46px;\n}\n.margin-top-47 {\n  margin-top: 47px;\n}\n.margin-top-48 {\n  margin-top: 48px;\n}\n.margin-top-49 {\n  margin-top: 49px;\n}\n.margin-top-50 {\n  margin-top: 50px;\n}\n", ""]);

// exports


/***/ })
],[20]);