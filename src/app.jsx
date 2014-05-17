/**
 * @jsx React.DOM
 */

var ldb = require("localstoragedb");
var Popup = require("./popup.jsx");
var db = require("./dbwrapper.js");


//var popup = require('./components/popup.jsx');

// Main Entry Point (initialization and stuff)

db.init(function() {
    db.addData({
        date: "2014-17-05",
        tags: ["pie", "love", "gir", "tuna"],
        hours: 4,
        description: "test data"
    }, function() {
        db.getAll();
    });
});