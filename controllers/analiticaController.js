// ================================
// Analitica - Controller
// Consume la API Flask y pinta tablas/graficos en la vista.
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);

    const btnSimular = $('btnSimular');
    const btnLimpiar = $('btnLimpiar');
    const btnAnalizar = $('btnAnalizar');
    const estadoServicio = $('estadoServicio');
    const formFiltro = $('formFiltro');
    const filtroCargo = $('filtroCargo');

    // Verifica que la API este viva al entrar a la vista
    analytics.health()
        .then(() => {
            estadoServicio.textContent = 'Servicio de analítica conectado en localhost:5000';
            estadoServicio.classList.add('text-success');
        })
        .catch(() => {
            estadoServicio.innerHTML =
                '<i class="bi bi-exclamation-triangle"></i> ' +
                'No se puede conectar con la analítica (localhost:5000). ' +
                'Asegúrate de correr <code>python app.py</code>.';
            estadoServicio.classList.add('text-danger');
        });

    function setLoading(btn, loading) {
        btn.disabled = loading;
        btn.classList.toggle('loading', loading);
    }

    function mostrarSeccion(id) {
        $(id).classList.remove('d-none');
    }

    btnSimular.addEventListener('click', async () => {
        setLoading(btnSimular, true);
        try {
            const data = await analytics.simular();
            $('tablaVentasRaw').innerHTML = data.ventas_html;
            $('tablaEmpleadosRaw').innerHTML = data.empleados_html;
            mostrarSeccion('seccionSimular');
        } catch (e) {
            alert('Error al simular: ' + e.message);
        } finally {
            setLoading(btnSimular, false);
        }
    });

    btnLimpiar.addEventListener('click', async () => {
        setLoading(btnLimpiar, true);
        try {
            const data = await analytics.limpiar();
            $('tablaVentasLimpias').innerHTML = data.ventas_html;
            $('tablaEmpleadosLimpios').innerHTML = data.empleados_html;
            mostrarSeccion('seccionLimpiar');
        } catch (e) {
            alert('Error al limpiar: ' + e.message);
        } finally {
            setLoading(btnLimpiar, false);
        }
    });

    btnAnalizar.addEventListener('click', async () => {
        setLoading(btnAnalizar, true);
        try {
            const data = await analytics.analizar();
            $('graficoPrenda').src = 'data:image/png;base64,' + data.grafico_prenda;
            $('graficoEmpleados').src = 'data:image/png;base64,' + data.grafico_empleados;
            $('graficoNovedades').src = 'data:image/png;base64,' + data.grafico_novedades;
            $('descVentas').innerHTML = data.descripcion_ventas.describe_html;
            $('descEmpleados').innerHTML = data.descripcion_empleados.describe_html;
            mostrarSeccion('seccionAnalizar');
        } catch (e) {
            alert('Error al analizar: ' + e.message);
        } finally {
            setLoading(btnAnalizar, false);
        }
    });

    // Carga inicial de los cargos disponibles para el select
    async function cargarFiltroInicial() {
        try {
            const data = await analytics.filtrar();
            (data.cargos_disponibles || []).forEach((c) => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                filtroCargo.appendChild(opt);
            });
            pintarFiltro(data);
        } catch (e) {
            console.warn('No se pudo cargar filtro inicial:', e.message);
        }
    }

    function pintarFiltro(data) {
        $('tablaEmpleadosFiltrados').innerHTML = data.empleados_html || '';
        $('tablaVentasFiltradas').innerHTML = data.ventas_html || '';
        $('tablaAgrupado').innerHTML = data.agrupado_html || '';
        $('countEmpleados').textContent = data.empleados_count ?? '';
        $('countVentas').textContent = data.ventas_count ?? '';
    }

    formFiltro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cargo = filtroCargo.value;
        const idsTxt = $('filtroIds').value.trim();
        const ids = idsTxt
            ? idsTxt.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
            : null;
        try {
            const data = await analytics.filtrar({ cargo, ids });
            pintarFiltro(data);
        } catch (err) {
            alert('Error al filtrar: ' + err.message);
        }
    });

    cargarFiltroInicial();
});
