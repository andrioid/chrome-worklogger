(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var dbw = {}; // namespace
var db; // internal db handler
var osname = "worklog"

dbw.init = function(success, error) {
    var openRequest = indexedDB.open("worklogger",1);

    openRequest.onupgradeneeded = function(e) {
        console.log("Creating Object Store with Indexes");

        var thisDb = e.target.result;

        //uncomment for quick testing
        //thisDb.deleteObjectStore("worklog");

        //Create objectStore
        if(!thisDb.objectStoreNames.contains(osname)) {
            var objectStore = thisDb.createObjectStore(osname, { keyPath: "id", autoIncrement:true });
            objectStore.createIndex("date","date", {unique:false});
            objectStore.createIndex("tags","tags", {unique:false,multiEntry:true});
        }

    }

    openRequest.onsuccess = function(e) {

        db = e.target.result;
        if (success) success();

        db.onerror = function(event) {
            // Generic error handler for all errors targeted at this database's
            // requests!
            console.log("Database error: " + event.target.errorCode);
            console.dir(event.target);
        };
    }

};

/**
 * All dates are YYYY-MM-DD
 */
dbw.getByDate = function(from, to) {

}

dbw.addData = function(dataobj, success) {
    var transaction = db.transaction([osname], "readwrite");
    var objectStore = transaction.objectStore(osname);
    var req = objectStore.add(dataobj);
    req.onsuccess = function() {
        if (success) success();
        //console.log("Data added");
    };
    req.onerror = function(e) {
        console.err("Add DB error: " + e);
    }
}

dbw.getAll = function(success) {
    var transaction = db.transaction([osname], "readonly");
    var objectStore = transaction.objectStore(osname);
    var request = objectStore.openCursor();
    var results = [];

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            results.push(cursor.value);
            //console.log(cursor.key);
            //console.log(cursor.value);
            cursor.continue();
        } else {
            if (success) success(results);
        }
    }
}

dbw.delItem = function (id, cb) {
    var request = db.transaction([osname], "readwrite")
        .objectStore(osname)
        .delete(id);
    request.onsuccess = function(event) {
        if (cb) cb();
    };
}


module.exports = dbw;
},{}],2:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
var React = require("react");
var db = require("./dbwrapper.js");
var $ = require("jquery-browserify");
var select2 = require("select2");

db.init();

var Popup = React.createClass({displayName: 'Popup',
    submitHandler: function(e) {
        var tags = this.state.tags.split(",");
        db.addData({
            "tags": tags,
            "date": this.state.date,
            "hours": this.state.hours,
            "description": this.state.description
        }, function() {
            alert("Saved");
        })
        e.preventDefault();

    },
    handleTags: function(e) {
        this.setState({tags: e.target.value});
    },
    handleHours: function(e) {
        this.setState({hours: e.target.value});
    },
    handleDate: function(e) {
        this.setState({date: e.target.value});
    },
    handleDescription: function(e) {
        this.setState({description: e.target.value});
    },
    render: function() {
        return (
            React.DOM.form( {onSubmit:this.submitHandler}, 
                React.DOM.div( {class:"form-container"}, 
                    React.DOM.div( {class:"form-row"}, 
                        React.DOM.label(null, "Tags"),
                        React.DOM.p(null, React.DOM.input( {name:"tags", type:"text", id:"tag_selection", className:"full-width", tabIndex:"1"} ))
                    ),
                    React.DOM.div( {className:"form-row"}, 
                        React.DOM.div( {class:"first-column half-width"}, 
                            React.DOM.label(null, "Hours"),
                            React.DOM.p(null, React.DOM.input( {id:"form-hours", name:"hours", type:"text", className:"short", tabIndex:"2", onChange:this.handleHours}))
                        ),
                        React.DOM.div( {class:"second-column half-width"}, 
                            React.DOM.label(null, "Date"),
                            React.DOM.p(null, React.DOM.input( {name:"date", type:"date", className:"short", id:"form-date", onChange:this.handleDate}))
                        )
                    ),
                    React.DOM.div( {className:"form-row"}, 
                        React.DOM.label(null, "Description (optional)"),
                        React.DOM.p(null, React.DOM.textarea( {id:"form-summary", name:"summary", className:"full-width", tabIndex:"3", onChange:this.handleDescription}))
                    ),
                    React.DOM.div( {className:"form-row"}, 
                        React.DOM.button( {type:"submit", tabIndex:"4"}, "Log & Clear"), " -  ",
                        React.DOM.a( {class:"sublink", href:"options.html", target:"_blank"}, "Options"), " -  ",
                        React.DOM.a( {class:"sublink", href:"views.html", target:"_blank"}, "Views")
                    )
                )
            )
        );
    },
    componentDidMount: function(rootNode) {
        var self = this;
        $('#tag_selection').select2({
            tags: [],
            //tags: tags,
            tokenSeparators: [",", " "]
        });
        $('#tag_selection').change(this.handleTags);
        /*
        $(rootNode).select2();

        if (this.props.defaultValue != null) {
            $(rootNode).select2("val", this.props.defaultValue);
        }

        $(rootNode).on("change", this._handleChange);
        */
    }
});
//Todo: Get tags and stuff from configuration, then call component with the tags prop
React.renderComponent(Popup(null), document.getElementById('popup'));

},{"./dbwrapper.js":1,"jquery-browserify":"zaqfHq","react":"BUgOH+","select2":"3sRwfR"}]},{},[2])