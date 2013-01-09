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
      name: 'entity_namespace',
      message: 'Entity namespace for Doctrine entitities ex. Project\\Entity',
      default: function(value, data, done) {
        var entity_namespace = data.name || '';
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

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};