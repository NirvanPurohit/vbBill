import Lorry from "../../models/Masters/Lorry.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AsyncHandler from "../../utils/AsyncHandler.js";

export const createLorry = AsyncHandler(async (req, res) => {
    const { lorryCode, lorryNumber } = req.body;

    if (!lorryCode || !lorryNumber) {
        throw new ApiError(400, "All fields are required");
    }

    const existingLorry = await Lorry.findOne({ lorryCode });
    if (existingLorry) {
        throw new ApiError(409, "Lorry with this code already exists");
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
    const lorries = await Lorry.find();
    return res.status(200).json(
        new ApiResponse(200, lorries, "Lorries fetched successfully")
    );
});

export const getLorryById = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const lorry = await Lorry.findById(id);
    
    if (!lorry) {
        throw new ApiError(404, "Lorry not found");
    }

    return res.status(200).json(
        new ApiResponse(200, lorry, "Lorry fetched successfully")
    );
});

export const updateLorry = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lorryCode, lorryNumber } = req.body;

    const lorry = await Lorry.findById(id);
    if (!lorry) {
        throw new ApiError(404, "Lorry not found");
    }

    if (lorryCode) {
        const existingLorry = await Lorry.findOne({ lorryCode, _id: { $ne: id } });
        if (existingLorry) {
            throw new ApiError(409, "Lorry with this code already exists");
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
    const lorry = await Lorry.findByIdAndDelete(id);
    
    if (!lorry) {
        throw new ApiError(404, "Lorry not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Lorry deleted successfully")
    );
});
