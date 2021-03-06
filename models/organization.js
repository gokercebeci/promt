/* The DAO must be constructed with a connected database object */
function OrganizationsDAO(db) {
    "use strict";
    
    var collection = "organizations";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof OrganizationsDAO)) {
        console.log('Warning: '+ collection +'DAO constructor called without "new" operator');
        return new OrganizationsDAO(db);
    }
    
    var mongo = db.collection(collection);

    // ADD
    // ========================================================================    
    this.add = function (project, title, user, bound, author, callback) {
        "use strict";

        // Build a new item
        var item = {
            "project": project,
            "title": title,
            "user": user,
            "status": 'active',
            "bound": bound,
            "author": author,
            "date": new Date()
        }

        console.log("add an item in ", collection, item);

        mongo.insert(item, function (err, id) {
            if (err) return callback(err, null);
            callback(null, item);
        });
    }

    // GET
    // ========================================================================
    this.get = function (ID, callback) {
        "use strict";

        console.log("get an item in ", collection, ID);

        mongo.findOne({
            '_id': new require('mongodb').ObjectID(ID)
        }, function (err, item) {
            if (err) return callback(err, null);
            callback(err, item);
        });
    }

    // LIST
    // ========================================================================
    this.list = function (project, callback) {
        "use strict";

        console.log("list items from ", collection, project);
        
        mongo.find({
            'project': project,
            'status': 'active'
        }).sort('date', 1)
            .toArray(function (err, items) {
                "use strict";
                if (err) return callback(err, null);
                callback(err, items);
            });
    }

    // UPDATE
    // ========================================================================  
    this.update = function (project, callback) {
        "use strict";

        console.log('update an item in', collection, ID);

        mongo.findOne({
            '_id': new require('mongodb').ObjectID(ID)
        }, function (err, item) {
            if (err) return callback(err, null);

            var item = {
                "project": project,
                "title": title || item['title'],
                "user": user || item['user'],
                "status": 'active',
                "bound": item['_id'],
                "author": author,
                "date": new Date()
            }

            mongo.insert(item, function (err, id) {
                if (err) return callback(err, null);
                callback(null, item);
            });

        });

    }

    // DELETE
    // ========================================================================   

    this.delete = function (ID, callback) {
        "use strict";

        console.log('delete an item in', collection, ID);

        mongo.update({
            '_id': new require('mongodb').ObjectID(ID)
        }, {
            '$set': {
                'status': 'removed'
            }
        }, function (err, item) {
            if (err) return callback(err, null);
            callback(err, ID);
        });
    }
}

module.exports.OrganizationsDAO = OrganizationsDAO;