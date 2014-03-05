var Post = require('../models/post.js');

module.exports = function(app){
    app.get('/', function(req, res){
        Post.get(null, function(err, posts){
            if(err){
                posts = [];
            }
            res.render('index', {
                title: 'timeline',
                posts: posts
            })
        })
    });
    app.post('/post', function(req, res){
        post = new Post(req.body.content);
        post.save(function(err){
            if(err){
                return res.redirect('/');
            }
            res.redirect('/');
        });
    });
};
