import { NodeExpressLiveViewServer } from "@liveviewjs/express";
import express, { NextFunction, Request, Response } from "express";
import session, { MemoryStore } from "express-session";
import { Server } from "http";
import { LiveViewRouter } from "liveviewjs";
import { WebSocketServer } from "ws";
import { htmlPageTemplate } from "./liveTemplates";
import { indexLV } from "./liveviews";
import { itemLV } from "./liveviews/item";
import { userLV } from "./liveviews/user";

// Define the routing of urls to LiveViews
const router: LiveViewRouter = {
  "/": indexLV,
  "/:type(top|best|new|show|ask|job)": indexLV,
  "/stories/:id": itemLV,
  "/item/:id": itemLV,
  "/users/:id": userLV,
};

const secret = "SECRET"; // obviously you use a real secret here

// configure your express app
const app = express();

// add static file serving
app.use(express.static("public"));

// setup express-session middleware
app.use(
  session({
    secret,
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: new MemoryStore(),
  })
);

// add flash object to session data
declare module "express-session" {
  interface SessionData {
    flash: any;
  }
}

// basic middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const isLiveView = router.hasOwnProperty(req.path);
  console.log(`${req.method} ${isLiveView ? "LiveView" : ""} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// initialize the LiveViewServer
const liveView = new NodeExpressLiveViewServer(
  router,
  htmlPageTemplate,
  { title: "HackerNewsClone", suffix: " · LiveViewJS" },
  {
    serDeSigningSecret: secret,
  }
);

// setup the LiveViewJS middleware
app.use(liveView.httpMiddleware());

// configure express to handle both http and websocket requests
const httpServer = new Server();
const wsServer = new WebSocketServer({
  server: httpServer,
});

// send http requests to the express app
httpServer.on("request", app);

// initialize the LiveViewJS websocket message router
const liveViewWsMiddleware = liveView.wsMiddleware();
liveViewWsMiddleware(wsServer);

// listen for requests
const port = process.env.PORT || 4002;
httpServer.listen(port, () => {
  console.log(`LiveViewJS Express is listening on port ${port}!`);
});
