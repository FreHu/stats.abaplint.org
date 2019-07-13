import {Start} from "./pages/start.js";
import {Stats} from "./pages/stats.js";
import {SemanticSearch} from "./pages/semantic_search.js";
import {MethodLength} from "./pages/method_length.js";

export class Router {
  popstate() {
    const split = window.location.hash.split("/");
    if (window.location.hash === "") {
      Start.render();
    } else if (split[4] !== undefined && split[4] == "semantic") {
      SemanticSearch.render(split[2], split[3]);
    } else if (split[5] !== undefined && split[4] == "method_length") {
      MethodLength.render(split[2], split[3], split[5]);
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