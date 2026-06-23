// Local Usuarios

if (!localStorage.getItem("usuarios")) {
  localStorage.setItem(
    "usuarios",
    JSON.stringify([
      {
        id: A1,
        usuario: "ClaraOrnella",
        email: "clari.ornella@gmail.com",
        password: "12345678",
        rol: "admin",
        estado: "activo",
      },
      {
        id: A2,
        usuario: "GeraldineLagarrigue",
        email: "lagarriguegeraldine@gmail.com",
        password: "12345678",
        rol: "admin",
        estado: "activo",
      },
      {
        id: C3,
        usuario: "Cliente1",
        email: "cliente1@gmail.com",
        password: "12345678",
        rol: "cliente",
        estado: "activo",
      },
      {
        id: C4,
        usuario: "Cliente2",
        email: "cliente2@gmail.com",
        password: "12345678",
        rol: "cliente",
        estado: "activo",
      },
      {
        id: C5,
        usuario: "Cliente3",
        email: "cliente3@gmail.com",
        password: "12345678",
        rol: "cliente",
        estado: "inactivo",
      },
    ]),
  );
}

//Local Compras

if (!localStorage.getItem("shop")) {
  localStorage.setItem(
    "shop",
    JSON.stringify({
        // Array carritos
      carts: {
        A1: {
            // Productos del carrito
          items: [
            {
              id: "book-1",
              title: "Una corte de rosas y espinas",
              author: "Sarah J. Maas",
              price: 25000,
              quantity: 2,
              img: "img-portadas/rosas.webp",
            },
            {
              id: "book-2",
              title: "El retrato de Dorian Gray",
              author: "Oscar Wilde",
              price: 32000,
              quantity: 1,
              img: "img-portadas/dorian.webp",
            },
          ],
        },

        C3: {
          items: [],
        },
      },

      orders: [
        {
          id: 1700000000000,
          userId: "1",
          items: [
            {
              id: "book-1",
              title: "Una corte de rosas y espinas",
              price: 25000,
              quantity: 2,
            },
          ],
          total: 50000,
          date: "2026-06-23",
        },
      ],
    }),
  );
}
