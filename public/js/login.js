(function () {
    document.getElementById('login-form').addEventListener('submit', (event) => {
      console.log('El archivo login.js se ha cargado correctamente');
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
        .then((data) => {
          alert("Login Successfully")
          window.location.href = '../../src/views/products.handlebars' 
          //localStorage.setItem('token', data.access_token);
        })
        .catch((error) => {
          console.log('error', error);
        });
    });
  });
  