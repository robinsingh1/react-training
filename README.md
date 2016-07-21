# react-training
# Server Exercise 6

In this exercise we will use [isomorphic-loader] to load images isomorphically, and load the proper `bundle.*.js` file depending on whether [webpack-dev-server] is running.

Webpack plugins gives flexibilities at the types of files you can pack.  Using plugins [url-loader] and [file-loader] you would be able to use static images in your UI code by doing `require("image.jpg")`.

However, that only works on client side.

To be able to do it on the server side, we will use the plugin from [isomorphic-loader] in `isomorphic-loader/lib/webpack-plugin`.

In exercise 5, we hardcoded in `server/index.js` the URL to `bundle.js` with `http://localhost:2992/js/bundle.dev.js`.

But when running without [webpack-dev-server], that URL is not available, and we have to use another URL.

We will implement a small function to load the proper `bundle.js`.

## Step 1

***Initialize your app***

We will reuse and build upon [server exercise 5].

```
cp -r server-ex-5 server-ex-6
cd server-ex-6
```

## Step 2

***Loading Image***

Make dir `client/images` and save this [image](client/images/smiley.jpg) there.

In file `client/components/hello.jsx`:

Add this line to top:

```js
import smiley from "../images/smiley.jpg";
```

With `webpack` and the loader plugins, the above line will load a string URL to the image into `smiley`.

And you can use that URL directly in your code.

Update the `render` function with a line `<img src={smiley} />`:

```js
    return <div>
          <img src={smiley} />
                Hello {this.props.name}
                    </div>;
                    ```

                    That's all that's needed to use images on the client side.

                    But server side will fail since NodeJS doesn't understand how to load `.jpg` files.

## Step 3

***Update Server Side***

In order to make the server side understand the `.jpg` files, [isomorphic-loader] will do something with Node's `require` so it understands what to do with image files.

But we have to activate that in the server.

First we have to rename `server/index.js` to `server/main.js`.

And create a new `server/index.js` to load [isomorphic-loader]'s `extend-require`.

```js
"use strict";

require("babel-core/register");

const extendRequire = require("isomorphic-loader/lib/extend-require");

extendRequire()
  .then(() => {
          require("./main.js"); // eslint-disable-line
            })
    .catch((err) => {
            console.log(err); // eslint-disable-line
              });
    ```

    Now start the server with `builder run hot` and check it out in the browser.

## Step 4

***Return the correct bundle.js***

When we are running in production mode, with the following commands: 

```
builder run build
NODE_ENV=production node server/index.js
```

The `bundle.dev.js` is no longer provided by [webpack-dev-server].  It is served by our server with the inert plugin, or by the [pronto CDN] if that's used when running on production machines.

We can detect if [webpack-dev-server] is running by checking for the env var `WEBPACK_DEV` and load the proper `bundle.dev.js` in our Index template.

We can retrieve the filename for the production `bundle.js` webpack generated by looking at the stats file it created in `dist/server/stats.json`.

In `server/main.js`, before the function `registerRoutes`, add:

```js
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
```

And update the HTML returned for route `/{param*}` in `registerRoutes` to:

```js
    const bundleScript = `<script src="${getBundleJS()}"></script>`;
        reply(`<!DOCTYPE html><head></head><body><div id="container">SSR: ${html}</div>${bundleScript}</body>`);
        ```

        Now kill your server running in `hot` mode, and restart it in production mode, and check that it's working in the browser.

## A note about the [isomorphic-loader] config file

[isomorphic-loader] generates a config file in the app's `CWD` named `.isomorphic-loader-config.json`.  Since this is generated, it should *not* be committed to your repo.  

When you are writing your real app, it's recommended that you add this file to your `.gitignore` file.

However, please note that the file is required to run your app in production.

## Complete Files

You can find complete versions of the files we just created [here](./)

## Next

We will go through the way we [handle styling](../../../styling).

[electrode-archetype-react-app]: https://gecgithub01.walmart.com/electrode/electrode-archetype-react-app
[builder local install instructions]: https://github.com/FormidableLabs/builder#local-install
[builder]: https://github.com/FormidableLabs/builder
[webpack-dev-server]: https://webpack.github.io/docs/webpack-dev-server.html
[webpack configuration]: https://webpack.github.io/docs/configuration.html
[babel-loader]: https://github.com/babel/babel-loader
[server exercise 5]: ../ex-5
[archetypes]: https://github.com/FormidableLabs/builder#creating-an-archetype
[webpack]: https://webpack.github.io/
[isomorphic-loader]: https://github.com/jchip/isomorphic-loader
[url-loader]: https://github.com/webpack/url-loader
[file-loader]: https://github.com/webpack/file-loade
