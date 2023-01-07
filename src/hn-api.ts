import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { SingleProcessPubSub } from "liveviewjs";
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

const mapStories = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
  show: "showstories",
  ask: "askstories",
  job: "jobstories",
};

export type StoryTypes = keyof typeof mapStories;

/**
 * Determine max number of pages for a given item type
 * @param type one of top, new, best, show, ask, job
 * @returns the max number of pages for that type
 */
export function maxPage(type: StoryTypes): number {
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
  const i = await get<HNItem>("item", id.toString());
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
  return get<HNUser>("user", id);
}

/**
 * Fetch a set of items by type and page based on the HN API
 * @param type one of top, new, best, show, ask, job
 * @param page a page number clamp to 1..maxPage (see maxPage)
 * @returns the list of items (without children loaded)
 */
export async function getItems(type: StoryTypes, page: number): Promise<HNItem[]> {
  const p = Math.max(1, Math.min(page, maxPage(type))); // clamp page to 1..pmax
  const stories = mapStories[type];
  let items = await get<number[]>(stories);
  items = items.slice((p - 1) * 20, p * 20); // slice items for page
  return getAll(items);
}

/**
 * Fetch the data from firebase for a given type and optionally an id
 * @param type a type of item (e.g. user, item, or story type)
 * @param id optional id of the item
 * @returns results of the firebase query
 */
async function get<T>(type: "user" | "item" | string, id?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const lastPart = id ? `/${id}` : "";
      const path = `/v0/${type}${lastPart}`;
      const item = ref(database, path);
      onValue(item, (snapshot) => {
        resolve(snapshot.val() as T);
      });
    } catch (e) {
      reject(e);
    }
  });
}

// listen for liveview subscription requests. we use the firebase database to subscribe to
// updates to that item and then publish those updates to the pubsub channel
// 'item-<id>' which is the channel that the item liveview is subscribed to.
export function listenForItemUpdates(id: number) {
  const item = ref(database, "v0/item/" + id);
  onValue(item, () => {
    pubSub.broadcast("item-" + id, { type: "item-update", id });
  });
}
