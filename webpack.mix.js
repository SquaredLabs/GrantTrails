const { mix } = require('laravel-mix')
const path = require('path')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/index.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')

mix.webpackConfig({
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'resources/assets/js')
    ]
  }
})

// Turn off comparison optimization to prevent mapbox-gl from crashing
// https://github.com/mapbox/mapbox-gl-js/issues/4359#issuecomment-286277540
mix.options({
  uglify: {
    compress: {
      comparisons: false
    }
  }
})

if (mix.inProduction()) {
  mix.version()
}
