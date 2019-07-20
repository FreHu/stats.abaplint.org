export function getUrl(file = "generated.json") {
  if (window.location.host.match("localhost")) {
    // for local testing
    return "/static/stats/" + file;
  } else {
    return "https://static.abaplint.org/stats/" + file;
  }
}

export function linkFile(full, filename, row, more = "") {
  return `<a href="https://github.com/${full}/blob/master${filename}#L${row}">${more}${filename}, ${row}</a>`
}

export function escape(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}

export function ajax(url) {
  return new Promise((resolve, reject) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        resolve(JSON.parse(xhttp.responseText));
      } else if (xhttp.readyState == 4) {
        reject({status: this.status, statusText: xhttp.statusText });
      }
    };
    xhttp.onerror = function () {
      reject({ status: this.status, statusText: xhttp.statusText });
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  });
}