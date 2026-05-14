# Familia App - TODO List

## Base de Datos y Estructura
- [x] Diseñar esquema de base de datos completo
- [x] Crear tablas: users, children, expenses, tasks, rewards, points_history, streaks
- [x] Configurar relaciones entre tablas
- [x] Generar y aplicar migraciones SQL

## Backend (tRPC Procedures)
- [x] Implementar procedimientos para gestión de gastos (crear, editar, eliminar, listar)
- [x] Implementar procedimientos para gestión de categorías de gastos
- [x] Implementar procedimientos para gestión de hijos (crear, editar, listar)
- [x] Implementar procedimientos para gestión de tareas (crear, editar, eliminar, listar)
- [x] Implementar procedimientos para marcar tareas como completadas
- [x] Implementar procedimientos para gestión de recompensas (crear, editar, eliminar, listar)
- [x] Implementar procedimientos para canjear recompensas
- [x] Implementar procedimientos para calcular rachas
- [x] Implementar procedimientos para calcular niveles y progresión
- [x] Implementar procedimientos para obtener resumen financiero

## UI - Panel de Administrador (Ana)
- [x] Crear layout principal con sidebar
- [x] Implementar sección de registro de gastos (formulario rápido)
- [x] Implementar dashboard financiero con gráficos
- [x] Implementar sección de presupuesto mensual
- [x] Implementar calendario de pagos recurrentes
- [x] Implementar gestión de hijos (CRUD)
- [x] Implementar gestión de tareas (CRUD)
- [x] Implementar gestión de recompensas (CRUD)
- [x] Implementar vista de rachas y progresión de hijos

## UI - Dashboard de Hijos
- [x] Crear layout personalizado por hijo
- [x] Implementar lista de tareas diarias/semanales
- [x] Implementar botón para marcar tarea como completada
- [x] Implementar visualización de puntos acumulados
- [x] Implementar visualización de racha actual
- [x] Implementar tienda de recompensas
- [x] Implementar interfaz para canjear recompensas
- [x] Implementar visualización de nivel y progresión

## Gamificación
- [x] Implementar sistema de puntos
- [x] Implementar sistema de rachas (streak counter)
- [x] Implementar sistema de niveles
- [x] Implementar cálculo de bonos por racha
- [x] Implementar desbloqueo de insignias

## Animaciones y UX
- [x] Agregar animación de celebración al completar tarea
- [x] Agregar animación de ganancia de puntos
- [x] Agregar notificaciones de tareas pendientes
- [x] Agregar notificaciones de pagos próximos
- [x] Agregar transiciones suaves entre pantallas

## Estilos y Tema
- [x] Configurar paleta de colores (gris claro, azul pastel, rosa blush)
- [x] Configurar tipografía (sans-serif, negra gruesa para títulos, delgada para subtítulos)
- [x] Crear componentes base con estética minimalista escandinava
- [x] Aplicar tema global a toda la aplicación

## Pruebas
- [x] Escribir tests para procedimientos tRPC
- [x] Escribir tests para cálculo de puntos y rachas
- [x] Escribir tests para cálculo de niveles
- [x] Validar flujos de usuario completos

## Deployment
- [x] Crear checkpoint inicial
- [x] Validar funcionamiento en producción
- [x] Documentar instrucciones de uso

## Dashboard Principal (HomeSync)
- [ ] Crear página de Dashboard Principal con perfiles de familia
- [ ] Mostrar roles y responsabilidades por persona
- [ ] Implementar checklist gamificado con puntos
- [ ] Agregar meta semanal visual
- [ ] Crear cronograma de pantallas/actividades
- [ ] Agregar sección de reglas innegociables
- [ ] Integrar Dashboard en navegación principal
