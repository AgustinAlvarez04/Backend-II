import mongoose from "mongoose";
import FileHandler from "../../../utils/fileHandler.js";
import paths from "../../../utils/paths.js";

import ErrorManager from "../../error.manager.js";
import ProductModel from "../models/product.model.js";

import { convertToBoolean } from "../../../utils/converter.js";

export default class ProductDAO {
  #productModel;
  #fileHandler;

  constructor() {
    this.#productModel = ProductModel;
    this.#fileHandler = new FileHandler();
  }

  // Obtiene todos los productos con opciones de paginación //
  getAllProducts = async (paramFilters) => {
    try {
      const $and = [];
      if (paramFilters?.title)
        $and.push({ title: { $regex: paramFilters.title, $options: "i" } });
      if (paramFilters?.category)
        $and.push({ category: paramFilters.category });
      if (paramFilters?.availability)
        $and.push({
          availability: convertToBoolean(paramFilters.availability),
        });
      const filters = $and.length > 0 ? { $and } : {};
      const sort = {
        asc: { title: 1 },
        desc: { title: -1 },
      };
      const paginationOptions = {
        limit: paramFilters?.limit ?? 4,
        page: paramFilters?.page ?? 1,
        sort: sort[paramFilters?.sort] ?? {},
        lean: true,
      };
      const productsFound = await this.#productModel.paginate(
        filters,
        paginationOptions
      );
      return productsFound;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  };

  getProductById = async (id) => {
    try {
      const productFound = await this.#productModel.findById(id).lean();
      if (!productFound) {
        throw new ErrorManager("ID not found", 404);
      }
      return productFound;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  };

  createProduct = async (data, filename) => {
    try {
      const productCreated = new ProductModel(data);
      productCreated.availability = convertToBoolean(data.availability);
      productCreated.thumbnail = filename ?? null;
      await productCreated.save();
      return productCreated;
    } catch (error) {
      if (filename) await this.#fileHandler.delete(paths.images, filename);
      if (error instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(error.errors)[0];
      }
      throw new Error(error.message);
    }
  };

  updateProduct = async (id, data, filename) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new ErrorManager("Invalid ID", 400);
      }
      const productFound = await this.#productModel.findById(id);
      const currentThumbnail = productFound.thumbnail;
      const newThumbnail = filename;
      if (!productFound) {
        throw new ErrorManager("ID not found", 404);
      }
      productFound.title = data.tile;
      productFound.description = data.description;
      productFound.price = data.price;
      productFound.availability = convertToBoolean(data.availability);
      productFound.category = data.category;
      productFound.stock = data.stock;
      productFound.thumbnail = newThumbnail ?? currentThumbnail;
      await productFound.save();
      if (filename && newThumbnail != currentThumbnail) {
        await this.#fileHandler.delete(paths.images, currentThumbnail);
      }
      return productFound;
    } catch (error) {
      if (filename) await this.#fileHandler.delete(paths.images, filename);
      if (error instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(error.errors)[0];
      }
      throw new Error(error.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new ErrorManager("Invalid ID", 400);
      }
      const productFound = await this.#productModel.findById(id);
      if (!productFound) {
        throw new ErrorManager("ID not found", 404);
      }
      await this.#productModel.findByIdAndDelete(id);
      await this.#fileHandler.delete(paths.images, productFound.thumbnail);
      return productFound;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  };
}
