<script>

const KPI_URL = "http://127.0.0.1:8000/kpi";

let history = [];
let currentRange = 10;

// =======================
// SCADA TOP BAR
// =======================

const bar = document.createElement("div");
bar.className = "scada-bar";
bar.innerHTML = `
  <div>🏭 CONTROL ROOM</div>
  <div id="systemStatus">SYSTEM: ONLINE</div>
  <div id="clock">--:--</div>
`;
document.body.prepend(bar);

// =======================
// ALERT BANNER
// =======================

const alertBox = document.createElement("div");
alertBox.className = "alert-banner";
alertBox.id = "alertBox";
alertBox.innerText = "⚠ CRITICAL ALERT: LOW OEE DETECTED";
document.body.insertBefore(alertBox, document.querySelector(".container"));

// =======================
// CLOCK
// =======================

setInterval(() => {
  const now = new Date();
  document.getElementById("clock").innerText =
    now.toLocaleTimeString();
}, 1000);

// =======================
// CHART INIT (MULTI KPI)
// =======================

const canvas = document.getElementById("oeeChart");
const ctx = canvas.getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "OEE %",
        data: [],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0
      },
      {
        label: "Availability %",
        data: [],
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 0,
        borderDash: [5,5]
      },
      {
        label: "Quality %",
        data: [],
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 0
      }
    ]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      y: {
        min: 0,
        max: 100
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

  chart.data.datasets[0].data = filtered.map(p => p.oee);
  chart.data.datasets[1].data = filtered.map(p => p.availability);
  chart.data.datasets[2].data = filtered.map(p => p.quality);

  chart.update();
}

// =======================
// NIGHT SHIFT MODE
// =======================

document.querySelector("h1").ondblclick = () => {
  document.body.classList.toggle("night-shift");
};

// =======================
// LOAD KPIS
// =======================

async function loadKPIs() {

  try {

    const res = await fetch(KPI_URL);
    const data = await res.json();

    const oee = data.oee || 0;
    const availability = data.availability || 0;
    const quality = data.quality || 0;
    const records = data.records || 0;

    const oeePct = (oee * 100).toFixed(1);
    const availabilityPct = (availability * 100).toFixed(1);
    const qualityPct = (quality * 100).toFixed(1);

    // =======================
    // KPI CARDS
    // =======================

    document.getElementById("availability").innerText = availabilityPct + "%";
    document.getElementById("quality").innerText = qualityPct + "%";
    document.getElementById("records").innerText = records;

    const oeeDiv = document.getElementById("oee");
    oeeDiv.innerText = oeePct + "%";

    oeeDiv.className = "big";
    if (oee >= 0.85) oeeDiv.classList.add("green");
    else if (oee >= 0.65) oeeDiv.classList.add("orange");
    else oeeDiv.classList.add("red");

    // =======================
    // STORE HISTORY
    // =======================

    const nowTime = new Date();

    history.push({
      time: nowTime.getTime(),
      label: nowTime.toLocaleTimeString(),
      oee: Number(oeePct),
      availability: Number(availabilityPct),
      quality: Number(qualityPct)
    });

    history = history.filter(p => p.time >= Date.now() - 86400000);

    updateChart();

    // =======================
    // ALERT SYSTEM
    // =======================

    const statusLabel = document.getElementById("systemStatus");

    if (oee < 0.7) {
      alertBox.style.display = "block";
      statusLabel.innerText = "SYSTEM: ALERT";
      statusLabel.style.color = "#ef4444";
    } else {
      alertBox.style.display = "none";
      statusLabel.innerText = "SYSTEM: ONLINE";
      statusLabel.style.color = "#22c55e";
    }

    // =======================
    // KPI PULSE EFFECT
    // =======================

    document.querySelectorAll(".card").forEach(card => {
      card.classList.remove("pulse");
      void card.offsetWidth;
      card.classList.add("pulse");
    });

  } catch (err) {
    console.error("ERROR KPI:", err);
  }
}

// =======================
// AUTO REFRESH
// =======================

setInterval(loadKPIs, 3000);
loadKPIs();

</script>
