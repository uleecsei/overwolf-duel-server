document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Convert form data to JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const responseData = await response.json();
            localStorage.setItem('token', responseData.token);
            location.href = '/discord-page';
        } else {
            response.json().then(data => alert(data.message));
        }
    } catch (error) {
        console.error('Error:', error);
    }
});