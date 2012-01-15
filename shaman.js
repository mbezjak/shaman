// Shaman - track TV shows
// Copyright (C) 2011,2012 Miro Bezjak
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

Ext.ns('shaman', 'shaman.data', 'shaman.link');

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

shaman.link.imdb = function(model) {
  var link   = model.get('imdb');
  var name   = model.get('name');
  var search = 'http://www.imdb.com/find?s=tt&q={0}';

  return link || Ext.String.format(search, name);
};

shaman.link.wiki = function(model) {
  var link   = model.get('wiki');
  var name   = model.get('name');
  var search = 'http://en.wikipedia.org/wiki/Special:Search?search={0}';

  return link || Ext.String.format(search, name);
};

shaman.link.btjunkie = function(model) {
  var name    = model.get('name');
  var season  = Ext.String.leftPad(model.get('season'), 2, '0');
  var episode = Ext.String.leftPad(model.get('episode'), 2, '0');
  var search  = 'http://btjunkie.org/search?q={0} s{1}e{2}';

  return Ext.String.format(search, name, season, episode);
};

shaman.link.isohunt = function(model) {
  var name    = model.get('name');
  var season  = Ext.String.leftPad(model.get('season'), 2, '0');
  var episode = Ext.String.leftPad(model.get('episode'), 2, '0');
  var search  = 'http://isohunt.com/torrents/?ihq={0} s{1}e{2}';

  return Ext.String.format(search, name, season, episode);
};

shaman.link.open = function(link) {
  if (window.shamanBrowser) {
    shamanBrowser.open(link);
  } else {
    window.open(link);
  }
};

Ext.define('shaman.Show', {
  extend     : 'Ext.data.Model',
  idProperty : 'name',
  fields     : [
    { name : 'name',    type : 'string' },
    { name : 'group',   type : 'string' },
    { name : 'season',  type : 'int'    },
    { name : 'episode', type : 'int'    },
    { name : 'imdb',    type : 'string' },
    { name : 'wiki',    type : 'string' }
  ]
});

Ext.define('shaman.Store', {
  extend     : 'Ext.data.Store',
  model      : 'shaman.Show',
  storeId    : 'shows',
  groupField : 'group',
  listeners  : {
    add    : shaman.data.write,
    remove : shaman.data.write,
    update : shaman.data.write
  }
});

Ext.define('shaman.Grid', {
  extend   : 'Ext.grid.Panel',
  title    : 'Shaman',
  columns  : [
    { header: 'Name',    dataIndex: 'name',    editor: 'textfield'   },
    { header: 'Group',   dataIndex: 'group',   editor: { xtype: 'combobox', store: ['active', 'inactive', 'maybe', 'notwatching', 'ended']} },
    { header: 'Season',  dataIndex: 'season',  editor: 'numberfield' },
    { header: 'Episode', dataIndex: 'episode', editor: 'numberfield' },
    { header: 'imdb',    dataIndex: 'imdb',    editor: 'textfield'   },
    { header: 'wiki',    dataIndex: 'wiki',    editor: 'textfield'   },
    { xtype: 'actioncolumn',
      items: [{
        icon: 'resources/imdb.ico',
        handler: function(self, rowIndex) {
          var model = self.getStore().getAt(rowIndex);
          shaman.link.open(shaman.link.imdb(model));
        }
      }, {
        icon: 'resources/wiki.ico',
        handler: function(self, rowIndex) {
          var model = self.getStore().getAt(rowIndex);
          shaman.link.open(shaman.link.wiki(model));
        }
      }, {
        icon: 'resources/btjunkie.ico',
        handler: function(self, rowIndex) {
          var model = self.getStore().getAt(rowIndex);
          shaman.link.open(shaman.link.btjunkie(model));
        }
      }, {
        icon: 'resources/isohunt.png',
        handler: function(self, rowIndex) {
          var model = self.getStore().getAt(rowIndex);
          shaman.link.open(shaman.link.isohunt(model));
        }
      }]
    }
  ],
  selType  : 'rowmodel',
  features : [{ ftype: 'grouping' }]
});

Ext.onReady(function() {

  var store = new shaman.Store({
    data : shaman.data.read()
  });

  var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToEdit : 2
  });

  var addShow = function() {
    store.insert(0, new shaman.Show({ group: 'maybe' }));
    rowEditing.startEdit(0, 0);
  };

  new Ext.util.KeyMap(Ext.getBody(), {
    key     : Ext.EventObject.F9,
    handler : addShow
  });

  var grid = new shaman.Grid({
    region  : 'center',
    store   : store,
    plugins : rowEditing,
    tbar    : [{
      text    : 'Add Show',
      handler : addShow
    }, {
      text    : 'Delete Show',
      handler : function() {
        var selected = grid.getSelectionModel().getSelection()[0];
        if (selected) {
          store.remove(selected);
        }
      }
    }]
  });

  new Ext.Viewport({
    layout   : 'border',
    renderTo : Ext.getBody(),
    items    : [grid]
  });

});
