// ================================
// Login - Controller
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('toggleLoginPassword');
    const passwordInput = document.getElementById('loginPassword');

    // --- Toggle visibilidad de contraseña ---
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });

    // --- Validación y envío del login ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar validaciones previas
        loginForm.querySelectorAll('.custom-input').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        const correo = document.getElementById('loginCorreo');
        const password = document.getElementById('loginPassword');
        let isValid = true;

        // Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.value)) {
            correo.classList.add('is-invalid');
            isValid = false;
        } else {
            correo.classList.add('is-valid');
        }

        // Validar contraseña
        if (password.value.length < 6) {
            password.classList.add('is-invalid');
            isValid = false;
        } else {
            password.classList.add('is-valid');
        }

        if (!isValid) {
            loginForm.querySelector('.is-invalid')?.closest('.form-floating-custom')
                ?.classList.add('shake');
            setTimeout(() => {
                loginForm.querySelectorAll('.shake').forEach(el => el.classList.remove('shake'));
            }, 500);
            return;
        }

        // Mostrar estado de carga
        const btn = document.getElementById('btnLogin');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        const btnArrow = btn.querySelector('.btn-arrow');
        btnText.classList.add('d-none');
        btnArrow.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        btn.disabled = true;

        const loginData = {
            correo: correo.value.trim(),
            password: password.value
        };

        console.log('Datos de login:', loginData);

        try {
            // TODO: Conectar con el servicio de autenticación real
            // const response = await authService.login(loginData);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirigir a la vista de registro de ventas después del login
            window.location.href = 'views/registro-venta.html';

        } catch (error) {
            console.error('Error en el login:', error);
            alert('Credenciales incorrectas. Inténtalo de nuevo.');
        } finally {
            btnText.classList.remove('d-none');
            btnArrow.classList.remove('d-none');
            btnLoader.classList.add('d-none');
            btn.disabled = false;
        }
    });

    // --- Limpiar validación al escribir ---
    loginForm.querySelectorAll('.custom-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
        });
    });
});
