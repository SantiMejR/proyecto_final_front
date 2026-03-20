// ================================
// Registro de Venta - Controller
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Personalizar saludo con el nombre del usuario registrado ---
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const userNameEl = document.getElementById('userName');
    if (nombreGuardado && userNameEl) {
        userNameEl.textContent = nombreGuardado;
    }

    const form = document.getElementById('ventaForm');
    const centroComercial = document.getElementById('centroComercial');
    const localSelect = document.getElementById('local');
    const vendedor = document.getElementById('vendedor');
    const fechaRegistro = document.getElementById('fechaRegistro');
    const costoTotal = document.getElementById('costoTotal');

    // --- Datos quemados: locales por centro comercial ---
    const localesPorCentro = {
        'plaza-norte': [
            { value: 'pn-101', text: 'Local 101 - Planta Baja' },
            { value: 'pn-205', text: 'Local 205 - Segundo Piso' },
            { value: 'pn-312', text: 'Local 312 - Tercer Piso' },
            { value: 'pn-110', text: 'Local 110 - Zona Fashion' }
        ],
        'mega-plaza': [
            { value: 'mp-a12', text: 'Local A-12 - Ala Norte' },
            { value: 'mp-b05', text: 'Local B-05 - Ala Sur' },
            { value: 'mp-c20', text: 'Local C-20 - Food Court' }
        ],
        'jockey-plaza': [
            { value: 'jp-201', text: 'Local 201 - Boulevard' },
            { value: 'jp-315', text: 'Local 315 - Zona Premium' },
            { value: 'jp-108', text: 'Local 108 - Planta Baja' },
            { value: 'jp-420', text: 'Local 420 - Cuarto Piso' }
        ],
        'real-plaza': [
            { value: 'rp-f01', text: 'Local F-01 - Fashion Avenue' },
            { value: 'rp-f15', text: 'Local F-15 - Segundo Nivel' },
            { value: 'rp-g03', text: 'Local G-03 - Galería Central' }
        ],
        'plaza-san-miguel': [
            { value: 'psm-102', text: 'Local 102 - Entrada Principal' },
            { value: 'psm-245', text: 'Local 245 - Segundo Piso' },
            { value: 'psm-330', text: 'Local 330 - Zona Lifestyle' }
        ],
        'mall-aventura': [
            { value: 'ma-a01', text: 'Local A-01 - Planta Baja' },
            { value: 'ma-b12', text: 'Local B-12 - Nivel 2' },
            { value: 'ma-c05', text: 'Local C-05 - Terraza' }
        ],
        'open-plaza': [
            { value: 'op-110', text: 'Local 110 - Ingreso Sur' },
            { value: 'op-205', text: 'Local 205 - Piso 2' },
            { value: 'op-308', text: 'Local 308 - Piso 3' }
        ]
    };

    // --- Establecer fecha actual por defecto ---
    const hoy = new Date().toISOString().split('T')[0];
    fechaRegistro.value = hoy;

    // --- Dropdown dependiente: Centro Comercial → Local ---
    centroComercial.addEventListener('change', () => {
        const centroSeleccionado = centroComercial.value;
        const locales = localesPorCentro[centroSeleccionado] || [];

        // Limpiar y habilitar
        localSelect.innerHTML = '';
        localSelect.disabled = false;
        localSelect.classList.remove('is-invalid', 'is-valid');

        // Opción por defecto
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.disabled = true;
        defaultOpt.selected = true;
        defaultOpt.textContent = 'Selecciona un local';
        localSelect.appendChild(defaultOpt);

        // Agregar locales
        locales.forEach(local => {
            const opt = document.createElement('option');
            opt.value = local.value;
            opt.textContent = local.text;
            localSelect.appendChild(opt);
        });

        // Actualizar resumen
        updateSummary();
    });

    // --- Actualizar resumen en tiempo real ---
    function updateSummary() {
        const summCentro = document.getElementById('summCentro');
        const summLocal = document.getElementById('summLocal');
        const summVendedor = document.getElementById('summVendedor');
        const summCosto = document.getElementById('summCosto');

        summCentro.textContent = centroComercial.selectedOptions[0]?.text !== 'Selecciona un centro comercial'
            ? centroComercial.selectedOptions[0]?.text : '—';

        summLocal.textContent = localSelect.selectedOptions[0]?.text !== 'Selecciona un local'
            && localSelect.selectedOptions[0]?.text !== 'Primero selecciona un centro comercial'
            ? localSelect.selectedOptions[0]?.text : '—';

        summVendedor.textContent = vendedor.selectedOptions[0]?.text !== 'Selecciona un vendedor'
            ? vendedor.selectedOptions[0]?.text : '—';

        const costo = parseFloat(costoTotal.value) || 0;
        summCosto.textContent = `COP $ ${costo.toLocaleString('es-CO')}`;
    }

    // Listeners para resumen en tiempo real
    [centroComercial, localSelect, vendedor].forEach(el => {
        el.addEventListener('change', updateSummary);
    });
    costoTotal.addEventListener('input', updateSummary);

    // --- Validación y envío ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar validaciones
        form.querySelectorAll('.custom-select, .cost-input').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });

        let isValid = true;

        // Validar centro comercial
        if (!centroComercial.value) {
            centroComercial.classList.add('is-invalid');
            isValid = false;
        } else {
            centroComercial.classList.add('is-valid');
        }

        // Validar local
        if (!localSelect.value) {
            localSelect.classList.add('is-invalid');
            isValid = false;
        } else {
            localSelect.classList.add('is-valid');
        }

        // Validar vendedor
        if (!vendedor.value) {
            vendedor.classList.add('is-invalid');
            isValid = false;
        } else {
            vendedor.classList.add('is-valid');
        }

        // Validar fecha
        if (!fechaRegistro.value) {
            fechaRegistro.classList.add('is-invalid');
            isValid = false;
        } else {
            fechaRegistro.classList.add('is-valid');
        }

        // Validar costo
        const costoVal = parseFloat(costoTotal.value);
        if (!costoVal || costoVal <= 0) {
            costoTotal.classList.add('is-invalid');
            document.querySelector('.cost-input-group').style.borderColor = 'var(--danger)';
            isValid = false;
        } else {
            costoTotal.classList.add('is-valid');
            document.querySelector('.cost-input-group').style.borderColor = 'var(--success)';
        }

        if (!isValid) {
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.closest('.select-wrapper')?.classList.add('shake');
                setTimeout(() => {
                    form.querySelectorAll('.shake').forEach(el => el.classList.remove('shake'));
                }, 400);
            }
            return;
        }

        // Mostrar loading
        const btn = document.getElementById('btnRegistrarVenta');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        btnText.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        btn.disabled = true;

        // Preparar datos
        const ventaData = {
            centroComercial: centroComercial.selectedOptions[0]?.text,
            local: localSelect.selectedOptions[0]?.text,
            vendedor: vendedor.selectedOptions[0]?.text,
            vendedorId: vendedor.value,
            fecha: fechaRegistro.value,
            costoTotal: costoVal
        };

        console.log('Datos de venta:', ventaData);

        try {
            // TODO: Conectar con el servicio real
            // const response = await ventaService.registrar(ventaData);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mostrar toast de éxito
            const toast = new bootstrap.Toast(document.getElementById('successToast'));
            toast.show();

            // Resetear formulario
            resetForm();

        } catch (error) {
            console.error('Error al registrar venta:', error);
            alert('Error al registrar la venta. Inténtalo de nuevo.');
        } finally {
            btnText.classList.remove('d-none');
            btnLoader.classList.add('d-none');
            btn.disabled = false;
        }
    });

    // --- Botón Limpiar ---
    document.getElementById('btnLimpiar').addEventListener('click', resetForm);

    function resetForm() {
        form.reset();
        fechaRegistro.value = hoy;
        localSelect.innerHTML = '<option value="" disabled selected>Primero selecciona un centro comercial</option>';
        localSelect.disabled = true;

        // Limpiar clases de validación
        form.querySelectorAll('.custom-select, .cost-input').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });
        document.querySelector('.cost-input-group').style.borderColor = '';

        // Resetear resumen
        document.getElementById('summCentro').textContent = '—';
        document.getElementById('summLocal').textContent = '—';
        document.getElementById('summVendedor').textContent = '—';
        document.getElementById('summCosto').textContent = 'COP $ 0';
    }

    // --- Limpiar validación al interactuar ---
    form.querySelectorAll('.custom-select').forEach(el => {
        el.addEventListener('change', () => {
            el.classList.remove('is-invalid');
        });
    });

    costoTotal.addEventListener('input', () => {
        costoTotal.classList.remove('is-invalid');
        document.querySelector('.cost-input-group').style.borderColor = '';
    });
});
