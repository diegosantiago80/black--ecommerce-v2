const form = document.getElementById('registerForm');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            window.location.replace('/login');
        } else {
            const err = await response.json();
            alert(err.error || 'Error al registrarse');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});
