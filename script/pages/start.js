import {getUrl, ajax} from "../utils.js";

function success(data) {
  let html = "<u>stats.abaplint.org</u><br>";

  data.sort(function(a, b) { return a.name.localeCompare(b.name); });

  html = html + `<table>`;
  for (const r of data) {
    html = html + `<tr>
      <td><a href="./#/-/${r.name}">${r.name} <i class="fa fa-chart-bar" title="stats"></i></a></td>
      <td align="right">${r.issues} <i class="fas fa-times" title="issues"></i></td>
      <td align="right">${r.lines} <i class="fa fa-code" title="LOC"></i></td>
      <td><a href="./#/-/${r.name}/semantic"><i class="fa fa-search" title="semantic search"></i></a></td>
      <td align="right">${r.head}</i></td>
      </tr>`;
  }
  html = html + `</table>`;

  document.getElementById("main").innerHTML = html +
    "<br><a href=\"https://github.com/dotabap/dotabap-list\"><i class=\"fa fa-plus\" title=\"add project\"></i></a>&nbsp;" +
    "<a href=\"https://github.com/abaplint/stats.abaplint.org\"><i class=\"fa fa-code\" title=\"source\"></i></a>";
}

function error(e) {
  document.getElementById("main").innerHTML = 'Error loading, try again later';
}

export class Start {
  static render() {
    ajax(getUrl("repos.json")).then(success).catch(error);
  }
}