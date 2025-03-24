import ProductDTO from "../daos/dto/product.dto.js"

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAllProducts = async () => {
    return await this.dao.getAllProducts();
  };

  getProductById = async (productId) => {
    return await this.dao.getProductById(productId);
  };

  createProduct = async (product) => {
    const productData = new ProductDTO(product);
    return await this.dao.createProduct(productData);
  };

  updateProduct = async (productId, product) => {
    const updatedData = new ProductDTO(product);
    return await this.dao.updateProduct(productId, updatedData);
  };

  deleteProduct = async (productId) => {
    return await this.dao.deleteProduct(productId);
  };
}
