Ext.define('shaman.Store', {
  extend: 'Ext.data.Store',
  model: 'shaman.Show',
  groupField: 'group',
  proxy: {
    type: 'memory',
    reader: {
      type: 'json',
      root: 'shows'
    }
  },
  data: {
    shows: [
      { name: 'foo', group: 'active' },
      { name: 'bar', group: 'inactive', season: 1 },
      { name: 'qux', group: 'inactive', season: 1, episode: 17 },
    ]
  }
});
