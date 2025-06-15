import Business from "../../models/Masters/Business.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AsyncHandler from "../../utils/AsyncHandler.js";

// Get all businesses for the logged-in user
export const getAllBusinesses = AsyncHandler(async (req, res) => {
    const businesses = await Business.find({ createdBy: req.user._id });
    res.status(200).json(new ApiResponse(200, businesses, "Businesses retrieved successfully"));
});

// Get a single business by ID
export const getBusinessById = AsyncHandler(async (req, res) => {
    const business = await Business.findOne({
        _id: req.params.id,
        createdBy: req.user._id
    });

    if (!business) {
        throw new ApiError(404, "Business not found or access denied");
    }

    res.status(200).json(new ApiResponse(200, business, "Business retrieved successfully"));
});

// Create a new business
export const createBusiness = AsyncHandler(async (req, res) => {
    const { code, name, address, city, pin, state, gstNum, panNum } = req.body;

    if (!code || !name || !address || !city || !pin || !state || !gstNum || !panNum) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if business code already exists for this user
    const existingBusiness = await Business.findOne({ 
        code, 
        createdBy: req.user._id 
    });

    if (existingBusiness) {
        throw new ApiError(409, "Business with this code already exists for your account");
    }

    const business = await Business.create({
        code,
        name,
        address,
        city,
        pin,
        state,
        gstNum,
        panNum,
        createdBy: req.user._id
    });

    res.status(201).json(new ApiResponse(201, business, "Business created successfully"));
});

// Update a business
export const updateBusiness = AsyncHandler(async (req, res) => {
    const businessId = req.params.id;
    const updates = req.body;
    
    // Ensure user can't update createdBy field
    delete updates.createdBy;

    // Check if business exists and belongs to user
    const existingBusiness = await Business.findOne({
        _id: businessId,
        createdBy: req.user._id
    });

    if (!existingBusiness) {
        throw new ApiError(404, "Business not found or access denied");
    }

    // If code is being updated, check it won't conflict with other businesses
    if (updates.code && updates.code !== existingBusiness.code) {
        const codeExists = await Business.findOne({
            code: updates.code,
            createdBy: req.user._id,
            _id: { $ne: businessId }
        });

        if (codeExists) {
            throw new ApiError(409, "Business with this code already exists");
        }
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
        businessId,
        updates,
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, updatedBusiness, "Business updated successfully"));
});

// Delete a business
export const deleteBusiness = AsyncHandler(async (req, res) => {
    const business = await Business.findOne({
        _id: req.params.id,
        createdBy: req.user._id
    });

    if (!business) {
        throw new ApiError(404, "Business not found or access denied");
    }

    await business.deleteOne();
    
    res.status(200).json(new ApiResponse(200, {}, "Business deleted successfully"));
});
