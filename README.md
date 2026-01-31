Smart Factory Control Tower — Sistema de Monitorización Lean en Tiempo Real
Descripción general

Este proyecto implementa un sistema de monitorización industrial en tiempo real orientado a entornos Lean Manufacturing. El objetivo es simular una planta productiva digitalizada y proporcionar visibilidad operativa mediante KPIs clave, especialmente el indicador OEE (Overall Equipment Effectiveness).

La solución está diseñada como un prototipo funcional de Control Tower industrial, integrando simulación de datos, backend de procesamiento y visualización ejecutiva.

Funcionalidades principales

El sistema incluye actualmente:

Generación automática de datos productivos mediante simulador industrial

Ingesta de datos en tiempo real vía API REST

Cálculo dinámico de KPIs Lean

Monitorización de OEE, Availability, Performance y Quality

Dashboard web con actualización automática

Visualización de tendencias temporales

Análisis por ventanas de tiempo configurables

Arquitectura del sistema

La arquitectura sigue un enfoque modular inspirado en sistemas industriales reales:

Simulador de Planta
        ↓
API Backend (FastAPI)
        ↓
Motor de Cálculo Lean
        ↓
Dashboard Control Tower


Este diseño permite desacoplar generación de datos, procesamiento y visualización, facilitando escalabilidad y despliegue en entornos cloud.

Indicadores Lean implementados

El KPI principal es el OEE (Overall Equipment Effectiveness), utilizado en entornos industriales para medir eficiencia productiva real.

Fórmula aplicada:

OEE = Availability × Performance × Quality


Donde:

Availability representa el tiempo operativo real frente al tiempo planificado

Performance mide la eficiencia de velocidad de producción

Quality refleja la proporción de producto conforme frente a scrap

Este enfoque permite identificar pérdidas productivas y oportunidades de mejora continua.

Estructura del proyecto
smart_factory/
 ├── backend/
 │    └── main.py
 ├── simulator/
 │    └── auto_factory_simulator.py
 ├── dashboard/
 │    └── index.html

Ejecución local
Iniciar backend API

Desde la carpeta backend:

cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000


La documentación interactiva de la API estará disponible en:

http://localhost:8000/docs

Iniciar simulador industrial

Desde la carpeta simulator:

cd simulator
python auto_factory_simulator.py


Este proceso genera eventos productivos de forma continua.

Visualizar Control Tower

Abrir en el navegador:

dashboard/index.html


El dashboard se actualiza automáticamente en tiempo real.

Caso de uso

El sistema está orientado a escenarios de consultoría digital industrial donde se requiere:

Monitorización continua de producción

Visualización ejecutiva de KPIs Lean

Análisis de tendencias operativas

Soporte a procesos de mejora continua

Validación de arquitecturas de digitalización industrial

Tecnologías utilizadas

Python

FastAPI

REST API

HTML, CSS y JavaScript

Chart.js

Simulación de procesos productivos

Roadmap

Las siguientes mejoras están previstas para futuras iteraciones:

Sistema de alertas automáticas basado en umbrales Lean

Pareto de causas de paradas y pérdidas productivas

Persistencia de datos en base de datos

Despliegue cloud del sistema completo

Análisis histórico por turnos

Comparación entre rendimiento objetivo y real

Autor

Proyecto desarrollado por Jaume.
Enfocado a sistemas de analítica industrial, consultoría digital y aplicaciones prácticas de inteligencia artificial en entornos productivos.