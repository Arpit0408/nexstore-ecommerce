import Product from '../models/product.model.js';
import imagekit from '../config/imagekit.js';

const uploadToImageKit = async (file) => {
  if (!imagekit) return { url: '', fileId: '' };

  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: `prod_${Date.now()}_${file.originalname}`,
      folder: '/nexstore/products',
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error.message);
    return { url: '', fileId: '' };
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;

    let imageUrl = '';
    let imageId = '';

    if (req.file) {
      const uploadResult = await uploadToImageKit(req.file);
      imageUrl = uploadResult.url;
      imageId = uploadResult.fileId;
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      category: category || 'General',
      imageUrl,
      imageId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products',
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { title, description, price, stock, category } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;

    if (req.file) {
      if (product.imageId && imagekit) {
        try {
          await imagekit.deleteFile(product.imageId);
        } catch (err) {
          console.warn('Could not delete old image from ImageKit:', err.message);
        }
      }
      const uploadResult = await uploadToImageKit(req.file);
      product.imageUrl = uploadResult.url;
      product.imageId = uploadResult.fileId;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.imageId && imagekit) {
      try {
        await imagekit.deleteFile(product.imageId);
      } catch (err) {
        console.warn('Could not delete image from ImageKit:', err.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};
