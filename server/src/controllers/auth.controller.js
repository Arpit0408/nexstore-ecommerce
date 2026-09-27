import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered. Please login.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please login to continue.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const newAccessToken = user.generateAccessToken();

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error refreshing token',
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error logging out',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};
