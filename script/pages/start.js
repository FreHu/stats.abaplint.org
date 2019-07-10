import {getUrl, ajax} from "../utils.js";

function success(data) {
  let html = "<u>stats.abaplint.org</u><br>";

  for (const r of data) {
    html = html + `<a href="./#/-/${r.name}">${r.name} <i class="fa fa-chart-bar" title="stats"></i></a>
      <a href="./#/-/${r.name}/semantic"><i class="fa fa-search" title="semantic search"></i></a>
      <br>`;
  }

  document.getElementById("main").innerHTML = html + "<br><a href=\"https://github.com/abaplint/stats.abaplint.org\"><i class=\"fa fa-code\" title=\"code\"></i></a>";
}

function error(e) {
  document.getElementById("main").innerHTML = 'Error loading, try again later';
}

export class Start {
  static render() {
    ajax(getUrl("repos.json")).then(success).catch(error);
  }
}