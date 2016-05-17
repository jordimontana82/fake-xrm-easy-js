// in Gruntfile.js
module.exports = function (grunt) {

    grunt.initConfig({
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/app/'
            }
        },
        instrument: {
            files: 'src/*.js',
            options: {
                lazy: true,
                basePath: 'test/coverage/instrument/'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['tests/*.js']
        },
        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },
        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'test/coverage/reports',
                print: 'detail'
            }
        }
    });


};

grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-istanbul');

grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest',
    'storeCoverage', 'makeReport']);

