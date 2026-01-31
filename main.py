from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# =========================
# FASTAPI APP (RENDER SAFE)
# =========================

app = FastAPI(
    title="Smart Factory Control Tower API",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HEALTH CHECK ENDPOINTS
# =========================

@app.get("/")
def root():
    return {"status": "Smart Factory API online"}

@app.get("/ping")
def ping():
    return {"ping": "ok"}

# =========================
# MODELO DE DATOS INDUSTRIAL
# =========================

class MachineData(BaseModel):
    machine: str
    produced: int
    scrap: int
    downtime: int   # minutos
    cause: str
    cycle_time: float


# =========================
# "BASE DE DATOS" EN MEMORIA
# =========================

factory_db = []


# =========================
# INGESTA DE DATOS (STREAMING)
# =========================

@app.post("/machine-data")
def receive_data(data: MachineData):

    record = {
        "machine": data.machine,
        "produced": data.produced,
        "scrap": data.scrap,
        "downtime": data.downtime,
        "cause": data.cause,
        "cycle_time": data.cycle_time,
        "timestamp": datetime.now().isoformat()
    }

    factory_db.append(record)

    print("NEW DATA RECEIVED:", record)

    return {
        "status": "ok",
        "total_records": len(factory_db)
    }


# =========================
# HISTÓRICO PRODUCCIÓN
# =========================

@app.get("/data")
def get_all_data():
    return factory_db


# =========================
# KPI LEAN INDUSTRIAL
# =========================

@app.get("/kpi")
def get_kpis():

    try:

        if len(factory_db) == 0:
            return {
                "availability": 0,
                "quality": 0,
                "performance": 0,
                "oee": 0,
                "records": 0
            }

        total_produced = sum(x["produced"] for x in factory_db)
        total_scrap = sum(x["scrap"] for x in factory_db)
        total_downtime = sum(x["downtime"] for x in factory_db)

        planned_time = len(factory_db) * 60

        if planned_time > 0:
            availability = (planned_time - total_downtime) / planned_time
        else:
            availability = 0

        if total_produced > 0:
            quality = (total_produced - total_scrap) / total_produced
        else:
            quality = 0

        performance = 0.9

        oee = availability * quality * performance

        return {
            "availability": round(availability, 2),
            "quality": round(quality, 2),
            "performance": performance,
            "oee": round(oee, 2),
            "records": len(factory_db)
        }

    except Exception as e:
        return {"error": str(e)}


# =========================
# ALERTAS LEAN
# =========================

@app.get("/alerts")
def get_alerts():

    kpi = get_kpis()

    alerts = []

    if kpi["oee"] < 0.7:
        alerts.append("OEE CRITICAL: Performance below 70%")

    if kpi["availability"] < 0.8:
        alerts.append("LOW AVAILABILITY: High downtime detected")

    if kpi["quality"] < 0.9:
        alerts.append("QUALITY ISSUE: Scrap rate too high")

    return {"alerts": alerts}
