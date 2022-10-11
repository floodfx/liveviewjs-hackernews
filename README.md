# LiveViewJS HackerNews

This is a simple HackerNews clone built with [LiveViewJS](https://liveviewjs.com). Inspired by (and copied from) [Ryan Caniato's](https://github.com/ryansolid) [numerous hackernews clones](https://github.com/ryansolid?tab=repositories&q=hackernews). 

More info on LiveViewJS can be found on the [website](https://liveviewjs.com) and [GitHub](https://github.com/floodfx/liveviewjs).

## Auto Building in Dev
When running the `npm start dev` command (the default in Stackblitz and locally) the app will automatically rebuild when you make changes to the either the client or server code.

## Run in StackBlitz
[Run in StackBlitz ⚡️](https://stackblitz.com/edit/liveviewjs-hackernews)
The default Stackblitz command is `npm start dev` which will run the app in development mode.

## Run locally
* Clone the repo and run `npm install`
* Run `npm run dev` to start the server
* Open `http://localhost:4002` in your browser

## Run in Fly.io
There is a `fly.toml` file in the root of the project. You can deploy your own version to your own fly.io account.  More info on [Fly.io](https://fly.io).

### First time fly.io Setup
* `flyctl auth login`
* `flyctl launch`

### Subsequent Deployments
* `flyctl deploy`


## Gratitude
* Thanks to [Ryan Caniato](https://github.com/ryansolid) for the HN Clone starting point
* Thanks to [JLarky](https://github.com/jlarky) for the feedback / code improvements
