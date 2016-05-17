// in Gruntfile.js
module.exports = function (grunt) {

    'use strict';

    var dateFormat = require('dateformat');

    //var tests = 'test/**/*_test.js';
    //var tasks = 'tasks/**/*.js';
    //var reportDir = 'build/reports/' + dateFormat(new Date(), 'yyyymmdd-HHMMss');

    grunt.initConfig({
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: 'tests/coverage/instrument/'
            }
        },
        instrument: {
            files: 'src/*.js',
            options: {
                lazy: true,
                basePath: 'tests/coverage/instrument/'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['tests/coverage/instrument/src/*.js', 'tests/*.js']
        },
        storeCoverage: {
            options: {
                dir: 'tests/coverage/reports'
            }
        },
        reloadTasks: {
            rootPath: 'build/instrument/tasks'
        },
        makeReport: {
            src: 'tests/coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'tests/coverage/reports',
                print: 'detail'
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-istanbul');

    /*grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest',
        'storeCoverage', 'makeReport']); */

    grunt.registerTask('coverage', [ 'instrument', 'mochaTest',
        'storeCoverage', 'makeReport']);
};



