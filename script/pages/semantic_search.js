import {getUrl, ajax, linkFile, escape} from "../utils.js";

let result = undefined;
let full = undefined;

function error(div, e) {
  document.getElementById(div).innerHTML = 'Error loading, try again later';
  console.dir(e);
}

function popuplateDropdown() {
  let options = "";
  for (const i in result.expressions) {
    options = options + "<option value=\"" + i + "\">" +
      result.expressions[i].key + "(" + result.expressions[i].found.length + ")</option>\n";
  }
  document.getElementById("dropdown").innerHTML = options;
  document.getElementById("dropdown").onchange = changeDropdown;
}

function linkToExpression(name) {
  return "<a href=\"https://syntax.abaplint.org/#/expression/" + name + "\" target=\"_blank\">" + name + "</a>";
}

function changeDropdown(evt) {
  let html = "<br>" + linkToExpression(result.expressions[Number(evt.target.value)].key) + "<br><br>";

  for (const found of result.expressions[Number(evt.target.value)].found) {
    html = html + "<tt><b>" + escape(found.code) + "</b></tt><br>\n" +
      linkFile(full, result.files[found.file], found.row) + "<br><br>\n";
  }
  document.getElementById("results").innerHTML = html;
}

export class SemanticSearch {
  static results(div, data) {
    result = data;
    popuplateDropdown();
  }

  static render(owner, repo) {
    full = `${owner}/${repo}`;

    document.getElementById("main").innerHTML = `<u>${full}</u><br><br>
      <div id="status"></div>
      Expressions: <select name="version" id="dropdown"></select>
      </div>
      <div id="results"></div>
    `;

    ajax(getUrl(full + "/semantic_search.json"))
      .then((d) => { this.results("results", d, length, full); })
      .catch((e) => {error("results", e); });
  }
}