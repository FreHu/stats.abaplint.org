import {Start} from "./pages/start.js";
import {Stats} from "./pages/stats.js";
import {SemanticSearch} from "./pages/semantic_search.js";

export class Router {
  popstate() {
    const split = window.location.hash.split("/");
    if (window.location.hash === "") {
      Start.render();
    } else if (split[4] !== undefined && split[4] == "semantic") {
      SemanticSearch.render(split[2], split[3]);
    } else {
      Stats.render(split[2], split[3]);
    }
  }
}

const router = new Router();

document.addEventListener("DOMContentLoaded",function() {
  window.onpopstate = router.popstate;
  router.popstate();
});