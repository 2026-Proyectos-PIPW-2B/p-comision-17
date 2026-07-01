const usuariosIniciales = [
  {
    id: 1,
    usuario: "ClaraOrnella",
    email: "clari.ornella@gmail.com",
    password: "12345678",
    rol: "admin",
    estado: "activo",
  },
  {
    id: 2,
    usuario: "GeraldineLagarrigue",
    email: "lagarriguegeraldine@gmail.com",
    password: "12345678",
    rol: "admin",
    estado: "activo",
  },
  {
    id: 3,
    usuario: "Cliente1",
    email: "cliente1@gmail.com",
    password: "12345678",
    rol: "cliente",
    estado: "activo",
  },
  {
    id: 4,
    usuario: "Cliente2",
    email: "cliente2@gmail.com",
    password: "12345678",
    rol: "cliente",
    estado: "activo",
  },
  {
    id: 5,
    usuario: "Cliente3",
    email: "cliente3@gmail.com",
    password: "12345678",
    rol: "cliente",
    estado: "inactivo",
  },
];

const stockInicial = [
  {
    id: 1,
    titulo: "Una corte de rosas y espinas",
    autor: "Sarah J. Maas",
    categoria: ["Juvenil"],
    formato: ["Tapa blanda"],
    tipo: "Nuevo",
    precio: 60000,
    stock: 5,
    imagen: "img-portadas/Una corte de rosas y espinas.webp",
  },
  {
    id: 2,
    titulo: "Alchemised",
    autor: "SenLiYu",
    categoria: ["Juvenil"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 70000,
    stock: 8,
    imagen: "img-portadas/Alchemised.webp",
  },
  {
    id: 3,
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    categoria: ["Clásico"],
    formato: ["Tapa blanda"],
    tipo: "Usado",
    precio: 80000,
    stock: 12,
    imagen: "img-portadas/Orgullo y prejuicio.webp",
  },
  {
    id: 4,
    titulo: "El brillo de las luciérnagas",
    autor: "Paul Pen",
    categoria: ["Terror"],
    formato: ["Ebook"],
    tipo: "Digital",
    precio: 40000,
    stock: 3,
    imagen: "img-portadas/El brillo de las luciérnagas.webp",
  },
  {
    id: 5,
    titulo: "La vida invisible de Addie Larue",
    autor: "V. E. Schwab ",
    categoria: ["Juvenil"],
    formato: ["Ebook"],
    tipo: "Digital",
    precio: 30000,
    stock: 13,
    imagen: "img-portadas/la vida invisible de Addie Larue.webp",
  },
  {
    id: 6,
    titulo: "Don quijote de la mancha",
    autor: "V. E. Schwab ",
    categoria: ["Clásico"],
    formato: ["Tapa dura"],
    tipo: "Usado",
    precio: 40000,
    stock: 3,
    imagen: "img-portadas/Don quijote de la mancha.webp",
  },
  {
    id: 7,
    titulo: "Harry Potter y la piedra filosofal",
    autor: "J. K. Rowling ",
    categoria: ["Importado"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 70000,
    stock: 7,
    imagen: "img-portadas/Harry Potter y la piedra filosofal.webp",
  },
  {
    id: 8,
    titulo: "Pack Jane Austen",
    autor: "Jane Austen",
    categoria: ["Packs"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 80000,
    stock: 7,
    imagen: "img-portadas/Pack Jane Austen.webp",
  },
  {
    id: 9,
    titulo: "Madame Bovary",
    autor: "Gustave Flaubert",
    categoria: ["Clásico"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 40000,
    stock: 6,
    imagen: "img-portadas/Madame Bovary.webp",
  },
  {
    id: 10,
    titulo: "Gaturro y el misterio de las cinco Agathas",
    autor: "Nik",
    categoria: ["Infantil"],
    formato: ["Tapa blanda"],
    tipo: "Nuevo",
    precio: 20000,
    stock: 12,
    imagen: "img-portadas/Gaturro y el misterio de las cinco Agathas.webp",
  },
  {
    id: 11,
    titulo: "Princesas Disney:pop-up",
    autor: "Disney",
    categoria: ["Infantil", "Importado"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 80000,
    stock: 7,
    imagen: "img-portadas/Princesas Disney pop up.webp",
  },
  {
    id: 12,
    titulo: "Stranger Things:pop-up",
    autor: "Simon Arizpe",
    categoria: ["Importado"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 90000,
    stock: 7,
    imagen: "img-portadas/Stranger Things pop up.webp",
  },
  {
    id: 13,
    titulo: "Harry Potter y el prisionero de Azkaban",
    autor: "J. K. Rowling",
    categoria: ["Importado"],
    formato: ["Tapa dura"],
    tipo: "Nuevo",
    precio: 70000,
    stock: 7,
    imagen: "img-portadas/Harry Potter y el prisionero de Azkaban.webp",
  },
  {
    id: 14,
    titulo: "Cuentos macabros",
    autor: "Edgar Allan Poe",
    categoria: ["Terror", "Clásico"],
    formato: ["Tapa blanda"],
    tipo: "Usado",
    precio: 40000,
    stock: 3,
    imagen: "img-portadas/Cuentos macabros.webp",
  },
  {
    id: 15,
    titulo: "La Odisea",
    autor: "Homero",
    categoria: ["Clásico"],
    formato: ["Tapa blanda"],
    tipo: "Usado",
    precio: 40000,
    stock: 3,
    imagen: "img-portadas/La Odisea.webp",
  },
  {
    id: 16,
    titulo: "A pesar de ti",
    autor: "Collen Hoover",
    categoria: ["Juvenil"],
    formato: ["Ebook"],
    tipo: "Digital",
    precio: 30000,
    stock: 3,
    imagen: "img-portadas/A pesar de ti.webp",
  },
  {
    id: 17,
    titulo: "Cementerio de animales",
    autor: "Stephen King",
    categoria: ["Terror"],
    formato: ["Ebook"],
    tipo: "Digital",
    precio: 40000,
    stock: 3,
    imagen: "img-portadas/Cementerio de animales.webp",
  },
];

const categoriasIniciales = [
  {
    id: 1,
    nombre: "Recomendados",
    descripcion: "",
    estado: "Activa",
    tipoIndex: "recomendados",
  },
  {
    id: 2,
    nombre: "Novedades",
    descripcion: "",
    estado: "Activa",
    tipoIndex: "novedades",
  },
  {
    id: 3,
    nombre: "Importados más vendidos",
    descripcion: "",
    estado: "Activa",
    tipoIndex: "importados",
  },
];

const destacadosIniciales = {
  recomendados: [1, 2, 8, 9],
  novedades: [2, 6, 5, 4],
  importados: [7,11,12,13],
};

const shopInicial = {
  carts: {},
  orders: [],
  userOrders: {},
};

function inicializarDatos() {
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
  }

  if (!localStorage.getItem("librarium_stock")) {
    localStorage.setItem("librarium_stock", JSON.stringify(stockInicial));
  }

  if (!localStorage.getItem("librarium_categorias")) {
    localStorage.setItem(
      "librarium_categorias",
      JSON.stringify(categoriasIniciales),
    );
  }

  if (!localStorage.getItem("shop")) {
    localStorage.setItem("shop", JSON.stringify(shopInicial));
  }

  if (!localStorage.getItem("librarium_destacados")) {
    localStorage.setItem(
      "librarium_destacados",
      JSON.stringify(destacadosIniciales),
    );
  }
}

function restaurarDatos() {
  localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
  localStorage.setItem("shop", JSON.stringify(shopInicial));
  localStorage.setItem("librarium_stock", JSON.stringify(stockInicial));
  localStorage.setItem(
    "librarium_categorias",
    JSON.stringify(categoriasIniciales),
  );
  localStorage.setItem(
    "librarium_destacados",
    JSON.stringify(destacadosIniciales),
  );

  localStorage.removeItem("UsuarioLoggeado");
}

inicializarDatos();
