const express = require("express");
const app =express()
const PORT = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter =require("./routes/carts.router.js")

//Midelware
app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.use("/api", productsRouter)
app.use("/api/carts", cartsRouter)


//INICIO EL SERVIDOR

app.listen(PORT, ()=>{
  console.log(`Escuchando en http://localhost:${PORT}`);
})



























