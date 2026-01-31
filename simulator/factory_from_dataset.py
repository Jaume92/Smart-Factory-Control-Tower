import requests
import random
import time

API_URL = "http://localhost:8000/machine-data"

machines = ["LINE_1", "LINE_2", "LINE_3"]
causes = ["none", "sensor", "operator", "material", "maintenance"]


print("SMART FACTORY SIMULATOR RUNNING...")

while True:

    payload = {
        "machine": random.choice(machines),
        "produced": random.randint(40, 80),
        "scrap": random.randint(0, 6),
        "downtime": random.randint(0, 15),
        "cause": random.choice(causes),
        "cycle_time": round(random.uniform(2.5, 4.5), 2)
    }

    try:
        r = requests.post(API_URL, json=payload)
        print("DATA SENT:", payload, "STATUS:", r.status_code)

    except Exception as e:
        print("ERROR SENDING DATA:", e)

    time.sleep(5)   # cada 5 segundos
