module.exports = {
	sourceMap: process.env.NODE_ENV === 'development' ? false : 'cheapModuleSourceMap',
  plugins: [
    require('autoprefixer')({
    	browsers: [
				'last 5 versions',
				'ie >= 9',
				'ie_mob >= 10',
				'ff >= 30',
				'chrome >= 34',
				'safari >= 6',
				'opera >= 12.1',
				'ios >= 6',
				'android >= 4.4'
			]
    })
  ]
}