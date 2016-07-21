"use strict";

const Hapi = require("hapi");
const Inert = require("inert");

const server = new Hapi.Server();
const Home = require("../client/components/home.jsx").Home;
const React = require("react");
const ReactDom = require("react-dom/server");

server.connection({
  host: "localhost",
  port: 3000
});

const _webpack_dev_ = process.env.WEBPACK_DEV === "true";

function getBundleJS() {
  if (!_webpack_dev_) {
    try {
      const stats = require("../dist/server/stats.json");
      return "/js/" + stats.assetsByChunkName.main[0];
    } catch (e) {
      console.log("require webpack stats failed", e);
    }
  }

  return "http://dev.walmart.com:2992/js/bundle.dev.js";
}

function registerRoutes() {
  server.route([
    {
      path: "/js/{param*}",
      method: "GET",
      handler: {
        directory: {
          path: "dist/js"
        }
      }
    },
    {
      path: "/{param*}",
      method: "GET",
      handler: function (req, reply) {
        const html = ReactDom.renderToString(React.createElement(Home));
        const bundleScript = `<script src="${getBundleJS()}"></script>`;
        reply(`<!DOCTYPE html><head></head><body><div id="container">SSR: ${html}</div>${bundleScript}</body>`);
      }
    }
  ]);
}

server.register(
  [
    {register: Inert}
  ],

  (err) => {
    if (err) {
      throw err;
    }

    registerRoutes();

    server.start((serverStartError) => {
      if (serverStartError) {
        throw serverStartError;
      }

      console.log("Server running @ " + server.info.uri);
    });

  });