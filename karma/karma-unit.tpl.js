module.exports = function ( karma ) {
  karma.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      <% scripts.forEach( function ( file ) { %>'<%= file %>',<% }); %>
      'src/**/*.js',
	  'vendor/jquery/dist/jquery.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
    ],
    exclude: [
      'src/assets/**/*.js',
      'src/**/*.e2e.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-coverage', 'karma-jasmine', 'karma-firefox-launcher','karma-junit-reporter','karma-phantomjs-launcher' ],

    junitReporter: {			
      outputFile: 'result.xml',
      outputDir: 'GUnit-test-reports',
      suite: ''
    },

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/!(*.spec|*.e2e).js': ['coverage']
    },

    coverageReporter: {
      type : 'lcovonly',
      subdir: './',
      file : 'coverage.info'
    },

    /**
     * How to report, by default.
     */
    reporters: ['progress','junit','dots', 'coverage'],

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    browserNoActivityTimeout: 30000,

  /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      //'Firefox'
      'PhantomJS'
    ]
  });
};

