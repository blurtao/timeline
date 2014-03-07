var mongodb = require('./db'),
    markdown = require('markdown').markdown;

function Post(content, username){
    this.content = content;
    this.username = username;
}

module.exports = Post;

Post.prototype.save = function(callback){
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    var post = {
        content: this.content,
        time: time,
        username: this.username
    }
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(post, {
                safe: true
            }, function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);

            });
        });
    });
};
Post.get = function(content, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(content){
                query.content = cotent;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    docs.forEach(function(doc){
                        doc.post = markdown.toHTML(doc.post);
                    })
                    callback(null, docs);
            });
        });

    });
}