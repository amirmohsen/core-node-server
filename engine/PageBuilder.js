function PageBuilder() {}

PageBuilder.options = {};
PageBuilder.sourceDir = Path.join(__ROOT,"app/views/pages");
PageBuilder.destDir = Path.join(__ROOT,"public");

PageBuilder.buildAll = function(){

	FS.removeSync(PageBuilder.destDir);

	var contents = FS.readdirSync(PageBuilder.sourceDir);

	contents.forEach(function(content){
		var path = Path.join(PageBuilder.sourceDir,content);
		PageBuilder.buildPage(path);
	});	
};

PageBuilder.buildOne = function(path) {

	path = Path.join(PageBuilder.sourceDir, path);

	function isPage(){
		try {
			var stats = FS.statSync(path);
			if(stats.isDirectory()){
				path = Path.join(path, "index.html");
				return isPage();
			}
			else if(stats.isFile() &&
				Path.extname(path) === ".html")
				return true;
			else
				return false;
		}
		catch(e){
			return false;
		}
	}

	if(!isPage())
		return;

	PageBuilder.buildPage(path);
};

PageBuilder.buildPage = function(path) {
	var stats = FS.statSync(path);
	if(stats.isFile() &&
			Path.extname(path) === ".html"){
		var data = FS.readFileSync(path, {
			encoding: "utf8"
		});

		data = Mustache.render(data, PageBuilder.options);

		FS.outputFileSync(
			Path.join(PageBuilder.destDir, Path.basename(path)),
			data,
			{
				encoding: "utf8"
			}
		);
	}
};

module.exports = PageBuilder;