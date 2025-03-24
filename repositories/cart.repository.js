export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getCarts = async () => {
    return await this.dao.getCarts();
  };
  getCartById = async (id) => {
    return await this.dao.getCartById(id);
  };
  createCart = async () => {
    return await this.dao.createCart();
  };
  addToCart = async (cartId, productId, quantity) => {
    return await this.dao.addToCart(cartId, productId, quantity);
  };
}
