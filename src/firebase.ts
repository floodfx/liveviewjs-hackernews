import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import fetch from "node-fetch";
import { EventEmitter } from "node:events";

// HN Firebase config
var config = {
  databaseURL: "https://hacker-news.firebaseio.com",
};

// create Firebase app and database
const app = initializeApp(config);
var database = getDatabase(app);

// fetch topstories via firebase
function getTopstoriesViaFirebase() {
  const item = ref(database, "v0/topstories");
  return new Promise((resolve, reject) => {
    try {
      onValue(item, (snapshot) => {
        resolve(snapshot.val()); // this never resolves
      });
    } catch (e) {
      reject(e);
    }
  });
}

// use an event emitter to wrap async/awaits
const ee = new EventEmitter();

let done = false; // ensure process doesn't close before queries return

// handle firebase query
ee.on("firebase", async () => {
  console.log("started firebase query");
  const fbStories = (await getTopstoriesViaFirebase()) as unknown[];
  console.log("finished firebase query", fbStories.length);
  done = true;
});

// handle direct query
ee.on("direct", async () => {
  console.log("started direct query");
  const directStories = await (await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")).json();
  console.log("finished direct query", directStories.length);
});

// kick off queries
ee.emit("firebase");
ee.emit("direct");

// wait until firebase query finishes
(function wait() {
  console.log("waiting...");
  if (!done) setTimeout(wait, 1000);
  else {
    console.log("done!");
    process.exit();
  }
})();
