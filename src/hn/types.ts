export interface HNUser {
  id: string;
  karma: number;
  about: string;
  submitted: number[];
  created: number;
}

// HN Item properties
// id	The item's unique id.
// deleted	true if the item is deleted.
// type	The type of item. One of "job", "story", "comment", "poll", or "pollopt".
// by	The username of the item's author.
// time	Creation date of the item, in Unix Time.
// text	The comment, story or poll text. HTML.
// dead	true if the item is dead.
// parent	The comment's parent: either another comment or the relevant story.
// poll	The pollopt's associated poll.
// kids	The ids of the item's comments, in ranked display order.
// url	The URL of the story.
// score	The story's score, or the votes for a pollopt.
// title	The title of the story, poll or job. HTML.
// parts	A list of related pollopts, in display order.
// descendants	In the case of stories or polls, the total comment count.
const itemTypes = ["story", "comment", "job", "poll", "pollopt"] as const;
export type ItemType = typeof itemTypes[number];

export interface HNItem {
  id: number;
  deleted: boolean;
  type: ItemType;
  by: string;
  time: number;
  text: string;
  dead: boolean;
  parent: number;
  poll: number;
  kids: number[];
  url: string;
  score: number;
  title: string;
  parts: number[];
  descendants?: number;
  children?: HNItem[];
}

export class HNItem {
  #domain: string;
  #time_ago: string;
  constructor(item: HNItem) {
    Object.assign(this, item);
    this.#domain = this.url ? new URL(this.url).hostname : "";
    this.#time_ago = timeAgo(this.time);
  }

  get domain() {
    return this.#domain;
  }

  get time_ago() {
    return this.#time_ago;
  }

  get commentCount(): number {
    return this.descendants ?? 0;
  }

  get visibleChildren(): HNItem[] {
    return this.children?.filter((c) => !c.deleted && !c.dead && c.by !== undefined) ?? [];
  }
}

const timeAgo = (time: number) => {
  const rtf1 = new Intl.RelativeTimeFormat("en", { style: "narrow" });
  const now = new Date();
  const then = new Date(time * 1000);
  const diff = now.getTime() - then.getTime();
  switch (true) {
    // if diff is less than 1 minute, return 'just now'
    case diff < 60 * 1000:
      return "just now";
    // if diff is less than 1 hour, return 'x minutes ago'
    case diff < 60 * 60 * 1000:
      return rtf1.format(Math.round(-diff / (60 * 1000)), "minute");
    // if diff is less than 1 day, return 'x hours ago'
    case diff < 24 * 60 * 60 * 1000:
      return rtf1.format(Math.round(-diff / (60 * 60 * 1000)), "hour");
    // if diff is less than 1 week, return 'x days ago'
    case diff < 7 * 24 * 60 * 60 * 1000:
      return rtf1.format(Math.round(-diff / (24 * 60 * 60 * 1000)), "day");
    // if diff is less than 1 month, return 'x weeks ago'
    case diff < 30 * 24 * 60 * 60 * 1000:
      return rtf1.format(Math.round(-diff / (7 * 24 * 60 * 60 * 1000)), "week");
    // if diff is less than 1 year, return 'x months ago'
    case diff < 365 * 24 * 60 * 60 * 1000:
      return rtf1.format(Math.round(-diff / (30 * 24 * 60 * 60 * 1000)), "month");
    // if diff is more than 1 year, return 'x years ago'
    default:
      return rtf1.format(Math.round(-diff / (365 * 24 * 60 * 60 * 1000)), "year");
  }
};
