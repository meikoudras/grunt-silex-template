/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

// Basic template description.
exports.description = 'Testing template';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'Testing template';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  grunt.helper('prompt', {type: 'test'}, [
    // Prompt for these values.
    grunt.helper('prompt_for', 'name'),
    grunt.helper('prompt_for', 'title', function(value, data, done) {
      // Fix jQuery capitalization.
      value = value.replace(/jquery/gi, 'jQuery');
      done(null, value);
    })
  ], function(err, props) {
    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'libs/**'});

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};
