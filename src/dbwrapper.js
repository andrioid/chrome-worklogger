
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