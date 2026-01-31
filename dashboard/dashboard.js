<script>

const KPI_URL = "http://localhost:8000/kpi";

// HISTÓRICO GLOBAL
let history = [];

// Rango actual en minutos
let currentRange = 10;

// Chart
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

// Cambiar rango
function setRange(minutes) {
  currentRange = minutes;
  updateChart();
}

// Actualiza gráfico según rango seleccionado
function updateChart() {

  const now = Date.now();
  const limit = now - currentRange * 60 * 1000;

  const filtered = history.filter(p => p.time >= limit);

  chart.data.labels = filtered.map(p => p.label);
  chart.data.datasets[0].data = filtered.map(p => p.value);

  chart.update();
}

// Cargar KPIs
async function loadKPIs() {

  try {

    const res = await fetch(KPI_URL);
    const data = await res.json();

    const oee = data.oee;
    const oeePct = (oee * 100).toFixed(2);

    // TARJETAS
    const oeeDiv = document.getElementById("oee");

    document.getElementById("availability").innerText =
      (data.availability * 100).toFixed(1) + "%";

    document.getElementById("quality").innerText =
      (data.quality * 100).toFixed(1) + "%";

    document.getElementById("records").innerText = data.records;

    oeeDiv.innerText = oeePct + "%";

    // Semáforo
    oeeDiv.className = "big";

    if (oee >= 0.85) oeeDiv.classList.add("green");
    else if (oee >= 0.65) oeeDiv.classList.add("orange");
    else oeeDiv.classList.add("red");

    // Guardar histórico
    const now = new Date();

    history.push({
      time: now.getTime(),
      label: now.toLocaleTimeString(),
      value: Number(oeePct)
    });

    // Mantener máx 24h en memoria
    const maxAge = Date.now() - 24 * 60 * 60 * 1000;
    history = history.filter(p => p.time >= maxAge);

    // Actualizar gráfico
    updateChart();

  } catch (err) {
    console.error("Error loading KPIs:", err);
  }
}

// Auto refresh
setInterval(loadKPIs, 3000);
loadKPIs();

</script>
