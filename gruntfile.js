module.exports = function(grunt) {
	// 各个定义的任务
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true			// 当文件出现改动时，重新启动服务
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// tasks: ['jshint'],
				options: {
					livereload: true			// 当文件出现改动时，重新启动服务
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store	'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1000,    // 如果有大批量文件需要编译时
					env: {
						PORT: '3000'
					},
					cwd: ''
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConCurrentOutput: true
			}
		}
	});

	// 加载任务插件
	grunt.loadNpmTasks('grunt-contrib-watch');  // 文件添加修改删除。。之后重新注册任务
	grunt.loadNpmTasks('grunt-nodemon');        // 实时监听app.js，如何文件出现改动时自动重启项目
	grunt.loadNpmTasks('grunt-concurrent');		// 针对慢任务开发插件，可以跑多个阻塞的任务

	grunt.option('force', true);                // 为了不要因为语法错误警告。。。中断整个服务

	grunt.registerTask('default', ['concurrent']);   // 注册默认任务
}