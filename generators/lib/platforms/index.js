'use strict';

var _ = require('lodash');
var path = require('path');
var requireDirectory = require('../util').requireDirectory;

function init() {
  var module = {};

  function load() {
    var file_path = path.resolve(__dirname);
    return requireDirectory(file_path);
  };

  function toPromptOptions(answers) {
    var choices = load();

    return _.map(choices, function (choice) {
      return _.mapKeys(choice, function (value, key) {
        var map = {
          id: 'value',
          label: 'name',
          description: 'short'
        };

        return map[key];
      });
    });
  };

  module.load = load;
  module.toPromptOptions = toPromptOptions;

  return module;
}

module.exports = init();
