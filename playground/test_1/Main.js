"use strict";
var arr = [{ name: "r1" }, { name: "r2" }];
arr.forEach(function (item) { return console.log(item.name); });
var tmp = arr[0];
tmp.name = "r3";
arr.forEach(function (item) { return console.log(item.name); });
var arr2 = [1, 2, 3, 1, 1, 2, 3];
arr2.filter(function (item) { return item !== 1; }).forEach(function (item) { return console.log(item); });
