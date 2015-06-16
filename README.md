# 2015-react-stack

This repository contains the starter code for a modern client side web app.

## Technologies
- [React](http://facebook.github.io/react/) for the view layer
- [React Router](https://github.com/rackt/react-router) for client-side routing
- [Alt.js](https://github.com/goatslacker/alt), a [Flux](http://facebook.github.io/flux/) implementation for managing data
- [ES6 Promises](https://github.com/jakearchibald/es6-promise) for Promises / async operations
- [Moment](http://momentjs.com/) for date processing / formatting
- [PostCSS](https://github.com/postcss/postcss) for advanced css preprocessing
- [Webpack](http://webpack.github.io/) for building modules
- [Babel](http://babeljs.io/) for transpiling es6 code with jsx
- jQuery for ajax calls (never used for DOM Manipulation!)
- [FlexBox](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes) for CSS layouts that don't suck

## Getting Started

All of these technologies can be a lot to pick up on. Here is a list of documents and videos to look at to help you get up to speed.

### Javascript

Start by reading the [Official React Docs](http://facebook.github.io/react/docs/getting-started.html) on the React website. This will teach you the fundamentals of Components, state, props, and uni-directional data flow. Next, I recommend watching ["Rethinking Best Practices"](https://www.youtube.com/watch?v=x7cQ3mrcKaY), a talk on the advantages of using React's philosophies over common web techniques.

To understand the core architecture of the application, watch Facebook's introductory video on the [Flux Architecture](http://facebook.github.io/flux/) and read the [overview](http://facebook.github.io/flux/docs/overview.html#content). Then, read the [Alt.js docs](http://alt.js.org/guide/) to learn about the API of the Flux implementation that is used in this project.

I also recommend reading the [Learn ES6](http://babeljs.io/docs/learn-es2015/) section of the Babel.js website. This project uses the next version of javascript that is not fully supported in modern browsers. It features classes, modules, arrow functions, and a lot of extra syntax that is not available in ES5. Babel is a tool that compiles our ES6 code so it runs as normal ES5 in any browser. You can install [Babel-Sublime](https://github.com/babel/babel-sublime) for syntax highlighting in Sublime Text.

### Styling

Every component has an individual stylesheet in `components/stylesheets/`. These files contain the local style definitions for their component. When these css files are imported, their class names are converted to LOCAL class names. This means that a `.box { ... }` gets converted to something like `.cbi7C { ... }` and when imported to Javascript, `styles.box` will equal `"cbi7C"`. [This article](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284) explains what happens a little more clearly - I recommend you read all of it. [Box.js](app/components/ui/Box.js) is an example of a resusable component with local, encapsulated styles.

I also recommend you become familiar with the [FlexBox](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes) standard. This project uses it throughout for layout and alignment. It is supported in all modern browsers, just not in ie 9 or lower.

### Structure

All of the client side code is inside the `app` directory and is compiled into `public/bundle.js`. The starting point of the app is in `main.js`. All of the react components are in the `components` folder. `components/containers/` contains the 'smart' components of the app. They listen to Stores, read data, and fire actions. They DO NOT render DOM - that is left to the components in `components/ui`. These are the 'dumb' components. They are passed all the data they need from their parent and only render DOM and handle events. By not coupling any of the ui components with the Stores and the data, all of the ui components will be reusable.

## Development

To get started you must have [node.js and npm](http://nodejs.org/) installed on
your computer. From the root project directory run these commands from the
command line:

`npm install`
This will install all of the technologies.

To start writing code, run `npm run watch` in your terminal. This will incrementally build `public/bundle.js` as you save files.

You can also start a web server by running `npm start` in another terminal. This will server the `public/` directory at [localhost:8080](http://localhost:8080).

To add javascript dependencies from npm, run `npm install --save modulename`
where modulename is the name of a package from [npmjs.org](https://www.npmjs.org/).

`npm run build` will generate a minified version of bundle.js for use in production.

