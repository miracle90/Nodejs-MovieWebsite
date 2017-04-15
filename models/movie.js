var mongoose = require('mongoose');    					// 加载mongoose工具模块
var MovieSchema = require('../schemas/movies');   		// 引入模式文件
var Movie = mongoose.model('Movie', MovieSchema);   	// 编译生成Movie这个模型

// 导出
module.exports = Movie