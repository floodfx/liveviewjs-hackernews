import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { SingleProcessPubSub } from "liveviewjs";
import fetch from "node-fetch";
import { HNItem, HNUser } from "./hn/types";

// HN Firebase config
var config = {
  databaseURL: "https://hacker-news.firebaseio.com",
};

// let's use firebase to subscribe to updates to items
// and publish those updates to our liveview subscribers
const app = initializeApp(config);
var database = getDatabase(app);
const pubSub = new SingleProcessPubSub();

// listen for liveview subscription requests.  the itemLV mount function
// will broadcast a message to the pubsub channel 'item-update' with the
// item id to subscribe to.  we use the firebase database to subscribe to
// updates to that item and then publish those updates to the pubsub channel
// 'item-<id>' which is the channel that the itemLV is subscribed to.
pubSub.subscribe("item-update", (id) => {
  const item = ref(database, "v0/item/" + id);
  onValue(item, () => {
    pubSub.broadcast("item-" + id, { type: "item-update" });
  });
});

const mapStories: { [key: string]: string } = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
  show: "showstories",
  ask: "askstories",
  job: "jobstories",
};

type ItemTypes = keyof typeof mapStories;

/**
 * Determine max number of pages for a given item type
 * @param type one of top, new, best, show, ask, job
 * @returns the max number of pages for that type
 */
export function maxPage(type: ItemTypes): number {
  let pmax = 25; // top/news/best 20 items per page x 25 pages = 500 items
  if (type === "show" || type === "ask" || type === "job") {
    pmax = 10; // show/ask/job 20 items per page x 10 pages = 200 items
  }
  return pmax;
}

/**
 * Fetch all the items for a set of ids and optionally load the children (i.e. the ids in the kids array)
 * @param ids the item ids to fetch
 * @param loadChildren optionally load the children of the items
 * @returns a list of items
 */
export async function getAll(ids: number[], loadChildren: boolean = false): Promise<HNItem[]> {
  if (ids === undefined) {
    return [];
  }
  return await Promise.all(ids.map((i) => getItem(i, loadChildren)));
}

/**
 * Fetch a single item by id and optionally load the children (i.e. the ids in the kids array)
 * @param id the item id to fetch
 * @param loadChildren optionally load the children of the items
 * @returns the item
 */
export async function getItem(id: number, loadChildren: boolean = false): Promise<HNItem> {
  const i = await get<HNItem>(`${config.databaseURL}/v0/item/${id}.json`);
  if (loadChildren && i.kids) {
    i.children = await getAll(i.kids, loadChildren);
  }
  return i;
}

/**
 * Fetch a user by id
 * @param id the id of the user to fetch
 * @returns a User
 */
export function getUser(id: string): Promise<HNUser> {
  return get<HNUser>(`${config.databaseURL}/v0/user/${id}.json`);
}

/**
 * Fetch a set of items by type and page based on the HN API
 * @param type one of top, new, best, show, ask, job
 * @param page a page number clamp to 1..maxPage (see maxPage)
 * @returns the list of items (without children loaded)
 */
export async function getItems(type: ItemTypes, page: number): Promise<HNItem[]> {
  const p = Math.max(1, Math.min(page, maxPage(type))); // clamp page to 1..pmax
  const t = mapStories[type];
  let items = await get<number[]>(`${config.databaseURL}/v0/${t}.json`);
  items = items.slice((p - 1) * 20, p * 20); // slice items for page
  return getAll(items);
}

// helper function to fetch a json resource
async function get<T>(href: string): Promise<T> {
  // calling firebase directly seems flaky so retry a few times
  let retries = 3;
  while (retries > 0) {
    try {
      const res = await fetch(href);
      return (await res.json()) as T;
    } catch (e) {
      retries--;
    }
  }
  throw new Error("failed to fetch " + href);
}
