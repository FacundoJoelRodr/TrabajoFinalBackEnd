(function () {
  let cartId; 
  var cartLink = document.getElementById('cart-link');

 
  var cartId1 = cartLink.getAttribute('data-cart-id');
  cartId = cartId1;

  console.log('El valor de cartId es:', cartId);

  function actualizarPerfil(data, cartId) {
    const htmlText = `
        <p>Nombre: ${data.first_name}</p>
        <p>Apellido: ${data.last_name}</p>
        <p>Rol: ${data.role}</p>
        <p>Email: ${data.email}</p>
        <p>Carrito: ${cartId}</p>`;
    const span = document.getElementById('profile-span');
    if (span) { 
      span.innerHTML = htmlText;
    }
  }
  
  function obtenerDatosPerfil(cartId) {
    fetch('/api/current')
      .then((response) => response.json())
      .then((data) => {
        actualizarPerfil(data, cartId);
        
        console.log(cartId, "data2");

        
        const cartLink = document.getElementById('cart-link');
        if (cartLink) { 
          cartLink.href = `/api/carts/${cartId}`;
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  function addToCart(productId, cartId) {
    const quantityInput = document.getElementById('quantity-' + productId);
    const quantity = parseInt(quantityInput.value); // Obtener la cantidad del campo de entrada
  
    if (!cartId) {
      console.error('El cartId no es válido');
      return;
    }
  
    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: quantity }), // Enviar la cantidad al servidor
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
        const productId = event.target.dataset.code; 
        console.log('productId', productId);
        console.log('cartId', cartId); 
        addToCart(productId, cartId);
      });
    });
  });
})(); 