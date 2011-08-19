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

Ext.ns('shaman', 'shaman.data');

shaman.data.intoString = function (data) {
  return JSON.stringify(data, null, '  ');
};

shaman.data.fromString = function (data) {
  return JSON.parse(data);
};

shaman.data.read = function() {
  var data;
  if (window.shamanStorage) {
    data = shamanStorage.read();
  } else {
    data = localStorage.getItem('shows');
  }

  return shaman.data.fromString(data) || [];
};

shaman.data.write = function(store) {
  var data = store.getRange().map(function(model) {
    return model.data;
  });
  var value = shaman.data.intoString(data);

  if (window.shamanStorage) {
    shamanStorage.write(value);
  } else {
    localStorage.setItem('shows', value);
  }
};

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
    reader: { type: 'json' }
  },
  listeners: {
    add: shaman.data.write,
    remove: shaman.data.write,
    update: shaman.data.write
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

  var store = new shaman.Store({
    data: shaman.data.read()
  });

  var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToEdit: 1
  });

  var grid = new shaman.Grid({
    region: 'center',
    store: store,
    plugins: rowEditing,
    tbar: [{
      text: 'Add Show',
      handler: function() {
        store.insert(0, new shaman.Show());
        rowEditing.startEdit(0, 0);
      }
    }]
  });

  new Ext.Viewport({
    layout: 'border',
    renderTo: Ext.getBody(),
    items: [grid]
  });

});
