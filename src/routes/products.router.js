const express =require("express")
const router =  express.Router()
const fs = require('fs').promises;
const ProductManager = require("../controllers/productManager.js")
const productManager =new ProductManager(".src/models/productos.json")

//Router

//Agregar Productos
const products = [];


router.post("/products", (req, res) => {

    const newProduct = req.body;
  
   
    products.push(newProduct);
  
    console.log(products);
  
    res.send({ status: "success", message: "Producto Creado" });
  });


  
  // Ruta para actualizar un producto por su ID


router.put("/products/:pid", (req, res) => {
  try {
    const productIdToUpdate = parseInt(req.params.pid);

    // Busca el índice del producto a actualizar
    const indexToUpdate = products.findIndex((product) => product.id === productIdToUpdate);

    // Verifica si el producto con el pid indicado existe
    if (indexToUpdate === -1) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    // Obtiene los nuevos datos del producto desde el cuerpo de la solicitud
    const updatedProductData = req.body;

    // Actualiza los campos del producto sin cambiar el id
    const updatedProduct = { ...products[indexToUpdate], ...updatedProductData };

    // Actualiza el producto en el arreglo
    products[indexToUpdate] = updatedProduct;

    // Imprime en la consola el arreglo de productos después de la actualización
    console.log(products);
    res.json({ status: "success", message: "Producto Actualizado"});
  } catch (error) {
    console.error("Error al procesar la solicitud", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

// borrar un producto DELETE



router.delete("/products/:pid",  (req, res) => {
  const {id}= req.params;
  const productIndex=  products.findIndex(product => product.id === id)
  if(productIndex !== -1){
    products.splice(productIndex, 1)
    console.log(products);
    res.send({status: "success", message: "Producto eliminado"})

  }else{
   res.status(404).send({status: "error", mesagge: "Producto no encontrado"})
  }
})



  //Limit
  
  router.get("/products", async (req, res) => {
    try {
    const fileContent = await fs.readFile('./src/models/productos.json', 'utf-8');
      
      // Parsea el contenido del archivo a un array
      const myProducts = JSON.parse(fileContent);
  
      const limit = parseInt(req.query.limit);
  
      if (!isNaN(limit) && limit > 0) {
        // Si se proporciona un límite válido, devuelve los productos limitados
        const productos = myProducts.slice(0, limit);
        res.send(productos);
      } else {
        // Si no se proporciona un límite válido, devuelve todos los productos
        res.send(myProducts);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.send("Error interno del servidor");
    }
  });
  
  
  
  
  
  //busqueda por id
  
  const filePath = './src/models/productos.json';
  
  router.get("/products/:id", async (req, res) => {
    try {
      const idToFind = parseInt(req.params.id);
      
      if (isNaN(idToFind) || idToFind <= 0) {
        return res.status(400).json({ error: "ID de producto no válido" });
      }
  
      // Lee el contenido del archivo de productos
      const fileContent = await fs.readFile(filePath, 'utf-8');
  
      // Parseo el archivo a un array de productos
      const products = JSON.parse(fileContent);
  
      // Busca el producto por ID
      const foundProduct = products.find(product => product.id === idToFind);
  
      if (foundProduct) {
        res.json(foundProduct);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  module.exports= router;