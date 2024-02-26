(function () {
  let cartId; // Declarar cartId fuera de la función fetch

  // Obtener el elemento del enlace del carrito
  var cartLink = document.getElementById('cart-link');

  // Obtener el valor del atributo data-cart-id
  var cartId1 = cartLink.getAttribute('data-cart-id');
  cartId = cartId1; // Asignar el valor de cartId1 a cartId

  // Mostrar el valor de cartId en la consola (solo para propósitos de demostración)
  console.log('El valor de cartId es:', cartId);

  function actualizarPerfil(data, cartId) {
    const htmlText = `
        <p>Nombre: ${data.first_name}</p>
        <p>Apellido: ${data.last_name}</p>
        <p>Rol: ${data.role}</p>
        <p>Email: ${data.email}</p>
        <p>Carrito: ${cartId}</p>`;
    const span = document.getElementById('profile-span');
    if (span) { // Verificar si el elemento con el id 'profile-span' existe
      span.innerHTML = htmlText;
    }
  }
  
  function obtenerDatosPerfil(cartId) {
    fetch('/api/current')
      .then((response) => response.json())
      .then((data) => {
        actualizarPerfil(data, cartId);
        
        console.log(cartId, "data2");

        // Actualizar el enlace "Ir al Carrito" con el nuevo cartId
        const cartLink = document.getElementById('cart-link');
        if (cartLink) { // Verificar si el elemento con el id 'cart-link' existe
          cartLink.href = `/api/carts/${cartId}`;
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  // Definir la función addToCart después de la función fetch
  function addToCart(productId, cartId) {
    // Verifica si cartId es válido antes de construir la URL
    if (!cartId) {
      console.error('El cartId no es válido');
      return;
    }

    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 1 }),
    })
      .then(response => {
        if (response.ok) {
          alert('Producto agregado al carrito');
          window.location.href = `/api/carts/${cartId}`;
        } else {
          alert('Error al agregar el producto al carrito');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar su solicitud con id');
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosPerfil(cartId);

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
      button.addEventListener('click', function (event) {
        const productId = event.target.dataset.code; // Obtener el ID del producto desde el botón
        console.log('productId', productId);
        console.log('cartId', cartId); // Verificar que el cartId es correcto
        addToCart(productId, cartId);
      });
    });
  });
})(); 