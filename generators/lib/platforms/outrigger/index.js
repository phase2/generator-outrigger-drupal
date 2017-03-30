'use strict'

module.exports = {
  id: 'outrigger',
  label: 'Default',
  description: 'Developing in the default Outrigger-based environment.',
  docker: require('./docker.json'),
  tools: require('./tools.json')
}
