

var projectPath = "";
var projectFileName = "";


function saveProject( saveAsFlag ){

	// let content = "Some text to save into the file";
	let content = {
		"title" 	: projectTitle,
		"iftttDB"	: iftttDB,
		"setup"		: allSlotsProject
	};

	content = JSON.stringify(content);

	// create new folder and file
	if( !projectPath || fs.existsSync(projectPath) == false || saveAsFlag ){

		createNew();
	
	// update file
	}else{

		save();
	
	}

	function createNew(){
		// Create directory
		dialog.showSaveDialog((pathName) => {
		   
		    if (pathName === undefined){
		        console.log("You didn't save the file");
		        return;
		    }

		    fs.mkdir(pathName, (err) => {
		        
		        if(err){
		            alert("An error ocurred creating the folder "+ err.message);
		        }else{           
		        	// Save path-name
		        	projectPath = pathName;
		        	save();
		    	}
		    });
		});
	}


	function save(){

		parseIFTTTDB();

		fs.writeFile( projectPath+'/'+buildVarNameString( projectTitle )+'-setup.json' , content, (err) => {
		    if (err) {
		        alert("An error ocurred updating the file" + err.message);
		        console.log(err);
		        return;
		    }
		});
	}
}


function openFile(){

	dialog.showOpenDialog((fileNames) => {
	    // fileNames is an array that contains all the selected
	    if(fileNames === undefined){
	        console.log("No file selected");
	        return;
	    }

	    let filepath = fileNames[0];

	    // get path from file
		projectPath = filepath.substring(0, filepath.lastIndexOf("/"));

	    fs.readFile(filepath, 'utf-8', (err, data) => {
	        if(err){
	            alert("An error ocurred reading the file :" + err.message);
	            return;
	        }

			let file = JSON.parse(data);

			projectTitle = file.title;
			allSlotsProject = file.setup;
			iftttDB = file.iftttDB;

			updateProject();
	    });
	});
}


















