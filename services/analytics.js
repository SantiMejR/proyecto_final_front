// ================================
// Cliente HTTP de la analitica (Flask)
// Expone los endpoints /simular, /limpiar, /analizar, /filtrar.
// ================================

const ANALYTICS_BASE = 'http://localhost:5000';

async function _get(path) {
    const res = await fetch(`${ANALYTICS_BASE}${path}`);
    if (!res.ok) {
        const detalle = await res.text().catch(() => '');
        throw new Error(`Analitica ${res.status}: ${detalle || res.statusText}`);
    }
    return res.json();
}

const analytics = {
    health: () => _get('/health'),
    simular: () => _get('/simular'),
    limpiar: () => _get('/limpiar'),
    analizar: () => _get('/analizar'),
    filtrar: ({ cargo, ids } = {}) => {
        const params = new URLSearchParams();
        if (cargo) params.set('cargo', cargo);
        if (ids && ids.length) params.set('ids', ids.join(','));
        const qs = params.toString();
        return _get(`/filtrar${qs ? '?' + qs : ''}`);
    },
};

window.analytics = analytics;
