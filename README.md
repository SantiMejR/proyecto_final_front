# Proyecto Final — Frontend

Aplicación web del proyecto final CESDE. Es la cara visible del sistema:
permite registrar usuarios, registrar ventas y ver el dashboard de analítica
con gráficos y tablas generados con pandas.

Es uno de **tres repositorios** que conforman el proyecto:

| Repositorio | Tecnología | Puerto | Rol |
|---|---|---|---|
| `proyecto_final_front` | HTML + JS + Bootstrap | (estático) | **Este repo** — UI |
| `proyecto_final_back` | Spring Boot + Java 21 | `8080` | CRUD de usuarios, productos y ventas |
| `proyecto_final_analititca` | Flask + pandas | `5000` | Simulación, limpieza y análisis de datos |

---

## Tecnologías

- **HTML5** — vistas estáticas, una por funcionalidad.
- **CSS3** — un archivo de estilos por vista en `assets/css/`.
- **JavaScript (vanilla)** — sin frameworks. Lógica en `controllers/` y `services/`.
- **Bootstrap 5.3.3** — sistema de grid, formularios y componentes (CDN).
- **Bootstrap Icons 1.11.3** — iconografía (CDN).
- **Google Fonts (Poppins)** — tipografía.
- **Fetch API** — consumo de los servicios HTTP del back y la analítica.

---

## Estructura del proyecto

```
proyecto_final_front/
├── index.html                  # Login (entrada)
├── views/
│   ├── register.html           # Registro de usuario
│   ├── password-recovery.html  # Recuperación de contraseña
│   ├── registro-venta.html     # Registro de ventas
│   └── analitica.html          # Dashboard de analítica
├── controllers/
│   ├── loginController.js
│   ├── registerController.js
│   ├── passwordRecoveryController.js
│   ├── registroVentaController.js
│   ├── analiticaController.js
│   └── main.js
├── services/                   # Cliente HTTP (fetch)
│   ├── api.js                  # ↳ Spring Boot (8080)
│   └── analytics.js            # ↳ Flask (5000)
└── assets/
    └── css/
        ├── login.css
        ├── register.css
        ├── password-recovery.css
        ├── registro-venta.css
        ├── analitica.css
        └── styles.css
```

### Convención

- Cada vista HTML tiene **su controller JS** en `controllers/` y **su CSS** en `assets/css/`.
- Toda llamada HTTP pasa por **`services/`** — las vistas no llaman `fetch` directamente.
- `services/api.js` expone un objeto global `window.api` con métodos para usuarios, ventas y productos.
- `services/analytics.js` expone `window.analytics` con `simular()`, `limpiar()`, `analizar()` y `filtrar()`.

---

## Cómo funciona

### Flujo del usuario

1. **Login** (`index.html`) → valida correo y contraseña.
2. Tras autenticarse, el usuario llega a **Registro de venta** (`views/registro-venta.html`).
3. Desde el navbar puede ir a **Analítica** (`views/analitica.html`):
   - Botón **Simular**: pide datos crudos (con errores) al endpoint `/simular`.
   - Botón **Limpiar**: pide los datos ya validados a `/limpiar`.
   - Botón **Analizar**: pide gráficos y `describe()` a `/analizar`.
   - Sección **Filtros**: consulta `/filtrar?cargo=...&ids=1,2,3` y muestra agrupaciones.
4. Las tablas vienen como HTML (`df.to_html()` desde pandas) y se inyectan
   directamente; los gráficos llegan como `base64` y se ponen en `<img>`.

### Flujo de datos

```
   index.html ───────────────► [Spring Boot :8080]   (login, CRUD usuarios)
        │
        ▼
   registro-venta.html ──────► [Spring Boot :8080]   (POST /api/ventas)
        │
        ▼
   analitica.html ───────────► [Flask :5000]         (simular/limpiar/analizar/filtrar)
```

---

## Cómo usarlo

### Prerrequisitos

- Tener corriendo **el backend** (`http://localhost:8080`). Ver `proyecto_final_back/README.md`.
- Tener corriendo **la analítica** (`http://localhost:5000`). Ver `proyecto_final_analititca/README.md`.

### Servir el front

No requiere build. Cualquier servidor estático sirve:

```bash
# Opción 1: extensión "Live Server" de VS Code (clic derecho en index.html → Open with Live Server)

# Opción 2: Python
python -m http.server 5500

# Opción 3: Node
npx http-server -p 5500
```

Luego abre [http://localhost:5500](http://localhost:5500).

> **Importante:** abrir el HTML directamente con `file://` no funcionará bien
> con CORS — usa siempre un servidor HTTP.

### Configurar las URLs de los servicios

Si los puertos cambian, edita las constantes:

- `services/api.js` → `API_BASE = 'http://localhost:8080/api'`
- `services/analytics.js` → `ANALYTICS_BASE = 'http://localhost:5000'`

---

## Flujo de ramas

- Trabajo en **`develop`**.
- Merge a **`main`** cuando develop esté estable.

```bash
git checkout develop
# ... cambios ...
git commit -m "feat: ..."

# Cuando develop está listo:
git checkout main
git merge develop
```
