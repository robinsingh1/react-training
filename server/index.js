"use strict";

require("babel-core/register");


const Path = require("path");
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const isoToolsConfig = require("@walmart/electrode-archetype-react-app/config/webpack/webpack-isomorphic-tools-config");
var context = Path.join(process.cwd(), "client");

global.webpackIsomorphicTools = new WebpackIsomorphicTools(isoToolsConfig);

webpackIsomorphicTools.development(process.env.NODE_ENV !== "production")
  .server(context)
  .then(() => {
    require("./main.js"); // eslint-disable-line
  });