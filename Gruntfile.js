module.exports = function ( grunt ) {

    var projectName = 'MWO';

    /**
     * Load in our build configuration file.
     */
    var userConfig = require( './build.config.js' );

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {

        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON( 'package.json' ),

        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' */\n'
        },

        /**
         * Creates a changelog on a new version.
         */
        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                template: 'changelog.tpl'
            }
        },

        /**
         * Increments the version number, etc.
         */
        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json'
                ],
                commit: false,
                commitMessage: 'chore(release): v%VERSION%',
                commitFiles: [
                    'package.json',
                    'client/bower.json'
                ],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin'
            }
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            buildDir: [
                '<%= build_dir %>',
                '<%= compile_dir %>',
                '<%= testreport_dir %>'
            ],
            instrumentDir: [
                '<%= instrumented_dir %>'
            ]
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            build_app_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= build_dir %>/assets/',
                        cwd: 'src/assets',
                        expand: true
                    }
                ]
            },
            build_vendor_assets: {
                files: [
                    {
                        src: [ '<%= vendor_files.assets %>' ],
                        dest: '<%= build_dir %>/assets/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_vendor_fonts: {
                files: [
                    {
                        src: [ '<%= vendor_files.fonts %>' ],
                        dest: '<%= build_dir %>/assets/fonts',
                        flatten: true,
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_tpls: {
                files: [
                    {
                        src: [ '<%= app_files.atpl %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_appjs: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorjs: {
                files: [
                    {
                        src: [ '<%= vendor_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorcss: {
                files: [
                    {
                        src: [ '<%= vendor_files.css %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= compile_dir %>/assets',
                        cwd: '<%= build_dir %>/assets',
                        expand: true
                    }
                ]
            },
            compile_tpls: {
                files: [
                    {
                        src: [ '<%= app_files.atpl %>' ],
                        dest: '<%= compile_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            instrument: {
                expand: true,
                cwd: 'build/',
                src: [ '**', '!src/**/*.js' ],
                dest: 'instrumented/'
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `build_css` target concatenates compiled CSS and vendor CSS
             * together.
             */
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            compile_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    'module.prefix',
                    '<%= build_dir %>/src/bundle.js',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        /**
         * `ngAnnotate` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngAnnotate: {
            compile: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        browserify: {
            dist: {
                files: {
                    // destination for transpiled js : source js
                    '<%= build_dir %>/src/bundle.js': '<%= build_dir %>/src/**/*.js'
                },
                options: {

                    transform: [
                        [
                            'babelify', {
                            presets: [
                                [ '@babel/preset-env', {
                                    modules: false,
                                    targets: { 'ie': '11' }
                                } ]

                            ],
                            only: [ '<%= build_dir %>/src/' ]
                        }
                        ]
                    ],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },

        autopolyfiller: {
            options: {
                browsers: [ 'last 2 version', 'ie 8', 'ie 9' ]
            },
            dist: {
                '<%= build_dir %>/src/bundle.js': '<%= build_dir %>/src/bundle.js'
            }
        },

        /**
         * Minify the sources!
         */
        uglify: {
            compile: {
                options: {
                    sourceMap: true,
                    banner: '<%= meta.banner %>',
                    reserveDOMCache: true,
                    // mangle: {
                    except: [
                        '$rootScope',
                        '$state',
                        '$stateParams',
                        'globalConfig',
                        'GlobalConfigCacheService',
                        'formCfg',
                        'FormBuilderDefaultCallbacksService',
                        'FormBuilderService',
                        'FormBuilderCallbackService',
                        'FromBuilderCallbackConstants',
                        'AuthService'
                    ],
                    // },
                    compress: {
                        drop_console: true,
                        global_defs: {
                            'DEBUG': false
                        },
                        dead_code: true
                    },
                    preserveComments: false
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },

        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'dist/',      // Src matches are relative to this path.
                        src: [ '**/*.html' ], // Actual pattern(s) to match.
                        dest: 'dist/'   // Destination path prefix.
                    }
                ]
            }
        },

        /**
         * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
         * Only our `main.less` file is included in compilation; all other files
         * must be imported from this file.
         */
        less: {
            build: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                }
            },
            compile: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                },
                options: {
                    cleancss: true,
                    compress: true
                }
            }
        },

        lesslint: {
            src: [ 'src/**/*.less' ]
        },

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= app_files.jsunit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                esversion: 6,
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                '-W065': true, //radix parameters
                '-W055': true, //uppercase class names
                '-W024': true  //reserved words
            },
            globals: {
                esversion: 6
            }
        },

        /**
         * The `index` task compiles the `index.html` file as a Grunt template. CSS
         * and JS files co-exist here but they get split apart later.
         */
        index: {

            /**
             * During development, we don't want to have wait for compilation,
             * concatenation, minification, etc. So to avoid these steps, we simply
             * add all script files directly to the `<head>` of `index.html`. The
             * `src` property contains the list of included files.
             */
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
                ]
            },

            /**
             * When it is time to have a completely compiled application, we can
             * alter the above to include only a single JavaScript and a single CSS
             * file. Now we're back!
             */
            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    //'<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
                ]
            }
        },


        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it, as Ron Popeil used to tell us.
         *
         * But we don't need the same thing to happen for all the files.
         */
        delta: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: true
            },

            /**
             * When the Gruntfile changes, we just want to lint it. In fact, when
             * your Gruntfile changes, it will automatically be reloaded!
             */
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [ 'newer:jshint:gruntfile' ],
                options: {
                    livereload: false
                }
            },

            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: [ 'newer:jshint:src', 'newer:copy:build_appjs' ]
            },

            /**
             * When assets are changed, copy them. Note that this will *not* copy new
             * files, so this is probably not very useful.
             */
            assets: {
                files: [
                    'src/assets/**/*'
                ],
                tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
            },

            /**
             * When index.html changes, we need to compile it.
             */
            html: {
                files: [ '<%= app_files.html %>' ],
                tasks: [ 'index:build' ]
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: [
                    '<%= app_files.atpl %>',
                    '<%= app_files.ctpl %>'
                ],
                tasks: [ 'copy:build_tpls', 'copy:compile_tpls' ]
            },

            /**
             * When the CSS files change, we need to compile and minify them.
             */
            less: {
                files: [ 'src/**/*.less' ],
                tasks: [ 'less:build' ]
            },

            /**
             * When a JavaScript unit test file changes, we only want to lint it and
             * run the unit tests. We don't want to do any live reloading.
             */
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: [ 'newer:jshint:test' ],
                options: {
                    livereload: false
                }
            }
        },

        compress: {
            main: {
                options: { //.tar.gz - 'tgz'
                    archive: 'build/<%= pkg.name %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        src: [ 'dist/**' ],
                        dest: '/'
                    }
                ]
            }
        },
        connect: {
            runtime: {
                options: {
                    base: 'instrumented/',
                    port: 19100,
                    hostname: '*'
                }
            },
            build: {
                options: {
                    base: 'build',
                    port: 19100,
                    hostname: '*'
                }
            }
        },

        newer: {
            options: {
                cache: 'cache'
            }
        },

        sitemap_xml: {
            dist: {
                options: {
                    siteRoot: 'https://merlinw.org',
                    pretty: true
                },
                files: [
                    {
                        cwd: '<%= compile_dir %>',
                        src: '{,**/}*.html',
                        dest: '<%= compile_dir %>/sitemap.xml'
                    }
                ]
            }
        }
    };

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */

    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-istanbul' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify-es' );
    grunt.loadNpmTasks( 'grunt-autopolyfiller' );
    //grunt.loadNpmTasks('grunt-sitemap-xml');
    require( 'time-grunt' )( grunt );
    require( 'jit-grunt' )( grunt );
    grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'watch', [ 'build', 'delta' ] );

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask( 'dist', [ 'clean', 'build', 'compile' ] );

    /**
     * The compress task.
     */
    grunt.registerTask( 'pack', [ 'compress' ] );

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask( 'build', [
        'newer:jshint', 'newer:less:build',
        'newer:copy:build_app_assets', 'newer:copy:build_vendor_assets', 'newer:copy:build_vendor_fonts',
        'newer:copy:build_tpls', 'newer:copy:build_vendorcss', 'newer:copy:build_vendorjs', 'newer:copy:build_appjs',
        'index:build'
    ] );

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask( 'compile', [
        'less:compile',
        'copy:compile_tpls', 'copy:compile_assets',
        'ngAnnotate', 'browserify:dist', 'autopolyfiller:dist', 'concat:compile_js', 'concat:compile_css',
        'index:compile', 'htmlmin', 'uglify:compile'
    ] );

    grunt.registerTask( 'sitemap', [ 'build', 'compile', 'sitemap_xml' ] );

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS( files ) {
        return files.filter( function ( file ) {
            return file.match( /\.js$/ );
        } );
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS( files ) {
        return files.filter( function ( file ) {
            return file.match( /\.css$/ );
        } );
    }

    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask( 'index', 'Process index.html template', function () {
        var dirRE = new RegExp( '^(' + grunt.config( 'build_dir' ) + '|' + grunt.config( 'compile_dir' ) + ')\/', 'g' );
        var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
            return file.replace( dirRE, '' );
        } );
        var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
            return file.replace( dirRE, '' );
        } );

        grunt.file.copy( 'src/index.html', this.data.dir + '/index.html', {
            process: function ( contents, path ) {
                return grunt.template.process( contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config( 'pkg.version' ) + '-' + grunt.template.today( 'yyyy-mm-dd-HH:MM:ss' ),
                        name: grunt.config( 'pkg.name' )
                    }
                } );
            }
        } );
    } );

};
