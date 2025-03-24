import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema(
	{
		title: {
			index: { name: "idx_title" },
			type: String,
			required: [true, "The name is mandatory"],
			uppercase: true,
			trim: true,
			minLength: [3, "The name must be at least 3 characters"],
			maxLength: [25, "The name must have a maximum of 25 characters"],
		},
		description: {
			type: String,
			required: [true, "Category is mandatory"],
			uppercase: true,
			maxLength: [250, "The description must have a maximum of 250 characters"],
		},
		category: {
			type: String,
			required: [true, "Category is mandatory"],
			uppercase: true,
			trim: true,
			minLength: [3, "Category must be at least 3 characters"],
			maxLength: [10, "The category must have a maximum of 10 characters"],
		},
		stock: {
			type: Number,
			required: [true, "Stock is mandatory"],
			min: [0, "Stock must be a positive value"],
		},
		price: {
			type: Number,
			required: [true, "Stock is mandatory"],
			min: [0, "Stock must be a positive value"],
		},
		availability: {
			type: Boolean,
			required: [true, "Availability is mandatory"],
		},
		thumbnail: {
			type: String,
			trim: true,
		},
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

productSchema.pre("save", function (next) {
	if (!this.thumbnail) {
		this.thumbnail = "ImagenUnavailable.jpg";
	}
	next();
});

productSchema.pre("findByIdAndDelete", async function (next) {
	const CartModel = this.model("carts");
	await CartModel.updateMany(
		{ "products.product": this._id },
		{ $pull: { products: { product: this._id } } }
	);
	next();
});
productSchema.plugin(paginate);
const ProductModel = model("products", productSchema);
export default ProductModel;
