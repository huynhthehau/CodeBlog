import { createStore } from "vuex";
import auth from "./authModule";
import tags from "./tagsModule";
import posts from "./postsModule";
import postDetail from "./postModule";
import comments from "./commentModule";
import users from "./userModule";
import route from "./routeModule";
import notifications from "./notificationModule";
import search from "./searchHeaderModule";
import postsTagged from "./postsTaggedModule";
const store = createStore({
  modules: {
    postsTagged,
    search,
    notifications,
    route,
    users,
    postDetail,
    posts,
    tags,
    auth,
    comments,
  },
});
export default store;
