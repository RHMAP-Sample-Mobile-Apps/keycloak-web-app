'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'application.js', 'public/**/*.js'],
        options: {
          livereload: 30000
        }
      },
      html: {
        files: ['public/*.html'],
        options: {
          livereload: 30000
        }
      }
    },
    nodemon: {
      dev: {
        script: 'application.js',
        options: {
          args: [],
          ignore: ['public/**'],
          ext: 'js,html',
          nodeArgs: [],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      serve: ['nodemon', 'watch', 'open:liveCloud'],
      serveLocal: ['nodemon', 'watch', 'open:localCloud'],
      debug: ['node-inspector', 'shell:debug', 'open:debug'],
      options: {
        logConcurrentOutput: true
      }
    },
    env : {
      options : {},
      // environment variables - see https://github.com/jsoverson/grunt-env for more information
      local: {
        FH_PORT: 8002,
        FH_USE_LOCAL_DB: true,
        FH_SERVICE_MAP: function() {
          /*
           * Define the mappings for your services here - for local development.
           * You must provide a mapping for each service you wish to access
           * This can be a mapping to a locally running instance of the service (for local development)
           * or a remote instance.
           */
          var serviceMap = {
            'SERVICE_GUID_2': 'https://host-and-path-to-service'
          };
          return JSON.stringify(serviceMap);
        }
      }
    },
    'node-inspector': {
      dev: {}
    },
    shell: {
      debug: {
        options: {
          stdout: true
        },
        command: 'env NODE_PATH=. node --debug-brk application.js'
      }
    },
    open: {
      debug: {
        path: 'http://127.0.0.1:8001/debug?port=5858',
        app: 'Google Chrome'
      },
      localCloud: {
        path: 'http://127.0.0.1:8002?url=http://127.0.0.1:8003',
        app: 'Firefox'
      },
      liveCloud: {
        path: 'http://127.0.0.1:8002',
        app: 'Google Chrome'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

grunt.registerTask('serve', function (target) {
    if (target === 'local') {
      grunt.task.run(['env:local','concurrent:serveLocal']);
    } else {
      // open with no url passed to fh-js-sdk
      grunt.task.run(['env:local', 'concurrent:serve']);
    }

});

  // grunt.registerTask('serve', ['env:local', 'concurrent:serve']);
  grunt.registerTask('debug', ['env:local', 'concurrent:debug']);
  grunt.registerTask('default', ['serve']);
};
