const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  exports.initialize();
  counter.getNextUniqueId((err, data) => {
    // console.log(data);
    //console.log("TEXT", text);
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + data + '.txt', text, (err) => {
        if (err) {
          throw ('error writing todo file');
        } else {

          items[data] = text;
          callback(null, { id: data, text: text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, items) => {
    var data = _.map(items, fileName => {
      let id = path.basename(fileName, '.txt');
      return { id: id, text: id };
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data });
    }
  });
  //var text = items[id];
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
