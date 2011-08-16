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
