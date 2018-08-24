
var componentList = [];

// import { component_setup } from '../global/components/button.js';
let componentFolder = path.join( appRootPath+'/global/components/' );


// get all components from folder and append to list
fs.readdir(componentFolder, (err, files) => {

  files.forEach(file => {
    
    file = file.replace('.js','');

    let moduleElement = require( componentFolder+file);

    window[ moduleElement.setup.image_url ] = moduleElement;

    componentList.push( moduleElement.setup );

  });

});
