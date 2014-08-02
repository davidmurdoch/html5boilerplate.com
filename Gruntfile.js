var path = require('path');

module.exports = function (grunt) {

    // Load Grunt tasks automatically
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    grunt.initConfig({

        // ---------------------------------------------------------------------
        // | Project Settings                                                  |
        // ---------------------------------------------------------------------

        settings: {
            // Configurable paths
            dir: {
                src: 'src',
                dist: 'dist'
            }
        },

        // ---------------------------------------------------------------------
        // | Tasks Configurations                                              |
        // ---------------------------------------------------------------------

        clean: {

            // List of files that should be removed
            // before the build process is started
            all: [
                '.tmp', // used by the `usemin` task
                '<%= settings.dir.dist %>'
            ],

            // List of files no longer required
            // after the build process is completed
            tmp: [

                '.tmp', // used by the `usemin` task

                // Since the website has a single page,
                // and we currently inline all the scripts
                // and style sheets, the `css` and `js`
                // directories can be removed
                '<%= settings.dir.dist %>/css',
                '<%= settings.dir.dist %>/js'

                // For images, the `imageEmbed` task will
                // automatically delete the ones that are
                // embedded inline, while the `cleanempty`
                // task will delete the `img` directory if
                // all images end up being inlined
                //'<%= settings.dir.dist %>/img'

            ]

        },

        cleanempty: {
            src: '<%= settings.dir.dist %>/**/*'
        },

        connect: {

            build: {
                options: {
                    base: '<%= settings.dir.dist %>'
                }
            },

            dev: {
                options: {
                    base: '<%= settings.dir.src %>'
                }
            },

            // Available options:
            // https://github.com/gruntjs/grunt-contrib-connect#options
            options: {
                hostname: '0.0.0.0',    // Change this to '0.0.0.0' if the
                                        // server needs to be accessed from
                                        // outside of the LAN
                livereload: 35729,
                open: true,
                port: 8080              // 8080 is used as it is the official
                                        // alternate to port 80 (default port
                                        // for HTTP), and it doesn't require
                                        // root access
                                        // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
            }

        },

        copy: {
            files: {
                cwd: '<%= settings.dir.src %>/',
                dest: '<%= settings.dir.dist %>/',
                dot: true,
                expand: true,
                src: [

                    // Copy all files
                    '**',

                    // except the files from the `css/` and `js/` directories
                    // (other tasks will handle the copying of these files)
                    '!css/*',
                    '!js/*'

                ]
            }
        },

        filerev: {
            files: {
                src: [
                    '<%= settings.dir.dist %>/img/*.{png,svg}'

                    // Currently all the scripts and style
                    // sheets are inlined so there is no
                    // need to revision them
                    // '<%= settings.dir.dist %>/css/*.css',
                    // '<%= settings.dir.dist %>/js/*.js',
                ]
            },

            // Available options:
            // https://github.com/yeoman/grunt-filerev#options
            options: {
                algorithm: 'sha1',
                length: 3
            }
        },

        htmlmin: {
            build: {
                files: {
                    '<%= settings.dir.dist %>/index.html': '<%= settings.dir.dist %>/index.html'
                    // DO NOT minify the 404 page! (the page needs to have
                    // more than 512 bytes in order for IE to display it:
                    // http://www.404-error-page.com/404-error-page-too-short-problem-microsoft-ie.shtml)
                },

                // Available options:
                // https://github.com/kangax/html-minifier#options-quick-reference
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true
                }
            }
        },

        inline: {
            build: {
                // Available options:
                // https://github.com/chyingp/grunt-inline#options
                options: {
                    tag: '' // include all URLs
                },

                src: '<%= settings.dir.dist%>/index.html',
                dest: '<%= settings.dir.dist%>/'

            }
        },

        jshint: {
            files: [
                'Gruntfile.js',
                '<%= settings.dir.src %>/js/*.js'
            ],

            // Available options:
            // https://github.com/gruntjs/grunt-contrib-jshint#options
            options: {
                // Search for `.jshintrc` files relative to files being linted
                jshintrc: true
            }
        },

        suitcss: {
            build: {
                files: {
                    // Generate `main.css` from `index.css`
                    // (the task will resolve all `@import`s from `index.css`
                    //  and include their content into `main.css`, as well as
                    //  run the CSS through autoprefixer)
                    '<%= settings.dir.src %>/css/main.css': '<%= settings.dir.src %>/css/index.css'
                }
            }
        },

        usemin: {
            // List of files for which to update asset references
            css: '<%= settings.dir.dist %>/css/*.css',
            html: '<%= settings.dir.dist %>/index.html'
        },

        useminPrepare: {
            // List of HTML files from which to process the usemin blocks
            // https://github.com/yeoman/grunt-usemin#blocks
            html: '<%= settings.dir.src %>/index.html',

            // Workflow configurations:
            // https://github.com/yeoman/grunt-usemin#flow
            options: {
                flow: {
                    html: {
                        steps: {
                            css: [

                                {
                                    name: 'uncss',
                                    createConfig: function (context, block) {

                                        // Set the location where this task will created
                                        // its files, so that the next task knows where
                                        // to take them from
                                        context.outFiles = [ block.dest ];

                                        // Available options:
                                        // https://github.com/addyosmani/grunt-uncss#options

                                        context.options.generated.options = {
                                            ignoreSheets: [/fonts.googleapis/]
                                        };

                                        // Task configurations
                                        return {
                                            files: [{
                                                dest: path.join('<%= settings.dir.dist %>', block.dest),
                                                // List of HTML files that UnCSS will use
                                                src: '<%= settings.dir.src %>/index.html'
                                            }]
                                        };
                                    }
                                },

                                {
                                    name: 'imageEmbed',
                                    createConfig: function (context, block) {

                                        context.outFiles = [ block.dest ];

                                        // Available options:
                                        // https://github.com/ehynds/grunt-image-embed#optional-configuration-properties
                                        context.options.generated.options = {
                                            deleteAfterEncoding: true,
                                            maxImageSize: 5000  // Only inline small images that end up
                                                                // having the base64 string smaller than
                                                                // the specified maximum size (for a small
                                                                // number of images, this keeps the page
                                                                // size relatively small, thus, requiring
                                                                // less additional network round trips to
                                                                // get the page)
                                        };

                                        // Task configurations
                                        return {
                                            files: [{
                                                src: path.join('<%= settings.dir.dist %>', block.dest),
                                                dest: path.join(context.outDir, block.dest)
                                            }]
                                        };

                                    }
                                },

                                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

                                'cssmin'
                            ],

                            js: [
                                'concat',
                                'uglifyjs'
                            ]

                        },
                        post: {}
                    }
                }
            }
        },

        watch: {
            files: [
                'Gruntfile.js',
                '<%= settings.dir.src %>/**/*'
            ],

            // Available options:
            // https://github.com/gruntjs/grunt-contrib-watch#settings
            options: {
                livereload: '<%= connect.options.livereload %>'
            },

            scripts: {
                files: '<%= jshint.files %>',
                options: {
                    spawn: false
                },
                tasks: 'jshint'
            },

            suit: {
                files: [
                    '<%= settings.dir.src %>/css/**.css',

                    // `main.css` is automatically generated,
                    // so it shouldn't be watched for changes!
                    '!<%= settings.dir.src %>/css/main.css'
                ],
                tasks: 'suitcss'
            }

        }

    });

    // -------------------------------------------------------------------------
    // | Main Tasks                                                            |
    // -------------------------------------------------------------------------

    grunt.registerTask('build', [
        'clean:all',
        'suitcss',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'uncss',
        'imageEmbed',
        'cssmin',
        'filerev',
        'usemin',
        'inline',
        'htmlmin',
        'cleanempty',
        'clean:tmp'
    ]);

    // Default task
    // (same as `build`, as `build` will be used more often)
    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('dev', [
        'suitcss',
        'test:dev'
    ]);

    grunt.registerTask('test', function (target) {

        grunt.task.run('jshint');

        if (target === 'build') {
            grunt.task.run([target]);
        }

        grunt.task.run([
            'connect:' + target,
            'watch'
        ]);

    });

};
