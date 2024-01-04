(function () {
    fetch('/api/current')
      .then((response) => response.json())
      .then((data) => {
        console.log(data,"data");
        const htmlText = `
        <p>Nombre: ${data.first_name}</p>
        <p>Apellido: ${data.last_name}</p>
        <p>Rol: ${data.role}</p>
        <p>Email: ${data.email}</p>`;
        const span = document.getElementById('profile-span');
        span.innerHTML = htmlText;
      })
      .catch((error) => {
        console.log('error', error);
      });
  })();
  