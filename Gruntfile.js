
module.exports = function(grunt) {

  /*
    files: {
      'dest/output.min.js': ['js/src/**\/*.js']
    }
  */

  //var path = "z:/"+grunt.option( "web" )+"/";
  //var path = "c:/git/grunt/";
  var path = "";
  //CSS CONFIG
  var outPutCss = path+"css/style.css";
  var lessFiles = {};
      lessFiles[outPutCss] = [
        path+"css/less/_normalize.less",
        path+"css/less/remixins.less",
        path+"css/less/style.less"
      ];
  var toMinifyCss = {};
      toMinifyCss[outPutCss] = outPutCss;
  //JAVASCRIPT CONFIG
  var outputJs = path+"js/main.min.js";
  var mainJsFile = {};
      mainJsFile[outputJs] = [ path+'js/main.js' ];

  var modulesToCompile = {
        expand: true,
        cwd: path+'js/src',
        src: [ 'modules/*.js'],
        dest: path+'js/dist/'
      };

  if(grunt.option("proj") == "angular-concat"){
      modulesToCompile = {};
      mainJsFile = {};
      modulesToCompile[path+"js/dist/libs.min.js"] = [ 
        'js/src/lib/*.js'
      ];
      mainJsFile[path+"js/dist/main.min.js"] = [ 
        'js/*.js',
        'js/src/modules/*.js',
        'js/src/ng/*.js',
        'js/src/ng/services/*.js',
        'js/src/ng/directives/*.js',
        'js/src/ng/controlers/*.js',
        'js/src/ng/controllers/*.js',
      ];
  }

  if(grunt.option("proj") == "angular"){
      modulesToCompile = {
        expand: true,
        cwd: path+'js/src',
        src: [
          'ng/*.js',
          'ng/services/*.js',
          'ng/directives/*.js',
          'ng/controlers/*.js',
          'ng/controllers/*.js',
          'lib/*.js',
          'modules/*.js',
        ],
        dest: path+'js/dist/'
      };
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css: {
        files: [
          path+"css/less/_normalize.less",
          path+"css/less/remixins.less",
          path+"css/less/style.less"
        ],
        tasks: ['css'],
        options: {
          spawn: false,
        }
      },
      src: {
        files: [
          path+'js/*.js',
          path+'js/src/ng/*.js',
          path+'js/src/ng/services/*.js',
          path+'js/src/ng/directives/*.js',
          path+'js/src/ng/controlers/*.js',
          path+'js/src/ng/controllers/*.js'
        ],
        tasks: ['js'],
        options: {
          spawn: false,
        }
      }
    },//end-watch
    uglify: {
      options: {
        compress: true,
        mangle: {
          except: ['jQuery', 'angular']
        }
      },
      build: {
        files: [
          mainJsFile,
          modulesToCompile
        ]
      }
    },
    less: {
      build: {
        files: lessFiles
      }
    },
    cssmin: {
      combine: {
        files: toMinifyCss
      }
    }
  });

grunt.event.on('watch', function(action, filepath, target) {
  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('css', ['less', 'cssmin']);
  grunt.registerTask('js', ['uglify']);
  grunt.registerTask('w', ['watch']);

};