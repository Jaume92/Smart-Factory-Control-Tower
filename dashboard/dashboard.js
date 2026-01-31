<script>

const KPI_URL = "https://smart-factory-control-tower-2.onrender.com/kpi";

// =======================
// HISTÓRICO GLOBAL
// =======================

let history = [];
let currentRange = 10;

// =======================
// CHART
// =======================

const ctx = document.getElementById("oeeChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "OEE (%)",
      data: [],
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: value => value + "%"
        }
      }
    }
  }
});

// =======================
// RANGE CONTROL
// =======================

function setRange(minutes) {
  currentRange = minutes;
  updateChart();
}

// =======================
// UPDATE CHART
// =======================

function updateChart() {

  const now = Date.now();
  const limit = now - currentRange * 60 * 1000;

  const filtered = history.filter(p => p.time >= limit);

  chart.data.labels = filtered.map(p => p.label);
  chart.data.datasets[0].data = filtered.map(p => p.value);

  chart.update();
}

// =======================
// LOAD KPIS (SAFE VERSION)
// =======================

async function loadKPIs() {

  try {

    const res = await fetch(KPI_URL);
    const data = await res.json();

    // Protección contra null / undefined
    const oee = data.oee ?? 0;
    const availability = data.availability ?? 0;
    const quality = data.quality ?? 0;
    const records = data.records ?? 0;

    const oeePct = (oee * 100).toFixed(2);

    // =======================
    // KPI CARDS
    // =======================

    const oeeDiv = document.getElementById("oee");

    document.getElementById("availability").innerText =
      (availability * 100).toFixed(1) + "%";

    document.getElementById("quality").innerText =
      (quality * 100).toFixed(1) + "%";

    document.getElementById("records").innerText = records;

    oeeDiv.innerText = oeePct + "%";

    // =======================
    // COLOR STATUS
    // =======================

    oeeDiv.className = "big";

    if (oee >= 0.85) oeeDiv.classList.add("green");
    else if (oee >= 0.65) oeeDiv.classList.add("orange");
    else oeeDiv.classList.add("red");

    // =======================
    // STORE HISTORY
    // =======================

    const now = new Date();

    history.push({
      time: now.getTime(),
      label: now.toLocaleTimeString(),
      value: Number(oeePct)
    });

    // Keep last 24h
    const maxAge = Date.now() - 24 * 60 * 60 * 1000;
    history = history.filter(p => p.time >= maxAge);

    updateChart();

  } catch (err) {
    console.error("Error loading KPIs:", err);
  }
}

// =======================
// AUTO REFRESH
// =======================

setInterval(loadKPIs, 3000);
loadKPIs();

</script>
