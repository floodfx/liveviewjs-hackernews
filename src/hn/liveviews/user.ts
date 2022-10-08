import { createLiveView, html, safe } from "liveviewjs";
import { getUser } from "src/hn-api";
import { Nav } from "../components/nav";
import { HNUser } from "../types";

type UserContext = {
  user: HNUser;
};

export const userLV = createLiveView<UserContext>({
  mount: async (socket, _, params) => {
    const user = await getUser(params.id as string);
    socket.pageTitle(`User: ${user.id}`);
    socket.assign({ user });
  },
  render: (context) => {
    const { id, karma, about, created } = context.user;
    return html`
      ${Nav(false)}
      <div class="user-view">
        <p>user: ${id}</p>
        <p>created: ${created}</p>
        <p>karma: ${karma}</p>
        <p>about: <span>${safe(about)}</span></p>
      </div>
    `;
  },
});
