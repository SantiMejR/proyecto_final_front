// ================================
// Registro de Venta - Controller
// Conecta con el backend Spring Boot via window.api (services/api.js).
// ================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Saludo personalizado ---
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const userNameEl = document.getElementById('userName');
    if (nombreGuardado && userNameEl) userNameEl.textContent = nombreGuardado;

    const form = document.getElementById('ventaForm');
    const selVendedor = document.getElementById('vendedor');
    const selCliente = document.getElementById('cliente');
    const tbody = document.getElementById('filasProductos');
    const totalEl = document.getElementById('totalVenta');
    const btnAgregar = document.getElementById('btnAgregarProducto');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const btnSubmit = document.getElementById('btnRegistrarVenta');
    const estadoConexion = document.getElementById('estadoConexion');

    let productosCatalogo = [];

    const formatoCOP = (n) => 'COP $ ' + (n || 0).toLocaleString('es-CO');

    // --- Cargar datos iniciales ---
    async function cargarDatos() {
        try {
            const [vendedores, clientes, productos] = await Promise.all([
                api.usuarios.porRol('VENDEDOR'),
                api.usuarios.porRol('CLIENTE'),
                api.productos.listar(),
            ]);
            productosCatalogo = productos;

            llenarSelectPersonas(selVendedor, vendedores, 'Selecciona un vendedor');
            llenarSelectPersonas(selCliente, clientes, 'Selecciona un cliente');

            estadoConexion.innerHTML =
                `<span class="text-success small">` +
                `<i class="bi bi-check-circle"></i> Conectado al backend ` +
                `(${vendedores.length} vendedores, ${clientes.length} clientes, ${productos.length} productos)` +
                `</span>`;

            // Una fila inicial
            agregarFilaProducto();
        } catch (error) {
            console.error(error);
            estadoConexion.innerHTML =
                `<span class="text-danger small">` +
                `<i class="bi bi-exclamation-triangle"></i> ` +
                `No se pudo conectar al backend en localhost:8080. Asegúrate de que esté corriendo.` +
                `</span>`;
        }
    }

    function llenarSelectPersonas(select, lista, placeholder) {
        select.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
        lista.forEach((u) => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = `${u.nombre} ${u.apellido} — ${u.email}`;
            select.appendChild(opt);
        });
    }

    // --- Filas de productos ---
    function agregarFilaProducto() {
        const tr = document.createElement('tr');
        tr.className = 'fila-producto';
        tr.innerHTML = `
            <td>
                <select class="form-select form-select-sm sel-producto" required>
                    <option value="" disabled selected>Selecciona un producto</option>
                    ${productosCatalogo.map(p =>
                        `<option value="${p.id}" data-precio="${p.precio}" data-stock="${p.stock}">
                            ${p.nombre} (${p.talla || '—'}, stock: ${p.stock})
                        </option>`
                    ).join('')}
                </select>
            </td>
            <td class="text-end precio-unit">—</td>
            <td>
                <input type="number" class="form-control form-control-sm input-cantidad"
                       min="1" value="1" required>
            </td>
            <td class="text-end subtotal">COP $ 0</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-danger btn-quitar"
                        title="Quitar fila">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        const selProducto = tr.querySelector('.sel-producto');
        const inputCantidad = tr.querySelector('.input-cantidad');
        const precioUnitEl = tr.querySelector('.precio-unit');
        const subtotalEl = tr.querySelector('.subtotal');
        const btnQuitar = tr.querySelector('.btn-quitar');

        function recalcular() {
            const opt = selProducto.selectedOptions[0];
            const precio = parseFloat(opt?.dataset.precio || 0);
            const stock = parseInt(opt?.dataset.stock || 0, 10);
            const cantidad = parseInt(inputCantidad.value, 10) || 0;

            precioUnitEl.textContent = precio ? formatoCOP(precio) : '—';
            subtotalEl.textContent = formatoCOP(precio * cantidad);

            // Validacion visual de stock
            inputCantidad.classList.remove('is-invalid');
            if (opt?.value && cantidad > stock) inputCantidad.classList.add('is-invalid');

            recalcularTotal();
        }

        selProducto.addEventListener('change', recalcular);
        inputCantidad.addEventListener('input', recalcular);
        btnQuitar.addEventListener('click', () => {
            tr.remove();
            recalcularTotal();
        });
    }

    function recalcularTotal() {
        let total = 0;
        tbody.querySelectorAll('.fila-producto').forEach((tr) => {
            const opt = tr.querySelector('.sel-producto').selectedOptions[0];
            const precio = parseFloat(opt?.dataset.precio || 0);
            const cantidad = parseInt(tr.querySelector('.input-cantidad').value, 10) || 0;
            total += precio * cantidad;
        });
        totalEl.textContent = formatoCOP(total);
    }

    btnAgregar.addEventListener('click', agregarFilaProducto);

    btnLimpiar.addEventListener('click', () => {
        tbody.innerHTML = '';
        selVendedor.selectedIndex = 0;
        selCliente.selectedIndex = 0;
        agregarFilaProducto();
        totalEl.textContent = formatoCOP(0);
    });

    // --- Submit ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        [selVendedor, selCliente].forEach((s) => {
            s.classList.remove('is-invalid', 'is-valid');
            if (!s.value) { s.classList.add('is-invalid'); isValid = false; }
            else { s.classList.add('is-valid'); }
        });

        const detalles = [];
        const filas = tbody.querySelectorAll('.fila-producto');
        if (filas.length === 0) {
            alert('Agrega al menos un producto.');
            return;
        }

        filas.forEach((tr) => {
            const sel = tr.querySelector('.sel-producto');
            const inp = tr.querySelector('.input-cantidad');
            sel.classList.remove('is-invalid');
            inp.classList.remove('is-invalid');

            if (!sel.value) { sel.classList.add('is-invalid'); isValid = false; return; }
            const cantidad = parseInt(inp.value, 10);
            if (!cantidad || cantidad < 1) { inp.classList.add('is-invalid'); isValid = false; return; }

            detalles.push({
                productoId: parseInt(sel.value, 10),
                cantidad: cantidad,
            });
        });

        if (!isValid) return;

        // DTO que espera VentaCreateDTO en el back
        const ventaDto = {
            vendedorId: parseInt(selVendedor.value, 10),
            clienteId: parseInt(selCliente.value, 10),
            detalles: detalles,
        };

        // Loading
        const btnText = btnSubmit.querySelector('.btn-text');
        const btnLoader = btnSubmit.querySelector('.btn-loader');
        btnText.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        btnSubmit.disabled = true;

        try {
            const venta = await api.ventas.crear(ventaDto);
            const toast = new bootstrap.Toast(document.getElementById('successToast'));
            toast.show();
            console.log('Venta creada:', venta);

            // Reset y recarga del catalogo (para reflejar stock actualizado)
            tbody.innerHTML = '';
            selVendedor.selectedIndex = 0;
            selCliente.selectedIndex = 0;
            totalEl.textContent = formatoCOP(0);
            productosCatalogo = await api.productos.listar();
            agregarFilaProducto();

        } catch (error) {
            console.error('Error al registrar venta:', error);
            alert('Error al registrar la venta:\n' + error.message);
        } finally {
            btnText.classList.remove('d-none');
            btnLoader.classList.add('d-none');
            btnSubmit.disabled = false;
        }
    });

    cargarDatos();
});
