import {getUrl, ajax, escape, linkFile} from "../utils.js";

function error(div, e) {
  document.getElementById(div).innerHTML = 'Error loading, try again later';
  console.dir(e);
}

function heading(text) {
  return `<b>${text}</b><br>`;
}

class Issues {
  static success(div, data, owner, repo) {
    let html = heading("Issues") + data.length + " issues<br><br>";

    let sorted = {};
    for (const issue of data) {
      if (sorted[issue.key] === undefined) {
        sorted[issue.key] = [];
      }
      sorted[issue.key].push(issue);
    }

    for (const type in sorted) {
      html = html +
        `<input id="toggle_${type}" type="checkbox" checked class="toggle">
        <label for="toggle_${type}">${type} (${sorted[type].length})</label>
        <div class="expand">
        <section>`;

      for (const issue of sorted[type]) {
        html = html + linkFile(owner + "/" + repo, issue.file, issue.start.row, issue.description + ", ") + "<br>";
      }

      html = html + `</section></div>`;
    }

    document.getElementById(div).innerHTML = html;
  }
}

class MethodLength {

  static click(evt, array) {
    if (array.length >= 1) {
      window.location.hash = window.location.hash + "/method_length/" + array[0]._index;
    }
  }

  static success(div, data) {
    let html = heading("Method Length");
    document.getElementById(div).innerHTML = html;

    let lengths = {};
    let max = 0;
    for (const a of data) {
      if (lengths[a.length] == undefined) {
        lengths[a.length] = 1;
      } else {
        lengths[a.length] = lengths[a.length] + 1;
      }
      if (a.length > max) {
        max = a.length;
      }
    }

    let points = [];
    let labels = [];
    for (let i = 0; i <= max; i++) {
      labels.push(i);
      if (lengths[i]) {
        points.push(lengths[i]);
      } else {
        points.push(0);
      }
    }

    var data = {
      datasets: [{data: points,
        backgroundColor: "#ccc",
      }],
      labels: labels};

    var ctx = document.getElementById(div + "_canvas").getContext('2d');

    let myChart = new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        animation: false,
        onClick: this.click,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          mode: 'nearest',
          callbacks: {
            title: function(tooltipItem, obj) {
              return tooltipItem[0].xLabel + " statements";
            },
            label: function(tooltipItem) {
              return Number(tooltipItem.yLabel) + " method(s)";
            }
          },
          intersect: false
        },
        legend: {
          display: false
        }
      }
    });
  }
}

class StatementCompatibility {
  static success(div, data) {
    let html = heading("Statement Compatibility");
    document.getElementById(div).innerHTML = html;

    let green = [];
    let red = [];
    let labels = [];
    let min = data.totals.statements;

    for (const object of data.statements) {
      labels.push(object.type);
      green.push(object.count);
      red.push(data.totals.statements - object.count);
      min = Math.min(min, object.count);
    }
    min = Math.max(0, min - 500);

    var data = {
      datasets: [{
        data: green,
        label: "Compatible",
        backgroundColor: "#3cba9f",
      },
      {
        data: red,
        label: "Incompatible",
        backgroundColor: "#c45850",
      }],
      labels: labels};

    var ctx = document.getElementById(div + "_canvas").getContext('2d');

    var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data,
      options: {
        animation: false,
					scales: {
						xAxes: [{
              ticks: {min: min},
							stacked: true,
						}],
						yAxes: [{
							stacked: true
						}]
					},
        legend: {display: false}}
    });
  }
}

class BasicStats {
  static success(div, data) {
    let html = heading("Stats");

    html = html + `<table><tr><td width="50%">
    <table>
    <tr><td>Objects:</td><td style="text-align:right">${data.totals.objects}</td></tr>
    <tr><td>Files:</td><td style="text-align:right">${data.totals.files}</td></tr>
    <tr><td>Statements:</td><td style="text-align:right">${data.totals.statements}</td></tr>
    <tr><td>Tokens:</td><td style="text-align:right">${data.totals.tokens}</td></tr>
    <tr><td>Target:</td><td style="text-align:right">${data.target}</td></tr>
    <tr><td>abaplint:</td><td style="text-align:right">${data.version}</td></tr>
    </table>
    <br>
    <small>${data.time}</small>`;

    document.getElementById(div).innerHTML = html;
  }
}

class ObjectTypes {
  static success(div, data) {
    let html = heading("Object Types");
    document.getElementById(div).innerHTML = html;

    let points = [];
    let labels = [];

    for (const object of data.objects) {
      labels.push(object.type);
      points.push(object.count);
    }

    var data = {
      datasets: [{data: points,
        backgroundColor: "#ccc",
      }],
      labels: labels};

    var ctx = document.getElementById(div + "_canvas").getContext('2d');

    var myChart = new Chart(ctx, {
      type: 'pie',
      data,
      options: {
        animation: false,
        legend: {position: "right"}}
    });
  }
}

class LinesOverTime {
  static success(div, data) {
    let html = heading("Lines Over Time") + data.length + " commits";
    document.getElementById(div).innerHTML = html;

    var timeFormat = 'MM/DD/YYYY HH:mm';

    let points = [];
    let labels = [];
    let previous = undefined;
    for (let i = 0; i < data.length ; i++) {
      if (previous !== data[i].lines) {
        labels.push(moment(data[i].date).toDate());
        points.push(data[i].lines);
      }

      previous = data[i].lines;
    }

    var data = {
      datasets: [{
        data: points,
        backgroundColor: "#ccc",
        borderColor: "#ccc",
        label: "Lines",
        steppedLine: true,
        fill: false
      }],
      labels: labels};

    var ctx = document.getElementById(div + "_canvas").getContext('2d');

    var myChart = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        animation: false,
        tooltips: {
            mode: 'nearest',
            intersect: false
        },
        scales: {
        xAxes: [{
						type: 'time',
						time: {
							parser: timeFormat,
							tooltipFormat: 'll HH:mm'
						},
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}] },
        legend: {display: false}}
    });

  }
}

export class Stats {
  static render(owner, repo) {
    let full = `${owner}/${repo}`;

    document.getElementById("main").innerHTML = `<u>${full}</u> <a href="https://github.com/${full}"><i class="fab fa-github" title="github"></i></a><br><br>
    <div id="stats"></div>
    <br>
    <div id="method_length"></div>
    <canvas id="method_length_canvas" width="400" height="100"></canvas>
    <br>
    <div id="object_types"></div>
    <canvas id="object_types_canvas" width="400" height="80"></canvas>
    <br>
    <div id="statement_compatibility"></div>
    <canvas id="statement_compatibility_canvas" width="400" height="100"></canvas>
    <br>
    <div id="lines_over_time"></div>
    <canvas id="lines_over_time_canvas" width="400" height="100"></canvas>
    <br>
    <div id="issues_aggregated"></div>
    <br>
    <div id="issues"></div>
    <br>
    `;

    ajax(getUrl(full + "/stats.json"))
      .then((d) => { BasicStats.success("stats", d); })
      .catch((e) => {error("stats", e); });

    ajax(getUrl(full + "/stats.json"))
      .then((d) => { ObjectTypes.success("object_types", d); })
      .catch((e) => {error("object_types", e); });

    ajax(getUrl(full + "/stats.json"))
      .then((d) => { StatementCompatibility.success("statement_compatibility", d); })
      .catch((e) => {error("statement_compatibility", e); });

    ajax(getUrl(full + "/method_length.json"))
      .then((d) => { MethodLength.success("method_length", d); })
      .catch((e) => {error("method_length", e); });

    ajax(getUrl(full + "/lines_over_time.json"))
      .then((d) => { LinesOverTime.success("lines_over_time", d); })
      .catch((e) => {error("lines_over_time", e); });

    ajax(getUrl(full + "/issues.json"))
      .then((d) => { Issues.success("issues", d, owner, repo); })
      .catch((e) => {error("issues", e); });
  }
}