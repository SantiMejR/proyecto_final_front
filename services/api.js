// ================================
// Cliente HTTP del backend (Spring Boot)
// Centraliza las llamadas fetch al CRUD de usuarios, ventas y productos.
// ================================

const API_BASE = 'http://localhost:8080/api';

async function _request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const detalle = await res.text().catch(() => '');
        throw new Error(`API ${res.status}: ${detalle || res.statusText}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

const api = {
    usuarios: {
        listar: () => _request('/usuarios'),
        obtener: (id) => _request(`/usuarios/${id}`),
        porRol: (rol) => _request(`/usuarios/rol/${rol}`),
        crear: (dto) => _request('/usuarios', { method: 'POST', body: JSON.stringify(dto) }),
        actualizar: (id, dto) => _request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
        eliminar: (id) => _request(`/usuarios/${id}`, { method: 'DELETE' }),
    },
    ventas: {
        listar: () => _request('/ventas'),
        crear: (dto) => _request('/ventas', { method: 'POST', body: JSON.stringify(dto) }),
    },
    productos: {
        listar: () => _request('/productos'),
    },
};

window.api = api;
