import {getUrl, ajax} from "../utils.js";

function error(div, e) {
  document.getElementById(div).innerHTML = 'Error loading, try again later';
  console.dir(e);
}

export class MethodLength {
  static results(div, data, length, full) {
    let html = "";
    for (const a of data) {
      if (a.length === Number(length)) {
        html = html + `<tt>METHOD ${a.name}</tt><br>
          <a href="https://github.com/${full}/blob/master${a.filename}#L${a.row}">${a.filename}, ${a.row}</a>
          <br><br>`;
      }
    }

    document.getElementById(div).innerHTML = html;
  }

  static render(owner, repo, length) {
    const full = `${owner}/${repo}`;

    document.getElementById("main").innerHTML = `<u>${full}</u>
      <br><br>
      method length = ${length}
      <br><br>
      <div id="results"></div>`;

    ajax(getUrl(full + "/method_length.json"))
      .then((d) => { this.results("results", d, length, full); })
      .catch((e) => {error("results", e); });

  }
}