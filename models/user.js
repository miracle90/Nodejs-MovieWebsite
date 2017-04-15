var mongoose = require('mongoose');    					// 加载mongoose工具模块
var UserSchema = require('../schemas/user');   		// 引入模式文件
var User = mongoose.model('Movie', UserSchema);   	// 编译生成Movie这个模型

// 导出
module.exports = User