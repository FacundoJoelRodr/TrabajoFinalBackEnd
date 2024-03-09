(function () {
    document.getElementById('login-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log('error', error);
        });
    });
  });
  