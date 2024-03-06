
(function () {
  let cartId;
  let datosU;
  const cartLink = document.getElementById('cart-link');
  const cartId1 = cartLink.getAttribute('data-cart-id');
  cartId = cartId1;

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
    datosU = data; // Guardar los datos del usuario para su posterior uso
  }

  function obtenerDatosPerfil(cartId) {
    fetch('/api/current')
      .then((response) => response.json())
      .then((data) => {
        actualizarPerfil(data, cartId);
        const cartLink = document.getElementById('cart-link');
        if (cartLink) {
          cartLink.href = `/api/carts/${cartId}`;
        }
        console.log(datosU.id, "datosU");
        if (datosU.role === 'PREMIUM' || datosU.role === 'ADMIN') {
          const addProductLink = document.getElementById('product-link');
          if (addProductLink) {
            addProductLink.addEventListener('click', function (event) {
              const newProductForm =
                document.getElementById('new-product-form');
              if (newProductForm) {
                newProductForm.style.display = 'block';
              }
              event.preventDefault();
            });
          }
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  function addToCart(productId, cartId) {
    const quantityInput = document.getElementById('quantity-' + productId);
    const quantity = parseInt(quantityInput.value);

    if (!cartId) {
      console.error('El cartId no es válido');
      return;
    }

    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: quantity }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Producto agregado al carrito');
          window.location.href = `/api/carts/${cartId}`;
        } else {
          alert('Error al agregar el producto al carrito');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al procesar su solicitud con id');
      });
  }

  function addProduct(data) {
    fetch(`/api/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert('Producto agregado');
          location.reload()
        } else {
          alert('Error al agregar el producto al carrito');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al procesar su solicitud');
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosPerfil(cartId);

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        const productId = event.target.dataset.code;
        addToCart(productId, cartId);
      });
    });

    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
      addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = {
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
          category: document.getElementById('category').value,
          price: document.getElementById('price').value,
          stock: document.getElementById('stock').value,
          owner: datosU.email
        };
        addProduct(formData);
      });
    }
  });
})();
