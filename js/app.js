// funcionalidad del carrito
const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonVaciar = document.getElementById('vaciar-carrito');
const compra2 = document.getElementById('compra2');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito(); // Cargar el carrito desde el almacenamiento local
  actualizarCarrito();
});

botonVaciar.addEventListener('click', () => {
  vaciarCarrito();
});

compra2.addEventListener('click', () => {
  if (carrito.length === 1) {
    alert("Su compra está en proceso");
  } else {
    vaciarCarrito();
  }
  location.replace('https://api.whatsapp.com/send?phone=573043277960&text=Hola!%20Feliz%20d%C3%ADa%2C%20deseo%20informaci%C3%B3n%20sobre%20los%20productos%20que%20ofrecen');
  actualizarCarrito();
});

stockProductos.forEach((producto) => {
  const div = document.createElement('div');
  div.classList.add('producto');
  div.innerHTML = `
    <img src=${producto.img} alt="">
    <h3>${producto.nombre}</h3>
    <p>${producto.desc}</p>
    <p class="precioProducto">Precio: $ ${producto.precio.toLocaleString('es-CO')} ${producto.peso}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
  `;
  contenedorProductos.appendChild(div);

  const boton = document.getElementById(`agregar${producto.id}`);

  boton.addEventListener('click', () => {
    agregarAlCarrito(producto.id);
  });
});

const cargarCarrito = () => {
  const carritoString = localStorage.getItem('carrito');
  carrito = JSON.parse(carritoString) ?? [];
};
const inicializarCarrito = () => {
  cargarCarrito();
  actualizarCarrito();
};

document.addEventListener('DOMContentLoaded', inicializarCarrito);


const guardarCarrito = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

const agregarAlCarrito = (prodId) => {
  const existe = carrito.some((prod) => prod.id === prodId);

  if (existe) {
    carrito = carrito.map((prod) => {
      if (prod.id === prodId) {
        prod.cantidad++;
      }
      return prod;
    });
  } else {
    const item = stockProductos.find((prod) => prod.id === prodId);
    item.cantidad = 1;
    carrito.push(item);
  }

  guardarCarrito();
  actualizarCarrito();
};

const eliminarDelCarrito = (prodId) => {
  carrito = carrito.filter((prod) => prod.id !== prodId);
  guardarCarrito();
  actualizarCarrito();
};

const vaciarCarrito = () => {
  carrito = [];
  localStorage.removeItem('carrito');
  actualizarCarrito();
};

const actualizarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = "No tiene productos en el carrito.";
    contenedorCarrito.appendChild(mensaje);
  } else {
    carrito.forEach((prod) => {
      const div = document.createElement('div');
      div.className = 'productoEnCarrito';
      div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio: $ ${prod.precio.toLocaleString('es-CO')} COP</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar">-<i class="fas fa-trash-alt"></i></button>
        <button onclick="agregarAlCarrito(${prod.id})" class="boton-mas">+<i class="fas fa-shopping-cart"></i></button>
      `;
      contenedorCarrito.appendChild(div);
    });
  }
    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = ` ${carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0).toLocaleString('es-CO')} COP`;
  
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  const buscarProducto = (termino) => {
    const resultado = stockProductos.filter((producto) => {
      const nombre = producto.nombre.toLowerCase();
      const terminoMinuscula = termino.toLowerCase();
      return nombre.includes(terminoMinuscula);
    });
  
    return resultado;
  };
  
  const mostrarResultadoBusqueda = (resultados) => {
    contenedorProductos.innerHTML = "";
  
    if (resultados.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.textContent = "No se encontraron productos.";
      contenedorProductos.appendChild(mensaje);
    } else {
      resultados.forEach((producto) => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
          <img src=${producto.img} alt="">
          <h3>${producto.nombre}</h3>
          <p>${producto.desc}</p>
          <p class="precioProducto">Precio: $ ${producto.precio.toLocaleString('es-CO')} ${producto.peso}</p>
          <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
        `;
        contenedorProductos.appendChild(div);
  
        const boton = document.getElementById(`agregar${producto.id}`);
  
        boton.addEventListener('click', () => {
          agregarAlCarrito(producto.id);
        });
  
        boton.addEventListener('keyup', (event) => {
          if (event.key === "Enter") {
            agregarAlCarrito(producto.id);
          }
        });
      });
    }
  };
  
  const inputBusqueda = document.getElementById('searchbar');
  
  inputBusqueda.addEventListener('keyup', () => {
    const terminoBusqueda = inputBusqueda.value.trim();
    const resultados = buscarProducto(terminoBusqueda);
    mostrarResultadoBusqueda(resultados);
  });
  