module.exports.append = function (yo, src, dest, partial) {
  // Inject a partial include to the already generated README.
  // Our infrastructure section uses the standard template system.
  yo.fs.copy(
    src,
    dest,
    {
      process: function(contents) {
        return contents + '\n' + '<% include ' + partial + ' %>';
      }
    }
  );
};
