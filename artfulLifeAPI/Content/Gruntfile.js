module.exports = function(grunt) {
 
	grunt.registerTask('default', [ 'watch' ]);
 	grunt.registerTask('watch', [ 'watch' ]);

	grunt.initConfig({
		watch: {
			html: {
				files: ['{,*/}*.html'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: ['assets/js/*.js'],
				options: {
					livereload: true,
				}
			},
			css: {
				files: ['assets/css/global.css'],
				options: {
					livereload: true,
				},
				tasks: ['csssplit']
			},
			sass: {
				files: ['**/*.scss'],
				tasks: ['compass:dist']
			},
		}
	}); 
};