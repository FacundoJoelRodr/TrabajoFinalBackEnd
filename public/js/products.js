(function (){
    document.addEventListener('DOMContentLoaded', function() {
        const addToCartButtons = document.querySelectorAll('.btn-primary');
        
        addToCartButtons.forEach(button => {
          button.addEventListener('click', function(event) {
            const productId = event.target.dataset.code; // Obtener el ID del producto desde el botón
            addToCart(productId);
          });
        });
      
        function addToCart(productId) {
          fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'PUT', // Ajusta el método HTTP según tu implementación
            headers: {
              'Content-Type': 'application/json',
            },
            // Puedes enviar más información si es necesario en el cuerpo de la solicitud
            body: JSON.stringify({ quantity: 1 }), // Aquí asumimos que siempre se agrega un producto con una cantidad de 1
          })
          .then(response => {
            if (response.ok) {
              // Producto agregado exitosamente al carrito, puedes mostrar un mensaje o actualizar la página
              alert('Producto agregado al carrito');
              // Aquí puedes hacer alguna acción adicional si es necesario, como redirigir al usuario al carrito
              window.location.href = `/api/carts/${cartId}`;
            } else {
              // Manejar errores si la solicitud no se completó correctamente
              alert('Error al agregar el producto al carrito');
            }
          })
          .catch(error => {
            // Manejar errores de red u otros errores
            console.error('Error:', error);
            alert('Hubo un error al procesar su solicitud');
          });
        }
      });
})()