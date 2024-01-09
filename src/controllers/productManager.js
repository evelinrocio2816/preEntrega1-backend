const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(newObject) {
    let { title, description, price, image, code, stock } = newObject;
    if ((!title || !description || !price || !image|| !code || !stock)) {
      console.log("Todos los campos deben ser completados");
      return;
    }
    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico, no debe repetirse");
      return;
    }
    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      image,
      code,
      stock,
    };
    this.products.push(newProduct);

    await this.saveFiles(this.products);
  }

  getProducts() {
    console.log(this.products);
  
  }



  async getProductsById(id) {
    try {
      const arrProducts = await this.readFiles();
      const buscado = arrProducts.find((item) => item.id === id);
      if (!buscado) {
        console.log("PRODUCTO NO ENCONTRADO!👎");
      } else {
        console.log("PRODUCTO ENCONTRADO 👍", buscado);
        return buscado;
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async readFiles() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const arrProducts = JSON.parse(res);
      return arrProducts;
    } catch (error) {
      console.log("Error al Leer el archivo", error);
    }
  }
  async saveFiles(arrProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrProducts, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }
  //Actualizo un producto

  async upDateProducts(id, productUpdated) {
    try {
      const arrProducts = await this.readFiles();
      const index = arrProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrProducts.splice(index, 1, productUpdated);
        await this.saveFiles(arrProducts);
      } else {
        console.log("No se encontro el ID a actualizar");
      }
    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }
  
  //Elimino el producto 
  async deleteProduct(id) {
    try {
      const arrProducts = await this.readFiles();
      const index = arrProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrProducts.splice(index, 1);
        await this.saveFiles(arrProducts);
        console.log("Producto eliminado correctamente");
      } else {
        console.log("No se encontró el producto a eliminar");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}



module.exports = ProductManager;