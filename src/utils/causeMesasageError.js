export const generatorUserError = () => {
    return `todos los campos son requeridos y deben ser valido. Listado de campos recibidos en la solicitud
    -first_name: ${user.first_name}
    -last_name: ${user.last_name}
    -email: ${user.email}
    -age : ${user.age} 
    -password: ${user.password} 
    `;
  };
  
  export const generatorProductError = () => {
    return `todos los campos son requeridos y deben ser valido. Listado de campos recibidos en la solicitud
    -title: ${product.title}
    -code: ${product.code}
    -price: ${product.price}
    -stock : ${product.stock} 
    -description: ${product.description} 
    `;
  };
  