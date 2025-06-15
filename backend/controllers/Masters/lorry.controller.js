import Lorry from "../../models/Masters/Lorry.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AsyncHandler from "../../utils/AsyncHandler.js";

export const createLorry = AsyncHandler(async (req, res) => {
    const { lorryCode, lorryNumber } = req.body;

    if (!lorryCode || !lorryNumber) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if lorry code exists for this user
    const existingLorry = await Lorry.findOne({ 
        lorryCode, 
        createdBy: req.user._id 
    });

    if (existingLorry) {
        throw new ApiError(409, "Lorry with this code already exists for your account");
    }

    const lorry = await Lorry.create({
        lorryCode,
        lorryNumber,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, lorry, "Lorry created successfully")
    );
});

export const getAllLorries = AsyncHandler(async (req, res) => {
    // Only fetch lorries for the logged-in user
    const lorries = await Lorry.find({ createdBy: req.user._id });
    
    return res.status(200).json(
        new ApiResponse(200, lorries, "Lorries fetched successfully")
    );
});

export const getLorryById = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find lorry that belongs to the logged-in user
    const lorry = await Lorry.findOne({
        _id: id,
        createdBy: req.user._id
    });
    
    if (!lorry) {
        throw new ApiError(404, "Lorry not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, lorry, "Lorry fetched successfully")
    );
});

export const updateLorry = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lorryCode, lorryNumber } = req.body;

    // Find lorry that belongs to the logged-in user
    const lorry = await Lorry.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!lorry) {
        throw new ApiError(404, "Lorry not found or access denied");
    }

    // If lorry code is being changed, check it doesn't conflict with other lorries of this user
    if (lorryCode && lorryCode !== lorry.lorryCode) {
        const existingLorry = await Lorry.findOne({
            lorryCode,
            createdBy: req.user._id,
            _id: { $ne: id }
        });

        if (existingLorry) {
            throw new ApiError(409, "Lorry with this code already exists in your account");
        }
    }

    Object.assign(lorry, {
        lorryCode: lorryCode || lorry.lorryCode,
        lorryNumber: lorryNumber || lorry.lorryNumber
    });

    await lorry.save();

    return res.status(200).json(
        new ApiResponse(200, lorry, "Lorry updated successfully")
    );
});

export const deleteLorry = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find and delete lorry that belongs to the logged-in user
    const lorry = await Lorry.findOneAndDelete({
        _id: id,
        createdBy: req.user._id
    });
    
    if (!lorry) {
        throw new ApiError(404, "Lorry not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Lorry deleted successfully")
    );
});
