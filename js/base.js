requirejs.config({
    baseUrl: 'js',
    paths: {
        build: 'app/build',
    },
});

require(['build'],
	function(build) {
		build.unit();
	}
);



