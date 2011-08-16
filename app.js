// Shaman - track TV shows
// Copyright (C) 2011 Miro Bezjak
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

Ext.onReady(function() {

  var store = new shaman.Store();

  var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToEdit: 1
  });

  new shaman.Grid({
    store: store,
    plugins: rowEditing,
    tbar: [{
      text: 'Add Show',
      handler: function() {
        rowEditing.cancelEdit();

        var show = Ext.ModelManager.create({}, 'shaman.Show');
        store.insert(0, show);

        rowEditing.startEdit(0, 0);
      }
    }],
    renderTo: Ext.getBody()
  });

});
