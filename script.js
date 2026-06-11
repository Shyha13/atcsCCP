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
  ["New York", 9.3, 22, 5.6, 25],
  ["Newark", 9.0, 9, 8.4, 28],
  ["Houston", 8.8, 14, 6.2, 22],
  ["Chicago", 8.7, 17, 6.8, 18],
  ["Detroit", 8.5, 11, 9.1, 11],
  ["Phoenix", 7.4, 10, 5.9, 16],
  ["Baltimore", 7.0, 26, 7.8, 9],
  ["Atlanta", 5.0, 48, 5.2, 10]
];

var threshold = document.getElementById("threshold");
var thresholdLabel = document.getElementById("thresholdLabel");
var thresholdValue = document.getElementById("thresholdValue");
var metric = document.getElementById("metric");
var summary = document.getElementById("summary");
var cityCards = document.getElementById("cityCards");
var canvas = document.getElementById("heatChart");
var ctx = canvas.getContext("2d");

function getColumn() {
  if (metric.value === "canopy") {
    return 2;
  }
  if (metric.value === "asthma") {
    return 3;
  }
  if (metric.value === "language") {
    return 4;
  }
  return 1;
}

function getTitle() {
  if (metric.value === "canopy") {
    return "Tree canopy (%)";
  }
  if (metric.value === "asthma") {
    return "Respiratory burden (%)";
  }
  if (metric.value === "language") {
    return "Linguistic isolation (%)";
  }
  return "UHI anomaly (°F)";
}

function getMax() {
  if (metric.value === "canopy") {
    return 50;
  }
  if (metric.value === "language") {
    return 30;
  }
  return 10;
}

function getUnit() {
  if (metric.value === "heat") {
    return "°F";
  }
  return "%";
}

function showValue(value) {
  if (metric.value === "heat" || metric.value === "asthma") {
    return Number(value).toFixed(1) + getUnit();
  }
  return value + getUnit();
}

function isPriority(value, limit) {
  if (metric.value === "canopy") {
    return value <= limit;
  }
  return value >= limit;
}

function setSlider() {
  if (metric.value === "canopy") {
    threshold.min = 0;
    threshold.max = 50;
    threshold.step = 1;
    threshold.value = 20;
    thresholdLabel.innerHTML = "Low canopy threshold";
  } else if (metric.value === "asthma") {
    threshold.min = 5;
    threshold.max = 10;
    threshold.step = 0.1;
    threshold.value = 7;
    thresholdLabel.innerHTML = "Respiratory threshold";
  } else if (metric.value === "language") {
    threshold.min = 0;
    threshold.max = 30;
    threshold.step = 1;
    threshold.value = 20;
    thresholdLabel.innerHTML = "Isolation threshold";
  } else {
    threshold.min = 5;
    threshold.max = 10;
    threshold.step = 0.1;
    threshold.value = 8;
    thresholdLabel.innerHTML = "UHI threshold";
  }
}

function drawChart() {
  var limit = Number(threshold.value);
  var column = getColumn();
  var max = getMax();
  var paddingLeft = 46;
  var paddingTop = 28;
  var paddingRight = 26;
  var paddingBottom = 90;
  var chartWidth = canvas.width - paddingLeft - paddingRight;
  var chartHeight = canvas.height - paddingTop - paddingBottom;
  var gap = 10;
  var barWidth = (chartWidth - gap * (cities.length - 1)) / cities.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "left";
  ctx.fillStyle = "#18212b";
  ctx.font = "700 20px Segoe UI, sans-serif";
  ctx.fillText(getTitle(), paddingLeft, 24);

  ctx.strokeStyle = "#d9ddd6";
  ctx.lineWidth = 1;

  for (var step = 0; step <= 4; step++) {
    var number = (max / 4) * step;
    var gridY = paddingTop + chartHeight - (number / max) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, gridY);
    ctx.lineTo(canvas.width - paddingRight, gridY);
    ctx.stroke();
    ctx.fillStyle = "#5e6974";
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.fillText(number, 10, gridY + 4);
  }

  var thresholdY = paddingTop + chartHeight - (limit / max) * chartHeight;
  ctx.strokeStyle = "#d35232";
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(paddingLeft, thresholdY);
  ctx.lineTo(canvas.width - paddingRight, thresholdY);
  ctx.stroke();
  ctx.setLineDash([]);

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    var value = city[column];
    var x = paddingLeft + i * (barWidth + gap);
    var height = (value / max) * chartHeight;
    var y = paddingTop + chartHeight - height;

    if (isPriority(value, limit)) {
      ctx.fillStyle = "#d35232";
    } else {
      ctx.fillStyle = "#1d7a5c";
    }

    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = "#18212b";
    ctx.textAlign = "center";
    ctx.font = "800 14px Segoe UI, sans-serif";
    ctx.fillText(value, x + barWidth / 2, y - 8);
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.fillText(city[0], x + barWidth / 2, paddingTop + chartHeight + 42);
  }
}

function drawCards() {
  var limit = Number(threshold.value);
  var column = getColumn();
  var amountHigh = 0;
  var html = "";

  thresholdValue.innerHTML = showValue(threshold.value);

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    var value = city[column];
    var highClass = "";
    var label = "monitor";

    if (isPriority(value, limit)) {
      amountHigh++;
      highClass = " high";
      label = "highlighted";
    }

    html += '<article class="city' + highClass + '">';
    html += "<h3>" + city[0] + "</h3>";
    html += "<p>" + getTitle() + "</p>";
    html += "<strong>" + showValue(value) + "</strong>";
    html += '<span class="badge">' + label + "</span>";
    html += "</article>";
  }

  if (metric.value === "canopy") {
    summary.innerHTML = amountHigh + " of " + cities.length + " cities are at or below the selected canopy threshold.";
  } else {
    summary.innerHTML = amountHigh + " of " + cities.length + " cities meet or exceed the selected threshold.";
  }

  cityCards.innerHTML = html;
}

function updatePage() {
  drawChart();
  drawCards();
}

threshold.oninput = updatePage;
metric.onchange = function () {
  setSlider();
  updatePage();
};

setSlider();
updatePage();
