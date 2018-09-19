# blokdots
Hi, this is blokdots, a system to make hardware prototyping easier. Visit the [website](http://blokdots.com) if you want to 
know more.

#### Disclaimer

Please be aware that I am a designer and this is my very first app. Thus it still contains a lot of bugs which will updated regularly.
  
## The Hardware
  
Just use the [grove setup](https://www.seeedstudio.com/category/Grove-c-1003.html?p=0) by SEEED Studio, e.g. the [Grove Arduino shield](https://www.exp-tech.de/module/seeed-grove-system/4778/seeed-studio-grove-base-shield-v2), plug in your actuators and sensors and start prototyping using this software!  
  
Of course you can also use your own elements, but using the grove components will make it a lot easier, since you do not need to worry about wiring.

## The Software

Simply download the latest version of the app [here](releases/latest).

## Contributing

Contributing is very much appreciated!  

### Electron / Node

blokdots is an [Electron](https://electronjs.org/) and thus is based on node-js. If you have not already done it, download and install [Node](https://nodejs.org/).  
  
To run the software in dev mode, download the repository, open it in terminal and hit ```$ npm install```. Once installed simply type ```$ npm start``` to run the app. From then on it should behave exactly like the packaged app.  

Please have a look at the [Wiki](https://github.com/olivierbrcknr/blokdots-app/wiki) to find further information about the structure of the app and its functions. 

### Hardware API

Currently blokdots is using the powerful [Johnny-Five](http://johnny-five.io) framework to control the hardware components. 

### Building App

Run this line to build a functioning Mac App:  
```sh  
$ npm run dist  
```

*Note:* because of some errors regarding the serialport package issue, ```buildDependenciesFromSource``` is set to ```true```.  
It will be saved in the "dist" folder within the main directory of blokdots.