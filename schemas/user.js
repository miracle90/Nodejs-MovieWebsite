var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// 放入字段及类型
var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// meta：在更新数据时时间的记录
	meta: {
		// 创建时间
		createdAt: {
			type: Date,
			default: Date.now()
		},
		// 更新时间
		updateAt: {
			type: Date,
			default : Date.now() 
		}
	}
});

// 为模式添加一个方法，pre('save')每次在存储数据前都调用这个方法
UserSchema.pre('save', function(next) {
	var user = this;
	if (this.isNew) {
		this.meta.createdAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err)
			user.password = hash
			next();  // 继续存储流程
		})
	});
})

// 增加静态方法，需编译
UserSchema.statics = {
	// fetch：取出数据库中所有的数据
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')   // 排序
			.exec(cb)				 // 执行回调
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

// 导出模式
module.exports = UserSchema