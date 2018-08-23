
var componentList = [];

// import { component_setup } from '../global/components/button.js';
let componentFolder = appRootPath+'/global/components/';

console.log( appRootPath )

// get all components from folder and append to list
fs.readdir(componentFolder, (err, files) => {

	console.log( files )

  files.forEach(file => {
    
    file = file.replace('.js','');

    let moduleElement = require( componentFolder+file);

    window[ moduleElement.setup.image_url ] = moduleElement;

    componentList.push( moduleElement.setup );

  });

});
