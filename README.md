# blokdots
Hi, this is *blokdots*, a software to make hardware prototyping easier. Visit the [website](http://blokdots.com) if you want to 
know more.

#### Disclaimer

Please be aware that I am a designer, not a developer, and this is my very first app. Thus it still contains a lot of bugs which will be updated regularly.
  
## The Hardware
  
Simply use a board, that is [already supported](https://github.com/olivierbrcknr/blokdots-app/wiki#supported-boards), e.g. an Arduino Uno, and some components. The easiest would be to use the [grove setup](https://www.seeedstudio.com/category/Grove-c-1003.html?p=0) by SEEED Studio, e.g. the [Grove Arduino shield](https://www.exp-tech.de/module/seeed-grove-system/4778/seeed-studio-grove-base-shield-v2), plug in your actuators and sensors and start prototyping using this software!  
  
Of course you can also use your own elements, but using the grove components will make it a lot easier, since you do not need to worry about wiring.

## The Software

Simply download the latest version of the app [here](releases/latest).

## Contributing

Contributing is very much appreciated!  

Please have a look at the [Wiki](https://github.com/olivierbrcknr/blokdots-app/wiki) to find further information about the structure of the app and its functions. 

Here are the main elements you need to know:

### Electron / Node

blokdots is an [Electron](https://electronjs.org/) and thus is based on node-js. If you have not already done it, download and install [Node](https://nodejs.org/).  
  
To run the software in dev mode, download the repository, open it in terminal and hit ```$ npm install```. Once installed simply type ```$ npm start``` to run the app. From then on it should behave exactly like the packaged app.  

### Hardware API

Currently blokdots is using the powerful [Johnny-Five](http://johnny-five.io) framework to control the hardware components. It is a library enabling you to control a micro controller with javascript via firmata. 

### Building the App

Run this line to build a functioning Mac App:  
```sh  
$ npm run build  
```

*Note:* because of some errors regarding the serialport package issue, ```buildDependenciesFromSource``` is set to ```true```.  
It will be saved in the "dist" folder within the main directory of blokdots.

#### Debugging in packed app

To open the dev tools within the packed app hit **F12**; reloading is supported via **F5**.

## What are next tasks?

Here is a list of things that are already intended within the concept, which haven't been done yet. So if you would like to contribute, but don't know what to do yet, have a look at this list:

### Improvements
- Include LV slot UI within its ```component-setup.js```
- Add opt-out function for *firmata* flashing
- "New Project" function (including save current on and detach components from project so "use" button gets active again)
- Add Port and Board selection within app menu (similar to Arduino IDE)

### Features
- Add new components
- Add new boards (which are supported by [johnny-five](http://johnny-five.io/platform-support/))
- "Else" as well as "and (&&)" statement within cards
- Tagging cards for grouping
- Search function to filter quickly through a lot of cards
- Library to safe external components, cards and slot-setups
- Multiple open project windows / files at once
- Error Management
- "Connect slots as in project" button
- Add function hierarchy (e.g. !important cards)
- Add actions to actuators
- Show values of actuators in Live View while project is running

### Stretch Goals
- Record and replay behaviour, to allow more complex actions
- Mapping slots to Grove Shield to make plugging in easier
- Component-connect-wizard to help connecting a new component (especially regarding PWM slots)
- Add a dark theme


