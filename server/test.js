"use strict";
exports.__esModule = true;
var db_1 = require("./db");
(0, db_1["default"])('test').insert({ name: 'reda', age: 22 }).then(function (r) { return console.log("added succesffully"); })["catch"](function (r) { return console.log('failed'); });
