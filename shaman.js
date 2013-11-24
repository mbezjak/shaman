// Shaman - track TV shows
// Copyright (C) 2011-2013 Miro Bezjak
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

shaman.version = '0.7';

shaman.data.dateAsString = function(date) {
  return Ext.Date.format(date, 'Y-m-d');
};

shaman.data.stringAsDate = function(date) {
  return Ext.Date.parse(date, 'Y-m-d');
};

shaman.data.withUpdated = function(array, fn) {
  return (array || []).map(function(obj) {
    return Ext.applyIf({ updated : fn(obj.updated) }, obj);
  });
};

shaman.data.intoString = function (data) {
  var withUpdated = shaman.data.withUpdated(data, shaman.data.dateAsString);
  return JSON.stringify(withUpdated, null, '  ');
};

shaman.data.fromString = function (data) {
  return shaman.data.withUpdated(JSON.parse(data), shaman.data.stringAsDate);
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

shaman.data.update = function(store, record) {
  record.set('updated', new Date());
  shaman.data.write(store);
};

shaman.data.write = function(store) {
  var data = store.getRange().map(function(model) {
    return model.getData();
  });
  var value = shaman.data.intoString(data);

  if (window.shamanStorage) {
    shamanStorage.write(value);
  } else {
    localStorage.setItem('shows', value);
  }
};

shaman.data.appendPath = function(base, suffix) {
  if (base.charAt(base.length - 1) !== '/') {
    base += '/';
  }

  return base + suffix;
};

shaman.link.imdb = function(model) {
  var link   = model.get('imdb');
  var name   = model.get('name');
  var search = 'http://www.imdb.com/find?s=tt&q={0}';

  return link || Ext.String.format(search, name);
};

shaman.link.imdbSeason = function(model) {
  var link   = model.get('imdb');
  var suffix = Ext.String.format('episodes?season={0}', model.get('season'));

  return link ? shaman.data.appendPath(link, suffix) : shaman.link.imdb(model);
};

shaman.link.wiki = function(model) {
  var link   = model.get('wiki');
  var name   = model.get('name');
  var search = 'http://en.wikipedia.org/wiki/Special:Search?search={0} tv';

  return link || Ext.String.format(search, name);
};

shaman.link.fenopy = function(model) {
  var name    = model.get('name');
  var season  = Ext.String.leftPad(model.get('season'), 2, '0');
  var episode = Ext.String.leftPad(model.get('episode'), 2, '0');
  var search  = 'http://fenopy.se/?keyword={0} s{1}e{2}';

  return Ext.String.format(search, name, season, episode);
};

shaman.link.open = function(link) {
  if (window.shamanBrowser) {
    shamanBrowser.open(link);
  } else {
    window.open(link);
  }
};

shaman.link.createAction = function(linkFn, icon) {
  return {
    icon    : 'resources/' + icon,
    handler : function(self, rowIndex) {
      var model = self.getStore().getAt(rowIndex);
      var link  = shaman.link[linkFn](model);
      shaman.link.open(link);
    }
  };
};

shaman.xDaysAgo = function(date) {
  if (!date) return "";

  var diff         = Date.now() - date.getTime();
  var millisPerDay = 1000 * 60 * 60 * 24;
  var days         = Math.floor(diff / millisPerDay);

  return (days === 0) ? 'today' : (Ext.util.Format.plural(days, 'day') + ' ago');
};

Ext.define('shaman.Show', {
  extend     : 'Ext.data.Model',
  idProperty : 'name',
  fields     : [
    { name : 'name',    type : 'string' },
    { name : 'group',   type : 'string' },
    { name : 'season',  type : 'int'    },
    { name : 'episode', type : 'int'    },
    { name : 'updated', type : 'date'   },
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
    update : shaman.data.update
  }
});

Ext.define('shaman.Grid', {
  extend   : 'Ext.grid.Panel',
  title    : 'Shaman',
  selType  : 'rowmodel',
  features : [{ ftype: 'grouping' }],
  columns  : [
    { header: 'Name',        dataIndex: 'name',    editor: 'textfield'   },
    { header: 'Group',       dataIndex: 'group',   editor: { xtype: 'combobox', store: ['active', 'inactive', 'maybe', 'notwatching', 'ended']} },
    { header: 'Season',      dataIndex: 'season',  editor: 'numberfield' },
    { header: 'Episode',     dataIndex: 'episode', editor: 'numberfield' },
    { header: 'Last update', dataIndex: 'updated', renderer: shaman.xDaysAgo },
    { header: 'imdb',        dataIndex: 'imdb',    editor: 'textfield'   },
    { header: 'wiki',        dataIndex: 'wiki',    editor: 'textfield'   },
    { xtype: 'actioncolumn', items: [
        shaman.link.createAction('imdb',       'imdb.png'),
        shaman.link.createAction('imdbSeason', 'format-justify-center.png'),
        shaman.link.createAction('wiki',       'wiki.ico'),
        shaman.link.createAction('fenopy',     'fenopy.ico')
      ] }
  ]
});

Ext.onReady(function() {

  Ext.tip.QuickTipManager.init();

  var store = new shaman.Store({
    data : shaman.data.read()
  });

  var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToEdit : 2
  });

  var addShow = function() {
    store.insert(0, new shaman.Show({ group: 'maybe', updated: new Date() }));
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
      tooltip : 'Shortcut key: <b>F9</b>',
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

  var disclaimer = new Ext.Component({
    region : 'south',
    html   : '<i>All icons belong to their respective owners</i>'
  });

  new Ext.Viewport({
    layout   : 'border',
    renderTo : Ext.getBody(),
    items    : [grid, disclaimer]
  });

});
