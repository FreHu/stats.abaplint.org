import {getUrl, ajax} from "../utils.js";

function success(data) {
  let html = "<br>";
  for (const r of data) {
    html = html + `<a href="./#/-/${r.name}">${r.name}</a>`;
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