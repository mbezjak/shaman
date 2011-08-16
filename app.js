Ext.ns('shaman');

Ext.define('shaman.Show', {
  extend: 'Ext.data.Model',
  idProperty: 'name',
  fields: [
    { name: 'name',    type: 'string' },
    { name: 'group',   type: 'string' },
    { name: 'season',  type: 'int'    },
    { name: 'episode', type: 'int'    },
    { name: 'imdb',    type: 'string' },
    { name: 'wiki',    type: 'string' }
  ]
});

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

Ext.define('shaman.Grid', {
  extend: 'Ext.grid.Panel',
  title: 'Shaman',
  columns: [
    { header: 'Name',    dataIndex: 'name',    editor: 'textfield'   },
    { header: 'Group',   dataIndex: 'group',   editor: 'textfield'   },
    { header: 'Season',  dataIndex: 'season',  editor: 'numberfield' },
    { header: 'Episode', dataIndex: 'episode', editor: 'numberfield' },
    { header: 'imdb',    dataIndex: 'imdb',    editor: 'textfield'   },
    { header: 'wiki',    dataIndex: 'wiki',    editor: 'textfield'   }
  ],
  selType: 'rowmodel',
  features: [{ ftype: 'grouping' }]
});
