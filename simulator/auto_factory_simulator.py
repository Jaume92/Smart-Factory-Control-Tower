import random
import time
import requests
import math

API_URL = "http://127.0.0.1:8000/machine-data"

machines = ["LINE_1", "LINE_2", "LINE_3"]
causes = ["sensor", "operator", "material", "maintenance"]

print("SMART FACTORY ADVANCED SIMULATOR RUNNING...")

# =========================
# ESTADO GLOBAL DE PLANTA
# =========================

machine_health = 1.0         # 1 = perfecta, 0.5 = muy degradada
health_decay = 0.9995       # desgaste progresivo
maintenance_boost = 0.15    # recuperación tras mantenimiento

tick = 0

while True:

    tick += 1

    machine = random.choice(machines)

    # =========================
    # CICLO DE DEMANDA (onda)
    # simula turnos y picos diarios
    # =========================

    demand_factor = 0.7 + 0.3 * math.sin(tick / 120)

    # =========================
    # EVENTOS RAROS (SHOCKS)
    # =========================

    shock_event = random.random() < 0.015

    # =========================
    # BREAKDOWN REAL
    # =========================

    breakdown = random.random() < (0.03 + (1 - machine_health) * 0.08)

    if shock_event:
        produced = random.randint(0, 20)
        scrap = random.randint(5, 15)
        downtime = random.randint(30, 80)
        cause = random.choice(causes)
        cycle_time = round(random.uniform(5.0, 8.0), 2)

        machine_health *= 0.9

    elif breakdown:
        produced = random.randint(10, 35)
        scrap = random.randint(2, 8)
        downtime = random.randint(15, 45)
        cause = random.choice(causes)
        cycle_time = round(random.uniform(4.0, 6.0), 2)

        # mantenimiento parcial
        machine_health = min(1.0, machine_health + maintenance_boost)

    else:
        base_prod = random.randint(55, 85)
        produced = int(base_prod * machine_health * demand_factor)

        scrap_rate = random.uniform(0.01, 0.07) + (1 - machine_health) * 0.1
        scrap = int(produced * scrap_rate)

        downtime = random.randint(0, 8)
        cause = "none"

        cycle_time = round(random.uniform(2.4, 3.2) / machine_health, 2)

        # degradación lenta
        machine_health *= health_decay
        machine_health = max(0.55, machine_health)

    payload = {
        "machine": machine,
        "produced": produced,
        "scrap": scrap,
        "downtime": downtime,
        "cause": cause,
        "cycle_time": cycle_time
    }

    try:
        r = requests.post(API_URL, json=payload)
        print(f"[TICK {tick}] SENT:", payload, "STATUS:", r.status_code)

    except Exception as e:
        print("ERROR SENDING DATA:", e)

    time.sleep(1)
