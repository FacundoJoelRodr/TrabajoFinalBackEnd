(function (){
    function actualizarPerfil(data) {
        const htmlText = `
            <p>Nombre: ${data.first_name}</p>
            <p>Apellido: ${data.last_name}</p>
            <p>Rol: ${data.role}</p>
            <p>Email: ${data.email}</p>
            <p>Carrito: ${data.carts}</p>`;
        const span = document.getElementById('profile-span');
        span.innerHTML = htmlText;
      }
      
      fetch('/api/current')
        .then((response) => response.json())
        .then((data) => {
          actualizarPerfil(data);
          cartId = data.carts;
      
          // Actualizar el enlace "Ir al Carrito" con el nuevo cartId
         // const cartLink = document.getElementById('cart-link');
         // cartLink.href = `/api/carts/${cartId}`;
        })
        .catch((error) => {
          console.log('error', error);
        });

})()