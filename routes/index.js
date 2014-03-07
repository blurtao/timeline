var Post = require('../models/post.js');
var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app){
    app.get('/', function(req, res){
        Post.get(null, function(err, posts){
            if(err){
                posts = [];
            }
            res.render('index', {
                title: 'timeline',
                posts: posts,
                user: req.session.user

            })
        })
    });
    app.post('/post', checkLogin);
    app.post('/post', function(req, res){
        post = new Post(req.body.content, req.session.user.username);
        post.save(function(err){
            if(err){
                return res.redirect('/');
            }
            res.redirect('/');
        });
    });
    app.post('/reg', function(req, res){
        var username = req.body.username,
            password = req.body.password,
            email = req.body.email;
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            username: req.body.username,
            password: password,
            email: req.body.email
        });
        User.get(newUser.username, function(err, user){
            if(user){
                return res.redirect('/');
            }
            newUser.save(function(err, user){
                if(err){
                    return res.redirect('/');
                }
                req.session.user = user;
                res.redirect('/');
            })
        })
    });
    app.post('/login', function(req, res){
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.username, function(err, user){
            if(!user){
                req.flash('error','用户名或密码错误-1');
                return res.redirect('/alert');

            }
            if(user.password != password){
                console.log(user.password);
                console.log(password)
                req.flash('error','用户名或密码错误-2');
                return res.redirect('/alert');

            }
            req.session.user = user;
            req.flash('success','登录成功-3');
            res.redirect('/');

        });
    });
    app.get('/alert', function(req, res){
        res.render('alert', {
            title: 'timeline',
            user: req.session.req,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get('/logout', function(req, res){
        req.session.user = null;
        res.redirect('/');
    })
    function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash('error','未登录');
            res.redirect('/alert');
        }
        next();
    };
    app.get('/u/:username', function(req, res){
        d
    })


};
