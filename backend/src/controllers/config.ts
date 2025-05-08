import { Request, Response, NextFunction } 
from 'express'; import { v4 as uuidv4 } from 
'uuid'; import Config from 
'../models/Config'; import logger from 
'../config/logger'; import { AppError } from 
'../middlewares/error';
// Save a scraper configuration
export const saveConfig = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try {
    // Ensure user is authenticated
    if (!req.user) { throw new 
      AppError('Authentication required', 
      401);
    }
    
    const { name, ...configData } = req.body;
    
    // Validate configuration name
    if (!name) { throw new 
      AppError('Configuration name is 
      required', 400);
    }
    
    // Check if configuration with the same 
    // name exists
    const existingConfig = await 
    Config.findOne({
      userId: req.user._id, name
    });
    
    if (existingConfig) {
      // Update existing configuration
      existingConfig.config = configData; 
      existingConfig.updatedAt = new Date(); 
      await existingConfig.save();
      
      return res.status(200).json({ message: 
        'Configuration updated successfully', 
        configId: existingConfig.configId
      });
    }
    
    // Create a new configuration
    const configId = uuidv4(); const 
    newConfig = await Config.create({
      configId, name, userId: req.user._id, 
      config: configData, createdAt: new 
      Date(), updatedAt: new Date()
    });
    
    res.status(201).json({ message: 
      'Configuration saved successfully', 
      configId: newConfig.configId
    });
  } catch (error) {
    next(error);
  }
};
// Get a specific configuration
export const getConfig = async (req: Request, 
res: Response, next: NextFunction) => {
  try { const { configId } = req.params;
    
    // Find the configuration
    const config = await Config.findOne({ 
    configId });
    
    if (!config) { throw new 
      AppError('Configuration not found', 
      404);
    }
    
    // Check if user has access
    if (config.userId.toString() !== 
    req.user?._id.toString() && 
    !config.isPublic) {
      throw new AppError('Access denied', 
      403);
    }
    
        res.status(200).json({ name: 
      config.name, ...config.config, 
      createdAt: config.createdAt, updatedAt: 
      config.updatedAt, isPublic: 
      config.isPublic
    });
  } catch (error) {
    next(error);
  }
};
// Get all user configurations
export const getUserConfigs = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try {
    // Ensure user is authenticated
    if (!req.user) { throw new 
      AppError('Authentication required', 
      401);
    }
    
    // Find all configurations for the user
    const configs = await Config.find({ 
    userId: req.user._id });
    
    // Return simplified list
    const configList = configs.map(config => 
    ({
      configId: config.configId, name: 
      config.name, url: config.config.url, 
      createdAt: config.createdAt, updatedAt: 
      config.updatedAt, isPublic: 
      config.isPublic
    }));
    
    res.status(200).json(configList);
  } catch (error) {
    next(error);
  }
};
// Delete a configuration
export const deleteConfig = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try { const { configId } = req.params;
    
    // Ensure user is authenticated
    if (!req.user) { throw new 
      AppError('Authentication required', 
      401);
    }
    
    // Find the configuration
    const config = await Config.findOne({ 
    configId });
    
    if (!config) { throw new 
      AppError('Configuration not found', 
      404);
    }
    
    // Check if user has access
    if (config.userId.toString() !== 
    req.user._id.toString()) {
      throw new AppError('Access denied', 
      403);
    }
    
    // Delete the configuration
    await Config.deleteOne({ configId });
    
    res.status(200).json({ message: 
      'Configuration deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
// Toggle public/private status
export const togglePublicStatus = async (req: 
Request, res: Response, next: NextFunction) 
=> {
  try { const { configId } = req.params;
    
    // Ensure user is authenticated
    if (!req.user) { throw new 
      AppError('Authentication required', 
      401);
    }
    
    // Find the configuration
    const config = await Config.findOne({ 
    configId });
    
    if (!config) { throw new 
      AppError('Configuration not found', 
      404);
    }
    
    // Check if user has access
    if (config.userId.toString() !== 
    req.user._id.toString()) {
      throw new AppError('Access denied', 
      403);
    }
    
    // Toggle public status
    config.isPublic = !config.isPublic; await 
    config.save();
    
    res.status(200).json({ message: 
      `Configuration is now ${config.isPublic 
      ? 'public' : 'private'}`, isPublic: 
      config.isPublic
    });
  } catch (error) {
    next(error);
  }
};
