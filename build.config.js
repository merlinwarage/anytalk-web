/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    pkg: {
        "author": "Unknown",
        "name": "MWO",
        "version": "1.0",
        "homepage": "www.merlinw.org"
    },

    build_dir: 'build',
    compile_dir: 'dist',
    coverage_dir: 'coverage',
    testreport_dir: 'GUnit-test-reports',
    instrumented_dir: 'instrumented',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js', '!src/**/*.e2e.js'],
        jsunit: ['src/**/*.spec.js'],

        atpl: ['src/app/**/*.tpl.html'],
        ctpl: ['src/common/**/*.tpl.html'],

        html: ['src/index.html'],
        less: ['src/less/main.less']
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js',
            'karma/karma-test.js'
        ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
        js: [
            'vendor/jquery/dist/jquery.js',
            'vendor/moment/moment.js',
            'vendor/moment/locale/hu.js',
            'vendor/moment/locale/en-gb.js',
            'vendor/moment/locale/de.js',
            'vendor/angular/angular.js',
            'vendor/angular-filter/dist/angular-filter.js',
            'vendor/angular-resource/angular-resource.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'vendor/angular-translate/angular-translate.js',
            'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'vendor/angular-local-storage/dist/angular-local-storage.js',
			'vendor/angular-cookies/angular-cookies.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/angular-scroll/angular-scroll.js',
            'vendor/angular-loading-bar/build/loading-bar.js',
            'vendor/angular-sanitize/angular-sanitize.js',
            'vendor/angular-socket-io/socket.js',
            // 'vendor/angular-messages/angular-messages.min.js',
            'vendor/socket.io-client/dist/socket.io.js',
            'vendor/ua-parser-js/src/ua-parser.js',
            'vendor_local/youtube-iframe-api/iframe_api.js',
            'vendor/angular-youtube-mb/dist/angular-youtube-embed.min.js',
            'vendor/angulartics/dist/angulartics.min.js',
            'vendor/angulartics-google-analytics/dist/angulartics-ga.min.js',
            'vendor/slick-carousel/slick/slick.js',
            'vendor/angular-slick-carousel/dist/angular-slick.min.js',
            'vendor/simple-web-notification/web-notification.js',
            'vendor/angular-web-notification/angular-web-notification.js'
        ],
        css: [
            'vendor/angular-loading-bar/build/loading-bar.min.css',
            'vendor/bootstrap/dist/css/bootstrap-theme.min.css',
            'vendor/font-awesome/css/font-awesome.min.css',
            'vendor/slick-carousel/slick/slick.css',
            'vendor/slick-carousel/slick/slick-theme.css'
        ],
        assets: [],
        fonts: [
            'vendor/slick-carousel/slick/fonts/*',
            'vendor/font-awesome/fonts/*',
            'vendor/bootstrap/fonts/*',
        ]
    }
};