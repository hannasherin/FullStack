
import Product from "../models/product.js";
export const createProduct = async (req, res) => {
  try {
    const { name, description, price ,category ,stock } = req.body;

    if(!name || !price || !category || !description){
      return res.status(400).json({message:"name,price,category are required"})
    }

    const product =new Product({
        name,
        description,
        price,
        category,
        stock,
        image:req.file?.filename || null
    })

    await product.save();

    res.status(201).json({success: true,message: "Product created successfully",product})
  } catch (error) {
    res.status(500).json({message: "internal server error"})
  }
}

export const getProducts=async (req,res)=>{
  try {
      const products=await Product.find()
      if(products.length===0){
        return res.status(400).json({message:'products empty'})
      }
      res.status(200).json({products})
  } catch (error) {
     res.status(500).json({message:"internal server error"})
  }
}