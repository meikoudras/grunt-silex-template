/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

// Basic template description.
exports.description = 'A new Silex project';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'A Silex project with DB support';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {
  grunt.helper('prompt', {}, [
    // Prompt for these values.
    grunt.helper('prompt_for', 'name'),
    grunt.helper('prompt_for', 'title'),
    {
      name: 'database_name',
      message: 'Database name',
      default: function(value, data, done) {
        var database_name = data.name || '';
        done(null, database_name);
      }
    },
    {
      name: 'database_user',
      message: 'Database user',
      default: 'root'
    },
    {
      name: 'database_password',
      message: 'Database password',
      default: 'root'
    },
    {
      name: 'database_host',
      message: 'Database host',
      default: 'localhost'
    },
    {
      name: 'entity_psr0',
      message: 'Entity psr-0 namespace ex. ProjectName',
      default: function(value, data, done) {
        var entity_namespace = data.name || '';
        entity_namespace = entity_namespace.replace(/[\W_]+/g, '');
        entity_namespace = entity_namespace.replace(/\w+/g, function(word) {
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        done(null, entity_namespace);
      }
    },
    {
      name: 'entity_namespace',
      message: 'Entity namespace for Doctrine entitities ex. Project\\Entity',
      default: function(value, data, done) {
        var entity_namespace = data.entity_psr0 || '';
        entity_namespace = entity_namespace.replace(/[\W_]+/g, '');
        entity_namespace = entity_namespace.replace(/\w+/g, function(word) {
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        entity_namespace += '\\Entity';
        done(null, entity_namespace);
      }
    }
  ], function(err, props) {
    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'templates/**'});

    /* symlink task */
    grunt.registerTask('config', 'Creating symlink to config', function(){
      var done = this.async();
      symlog = grunt.log.write('Creating symlink ');
      grunt.utils.spawn({cmd:'ln', args:['-s','config/config-dev.php', 'config.php']}, function(error, result, code) {
        if(error){
          grunt.log.write(error).error();
        }else{
          symlog.ok();
        }
        
        done();
      });
    });

    /* creating empty database task */
    grunt.registerTask('mysql', 'Creating MYSQL database', function(){
      var done = this.async();
      dblog = grunt.log.write('Creating MYSQL database...').ok();
      var db_user = props.database_user;
      var db_pass = props.database_password;
      var db_name = props.database_name;
      var create = 'CREATE DATABASE '+db_name+' DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;';
      var options = {
        cmd: 'mysql',
        // An array of arguments to pass to the command.
        args: ['-u', db_user, '-p'+db_pass, '-e', create]
      };
      function doneFunction(error, result, code) {
        if(error){
          grunt.log.write(error).error();
        }else{
          dblog.ok();
        }
        
        grunt.log.write(result.stdout);
        done();
      }

      var proc = grunt.utils.spawn(options, doneFunction);
    });
    
    /* downloading dependencies */
    grunt.registerTask('composer', 'Composer', function() {
      var done = this.async();
      composerLog = grunt.log.write('Starting composer... ');
      var options = {
        cmd: 'composer',
        // An array of arguments to pass to the command.
        args: ['update']
      };
      function doneFunction(error, result, code) {
        if(error){
          grunt.log.write(error).error();
        }else{
          composerLog.ok();
        }
        
        grunt.log.write(result.stdout);
        done();
      }

      var proc = grunt.utils.spawn(options, doneFunction);
      proc.stdout.on('data', function (data) {
        grunt.log.write(data.toString());
      });
    });
    grunt.task.run(['config', 'mysql', 'composer']);
    

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};