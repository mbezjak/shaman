Ext.define('shaman.Show', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'name',    type: 'string' },
    { name: 'group',   type: 'string' },
    { name: 'season',  type: 'int'    },
    { name: 'episode', type: 'int'    },
    { name: 'imdb',    type: 'string' },
    { name: 'wiki',    type: 'string' }
  ]
});
