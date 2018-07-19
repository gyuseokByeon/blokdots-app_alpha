

var componentList = [];

// import { component_setup } from '../global/components/button.js';

let componentFolder = './global/components/';

// get all components from folder and append to list
fs.readdir(componentFolder, (err, files) => {

  files.forEach(file => {
    
    file = file.replace('.js','');

    let moduleElement = require('../global/components/'+file);

    window[ moduleElement.setup.image_url ] = moduleElement;

    componentList.push( moduleElement.setup );

  });

});
