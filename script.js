var tabs = document.querySelectorAll(".tab");
var panels = document.querySelectorAll(".panel");

for (var i = 0; i < tabs.length; i++) {
  tabs[i].onclick = function () {
    var tabName = this.getAttribute("data-tab");

    for (var j = 0; j < tabs.length; j++) {
      tabs[j].classList.remove("is-active");
    }

    for (var k = 0; k < panels.length; k++) {
      panels[k].classList.remove("is-active");
    }

    this.classList.add("is-active");
    document.getElementById(tabName).classList.add("is-active");
  };
}

var cities = [
  ["Phoenix", "Maryvale", 91, 82, 66, 70],
  ["Los Angeles", "Boyle Heights", 78, 71, 72, 65],
  ["New York City", "South Bronx", 73, 68, 84, 61],
  ["Houston", "Gulfton", 85, 74, 63, 76],
  ["Chicago", "Little Village", 69, 64, 75, 58],
  ["Miami", "Little Havana", 88, 60, 57, 74]
];

var threshold = document.getElementById("threshold");
var thresholdValue = document.getElementById("thresholdValue");
var metric = document.getElementById("metric");
var summary = document.getElementById("summary");
var cityCards = document.getElementById("cityCards");
var canvas = document.getElementById("heatChart");
var ctx = canvas.getContext("2d");

function getRisk(city) {
  return Math.round(city[2] * 0.34 + city[3] * 0.24 + city[4] * 0.24 + city[5] * 0.18);
}

function getValue(city) {
  if (metric.value === "heat") {
    return city[2];
  }
  if (metric.value === "canopy") {
    return city[3];
  }
  if (metric.value === "asthma") {
    return city[4];
  }
  return getRisk(city);
}

function getTitle() {
  if (metric.value === "heat") {
    return "Temperature anomaly";
  }
  if (metric.value === "canopy") {
    return "Low tree canopy";
  }
  if (metric.value === "asthma") {
    return "Respiratory burden";
  }
  return "Overall heat risk";
}

function drawChart() {
  var limit = Number(threshold.value);
  var paddingLeft = 46;
  var paddingTop = 28;
  var paddingRight = 26;
  var paddingBottom = 90;
  var chartWidth = canvas.width - paddingLeft - paddingRight;
  var chartHeight = canvas.height - paddingTop - paddingBottom;
  var gap = 14;
  var barWidth = (chartWidth - gap * (cities.length - 1)) / cities.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#18212b";
  ctx.font = "700 20px Segoe UI, sans-serif";
  ctx.fillText(getTitle(), paddingLeft, 24);

  ctx.strokeStyle = "#d9ddd6";
  ctx.lineWidth = 1;

  for (var step = 0; step <= 100; step += 25) {
    var gridY = paddingTop + chartHeight - (step / 100) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, gridY);
    ctx.lineTo(canvas.width - paddingRight, gridY);
    ctx.stroke();
    ctx.fillStyle = "#5e6974";
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.fillText(step, 10, gridY + 4);
  }

  var thresholdY = paddingTop + chartHeight - (limit / 100) * chartHeight;
  ctx.strokeStyle = "#d35232";
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(paddingLeft, thresholdY);
  ctx.lineTo(canvas.width - paddingRight, thresholdY);
  ctx.stroke();
  ctx.setLineDash([]);

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    var value = getValue(city);
    var risk = getRisk(city);
    var x = paddingLeft + i * (barWidth + gap);
    var height = (value / 100) * chartHeight;
    var y = paddingTop + chartHeight - height;

    if (risk >= limit) {
      ctx.fillStyle = "#d35232";
    } else {
      ctx.fillStyle = "#1d7a5c";
    }

    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = "#18212b";
    ctx.font = "800 16px Segoe UI, sans-serif";
    ctx.fillText(value, x + barWidth / 2 - 10, y - 8);

    ctx.textAlign = "center";
    ctx.font = "700 13px Segoe UI, sans-serif";
    if (city[0] === "New York City") {
      ctx.fillText("New York", x + barWidth / 2, paddingTop + chartHeight + 34);
      ctx.fillText("City", x + barWidth / 2, paddingTop + chartHeight + 52);
    } else if (city[0] === "Los Angeles") {
      ctx.fillText("Los", x + barWidth / 2, paddingTop + chartHeight + 34);
      ctx.fillText("Angeles", x + barWidth / 2, paddingTop + chartHeight + 52);
    } else {
      ctx.fillText(city[0], x + barWidth / 2, paddingTop + chartHeight + 42);
    }
  }
}

function drawCards() {
  var limit = Number(threshold.value);
  var amountHigh = 0;
  var html = "";

  thresholdValue.innerHTML = limit;

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    var risk = getRisk(city);
    var highClass = "";
    var label = "monitor";

    if (risk >= limit) {
      amountHigh++;
      highClass = " high";
      label = "priority area";
    }

    html += '<article class="city' + highClass + '">';
    html += "<h3>" + city[0] + "</h3>";
    html += "<p>" + city[1] + "</p>";
    html += "<strong>" + risk + "/100</strong>";
    html += '<span class="badge">' + label + "</span>";
    html += "</article>";
  }

  summary.innerHTML = amountHigh + " of " + cities.length + " sample communities meet or exceed the selected risk threshold.";
  cityCards.innerHTML = html;
}

function updatePage() {
  drawChart();
  drawCards();
}

threshold.oninput = updatePage;
metric.onchange = updatePage;
updatePage();
