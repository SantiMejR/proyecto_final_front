// ================================
// Registro - Controller
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const btnRegistrar = document.getElementById('btnRegistrar');

    // --- Toggle visibilidad de contraseña ---
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });

    // --- Indicador de fuerza de contraseña ---
    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        const bars = [
            document.getElementById('bar1'),
            document.getElementById('bar2'),
            document.getElementById('bar3'),
            document.getElementById('bar4')
        ];
        const strengthText = document.getElementById('strengthText');

        // Reset
        bars.forEach(bar => bar.className = 'strength-bar');
        strengthText.className = 'strength-text';

        if (value.length === 0) {
            strengthText.textContent = 'Fuerza de la contraseña';
            return;
        }

        let score = 0;
        if (value.length >= 6) score++;
        if (value.length >= 10) score++;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        let level, text;
        if (score <= 1) {
            level = 'weak';
            text = 'Débil';
        } else if (score <= 3) {
            level = 'medium';
            text = 'Media';
        } else {
            level = 'strong';
            text = 'Fuerte';
        }

        const activeBars = level === 'weak' ? 1 : level === 'medium' ? 2 : 4;
        for (let i = 0; i < activeBars; i++) {
            bars[i].classList.add(level);
        }

        strengthText.textContent = text;
        strengthText.classList.add(level);
    });

    // --- Validación y envío del formulario ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar validaciones previas
        form.querySelectorAll('.custom-input').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        const nombre = document.getElementById('nombre');
        const correo = document.getElementById('correo');
        const terminos = document.getElementById('terminos');
        let isValid = true;

        // Validar nombre
        if (!nombre.value.trim()) {
            nombre.classList.add('is-invalid');
            isValid = false;
        } else {
            nombre.classList.add('is-valid');
        }

        // Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.value)) {
            correo.classList.add('is-invalid');
            isValid = false;
        } else {
            correo.classList.add('is-valid');
        }

        // Validar contraseña
        if (passwordInput.value.length < 6) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            passwordInput.classList.add('is-valid');
        }

        // Validar confirmación
        if (confirmPasswordInput.value !== passwordInput.value || !confirmPasswordInput.value) {
            confirmPasswordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            confirmPasswordInput.classList.add('is-valid');
        }

        // Validar términos
        if (!terminos.checked) {
            terminos.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) {
            form.querySelector('.is-invalid')?.closest('.form-floating-custom, .custom-check')
                ?.classList.add('shake');
            setTimeout(() => {
                form.querySelectorAll('.shake').forEach(el => el.classList.remove('shake'));
            }, 500);
            return;
        }

        // Mostrar estado de carga
        const btnText = btnRegistrar.querySelector('.btn-text');
        const btnLoader = btnRegistrar.querySelector('.btn-loader');
        const btnArrow = btnRegistrar.querySelector('.btn-arrow');
        btnText.classList.add('d-none');
        btnArrow.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        btnRegistrar.disabled = true;

        // Preparar datos
        const userData = {
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            password: passwordInput.value
        };

        console.log('Datos de registro:', userData);

        // Simular envío (reemplazar con llamada real al servicio)
        try {
            // TODO: Conectar con el servicio real
            // const response = await registerService.register(userData);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Guardar nombre del usuario en localStorage para personalizar la siguiente vista
            localStorage.setItem('usuarioNombre', userData.nombre);
            localStorage.setItem('usuarioCorreo', userData.correo);

            // Redirigir al inicio de sesión
            window.location.href = '../index.html';

        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Hubo un error al registrar. Inténtalo de nuevo.');
        } finally {
            btnText.classList.remove('d-none');
            btnArrow.classList.remove('d-none');
            btnLoader.classList.add('d-none');
            btnRegistrar.disabled = false;
        }
    });

    // --- Limpiar validación al escribir ---
    form.querySelectorAll('.custom-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
        });
    });
});
