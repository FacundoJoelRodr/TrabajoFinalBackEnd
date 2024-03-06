(function () {
  // Función para eliminar un producto del carrito
  let cart 
  async function removeProductFromCart(cartId, productId, quantity) {
    try {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Actualizar la interfaz de usuario según sea necesario
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error.message);
    }
  }

  // Función para eliminar todo el carrito
  async function removeAllProductsFromCart(cart) {
    console.log(cart,"cartremove");
    try {
      const response = await fetch(`/api/carts/${cart}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      location.reload()
      // Actualizar la interfaz de usuario según sea necesario
    } catch (error) {
      console.error('Error al eliminar todo el carrito:', error.message);
    }
  }

  // Asignar manejadores de eventos a los botones en la interfaz de usuario
  document.addEventListener('DOMContentLoaded', function () {

    const cartLink = document.getElementById('cart-link');
    const cartId = cartLink.getAttribute('data-cart-id');
    cart = cartId

    const removeQuantityButtons = document.querySelectorAll(
      '.remove-quantity-button'
    );
    const removeAllButton = document.getElementById('remove-all-button');

    removeQuantityButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        const productId = event.target.dataset.productId;
        console.log(productId,"product");
        const quantity = event.target.parentElement.querySelector('.quantity-input').value;

        removeProductFromCart(cart, productId, quantity);
      });
    });

    if (removeAllButton) {
      removeAllButton.addEventListener('click', function (event) {
        
        removeAllProductsFromCart(cart);
      });
    }
  });
})();
