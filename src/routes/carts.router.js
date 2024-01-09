const express = require("express");
const router = express.Router();

const CartsManager = require("../controllers/cartsManager.js");
const cartsManager = new CartsManager("./src/models/carts.json");


//Routes
//lista de productos de cada carrito

router.get("/:cid", async(req,res)=>{
  const cartsId= parseInt(req.params.cid)
  try {
    const cart = await cartsManager.getCartById(cartsId)
    res.json(cart.products)
    if(!cart){
      res.json(cart.products)
    }else{
      res.json({message: "El ID de carrito es invalido"})
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({error: "error interno del servidor"})
  }
})


//agregar productos al carrito
router.post("/:cid/product/:pid", async(req, res)=>{
 const cartId= parseInt(req.params.cid)
 const productId = req.params.pid;
 const quantity = req.body.quantity || 1

 try {
   const updateCart = await cartsManager.productsAddToCarts(cartId, productId,quantity)
   res.json(updateCart.products)
 } catch (error) {
  console.error("Error al actualizar el carrito", error)
  res.status(500).json({error: "error interno del servidor"})
 }
})

// Ruta para crear un nuevo carrito

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.json(newCart);
    console.log(newCart)
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.json({ error: "Error del servidor" });
  }
});

module.exports = router;