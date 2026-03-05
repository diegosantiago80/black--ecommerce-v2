const form = document.getElementById('loginForm');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            window.location.replace('/products');
        } else {
            const err = await response.json();
            alert(err.error || 'Credenciales inválidas');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});
