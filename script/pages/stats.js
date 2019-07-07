import {getUrl, ajax} from "../utils.js";

function error(div, e) {
  document.getElementById(div).innerHTML = 'Error loading, try again later';
  console.dir(e);
}

function heading(text) {
  return `<b>${text}</b><br>`;
}

class Issues {
  static success(div, data) {
    let html = heading("Issues") + data.length + " issues found";

    for (const i of data) {
      console.dir(i);
    }

    document.getElementById(div).innerHTML = html;
  }
}

class LinesOverTime {
  static success(div, data) {
    let html = heading("Lines Over Time") + data.length + " commits";
    document.getElementById(div).innerHTML = html;

    let points = [];
    let labels = [];
    console.dir(data);
    for (let i = 0; i < data.length ; i++) {
      labels.push(data[i].commit + "\n" + data[i].date);
      points.push(data[i].lines);
    }

    var data = {
      datasets: [{
        data: points,
        backgroundColor: "#ccc",
      }],
      labels: labels};

    var ctx = document.getElementById("lines_over_time_canvas").getContext('2d');

    var myChart = new Chart(ctx, {
      type: 'bar',
      data,
      options: {
      scales: {
        xAxes: [{ ticks: { display: false } }] },
        legend: {display: false}}
    });

  }
}

export class Stats {
  static render(name, repo) {
    let full = `${name}/${repo}`;

    document.getElementById("main").innerHTML = `<u>${full}</u><br><br>
    <div id="issues"></div>
    <br>
    <div id="lines_over_time"></div>
    <canvas id="lines_over_time_canvas" width="400" height="100"></canvas>
    <br>
    `;

    ajax(getUrl(full + "/issues.json"))
      .then((d) => { Issues.success("issues", d); })
      .catch((e) => {error("issues", e); });

    ajax(getUrl(full + "/lines_over_time.json"))
      .then((d) => { LinesOverTime.success("lines_over_time", d); })
      .catch((e) => {error("lines_over_time", e); });
  }
}