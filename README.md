# Smart Factory Control Tower — Sistema de Monitorización Industrial en Tiempo Real

Sistema de monitorización industrial tipo SCADA para visualizar KPIs de producción en tiempo real a partir de un entorno de fábrica simulado.

El proyecto implementa un pipeline completo desde la generación de datos de planta, su ingesta vía API, el cálculo de indicadores Lean y su visualización en un dashboard web en tiempo real.

---

## Funcionalidades principales

- Monitorización en tiempo real de KPIs industriales:
  - OEE (Overall Equipment Effectiveness)
  - Availability
  - Quality
- Visualización de tendencias mediante gráfica multilínea
- Sistema de alertas visuales cuando los KPIs superan umbrales críticos
- Simulador de planta industrial con comportamiento realista:
  - Micro-paradas
  - Averías
  - Picos de producción
  - Scrap variable
- Interfaz estilo sala de control industrial
- Modo turno noche
- Actualización automática cada pocos segundos

---

## Arquitectura del sistema

[Simulador de Planta]
│
▼
POST /machine-data
│
[Backend FastAPI]
│
├── Motor de KPIs (/kpi)
├── Histórico de producción (/data)
└── Sistema de alertas
│
▼
[Dashboard Web SCADA]


---

## Tecnologías utilizadas

### Backend
- Python
- FastAPI
- Uvicorn
- API REST

### Frontend
- HTML5
- CSS (tema industrial SCADA)
- JavaScript Vanilla
- Chart.js

---

## KPIs implementados

- OEE (Overall Equipment Effectiveness)
- Availability
- Quality
- Contador de registros de producción

---

## Ejecución en local

### 1. Arrancar backend

Desde la carpeta backend:

```bash
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
La API quedará disponible en:

http://127.0.0.1:8000
2. Arrancar simulador de fábrica
En otra terminal:

cd simulator
python auto_factory_simulator.py
Esto inicia el flujo continuo de datos de producción.

3. Abrir dashboard
Abrir directamente en el navegador:

index.html
Controles del dashboard
Doble click en el título: activar/desactivar modo turno noche

Botones de rango temporal: cambiar ventana de histórico

Actualización automática cada 3 segundos

Posibles mejoras futuras
Persistencia en base de datos (PostgreSQL / SQLite)

Autenticación de usuarios

Multi-planta y multi-línea

Módulo de mantenimiento predictivo

Despliegue en cloud

Forecast de producción

Exportación de datos

Autor
Proyecto desarrollado por Jaume