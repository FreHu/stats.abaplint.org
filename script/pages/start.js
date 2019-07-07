import {getUrl, ajax} from "../utils.js";

function success(data) {
  let html = "<u>stats.abaplint.org</u><br>";
  for (const r of data) {
    html = html + `<a href="./#/-/${r.name}">${r.name}</a><br>`;
  }

  document.getElementById("main").innerHTML = html;
}

function error(e) {
  document.getElementById("main").innerHTML = 'Error loading, try again later';
}

export class Start {
  static render() {
    ajax(getUrl("repos.json")).then(success).catch(error);
  }
}