// ================================
// Password Recovery - Controller
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryEmailInput = document.getElementById('recoveryEmail');

    // --- Validación y envío del formulario de recuperación ---
    recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar validaciones previas
        recoveryEmailInput.classList.remove('is-invalid', 'is-valid');

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recoveryEmailInput.value)) {
            recoveryEmailInput.classList.add('is-invalid');
            recoveryForm.querySelector('.form-floating-custom')
                .classList.add('shake');
            setTimeout(() => {
                recoveryForm.querySelectorAll('.shake').forEach(el => el.classList.remove('shake'));
            }, 500);
            return;
        }

        recoveryEmailInput.classList.add('is-valid');

        // Mostrar estado de carga
        const btn = document.getElementById('btnRecovery');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        const btnArrow = btn.querySelector('.btn-arrow');
        btnText.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        btn.disabled = true;

        const recoveryData = {
            correo: recoveryEmailInput.value.trim()
        };

        console.log('Datos de recuperación:', recoveryData);

        try {
            // TODO: Conectar con el servicio de recuperación real
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mostrar paso 2 (éxito)
            document.getElementById('recoveryStep1').classList.add('d-none');
            document.getElementById('recoveryStep2').classList.remove('d-none');
            document.getElementById('recoveryEmailDisplay').textContent = recoveryEmailInput.value;

        } catch (error) {
            console.error('Error al enviar recuperación:', error);
            alert('Error al enviar el correo. Inténtalo de nuevo.');
        } finally {
            btnText.classList.remove('d-none');
            btnLoader.classList.add('d-none');
            btn.disabled = false;
        }
    });

    // --- Limpiar validación al escribir ---
    recoveryEmailInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
});
