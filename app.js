var express = require('express');  			// 加载express模块
var path = require('path');					// 引入path模块，有了样式，路径放在bower-components下面
var mongoose = require('mongoose');  		// 导入mongoose工具模块来连接本地的数据库
var _ = require('underscore');				// 引入underscore
var Movie = require('./models/movie');
var User = require('./models/user');
var port = process.env.PORT || 3000  		// 设置端口3000也可以从命令行中设置环境变量
var app = express();  						// 启动一个web服务器
var bodyParser = require('body-parser')  	// bodyParser 已经不再与Express捆绑，需要独立安装
var serveStatic = require('serve-static');  // 新版express4中，要独立安装static

// 连接数据库
mongoose.Promise = global.Promise; 			// 使用mongoose进行数据库操作时
mongoose.connect('mongodb://localhost:27017/imovie');

app.set('views', './views/pages');  				// 设置视图的根目录
app.set('view engine', 'jade');  					// 设置默认模板引擎
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('public'));  					// 由于public更改，所以此处也要更改
// app.use(express.bodyParser());  					// 加入bodyParser()方法，将表达的数据格式化
// app.use(express.static(path.join(__dirname, 'bower_components')));  // 静态资源的获取，在bower-components下面

app.locals.moment = require('moment');

app.listen(port);  // 监听端口
console.log('imooc started on port ' + port);

// index page
// 编写路由，实例的get方法，路由的匹配规则+一个回调方法
app.get('/', function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		})
	})
})

// 添加路由signup
app.post('/user/signup', function(req, res) {
	var _user = req.body.user;

})

// detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id

	// 查询
	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'imooc ' + movie.title,
			movie: movie
		})
	})
})

// admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			director: '',
			country: '',
			language: '',
			poster: '',
			flash: '',
			year: '',
			summary: ''
		}
	})
})

// admin update movie 后台更新页面
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc 后台更新页面',
				movie: movie
			})
		})
	}
})

// admin post movie 从表单post提交过来后电影数据的存储
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if (id != 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			// underscore中的_extend()方法替换字段
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}
				// 页面重定向到详情页面
				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})

// list page
app.get('/admin/list', function(req, res) {
	// 查询
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	})
})

// list delete movie
app.delete('/admin/list', function(req, res) {
	var id = req.query.id;
	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({success: 1});
			}
		})
	}
})