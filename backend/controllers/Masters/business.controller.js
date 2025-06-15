import Business from "../../models/Masters/Business.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AsyncHandler from "../../utils/AsyncHandler.js";

export const createBusiness = AsyncHandler(async (req, res) => {
    const { code, name, address, city, pin, state, gstNum, type, panAadhar } = req.body;

    if (!code || !name || !address || !city || !pin || !state || !gstNum || !type || !panAadhar) {
        throw new ApiError(400, "All fields are required");
    }

    const existingBusiness = await Business.findOne({ code });
    if (existingBusiness) {
        throw new ApiError(409, "Business with this code already exists");
    }

    const business = await Business.create({
        code,
        name,
        address,
        city,
        pin,
        state,
        gstNum,
        type,
        panAadhar,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, business, "Business created successfully")
    );
});

export const getAllBusinesses = AsyncHandler(async (req, res) => {
    const businesses = await Business.find();
    return res.status(200).json(
        new ApiResponse(200, businesses, "Businesses fetched successfully")
    );
});

export const getBusinessById = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);
    
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    return res.status(200).json(
        new ApiResponse(200, business, "Business fetched successfully")
    );
});

export const updateBusiness = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { code, name, address, city, pin, state, gstNum, type, panAadhar } = req.body;

    const business = await Business.findById(id);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    if (code) {
        const existingBusiness = await Business.findOne({ code, _id: { $ne: id } });
        if (existingBusiness) {
            throw new ApiError(409, "Business with this code already exists");
        }
    }

    Object.assign(business, {
        code: code || business.code,
        name: name || business.name,
        address: address || business.address,
        city: city || business.city,
        pin: pin || business.pin,
        state: state || business.state,
        gstNum: gstNum || business.gstNum,
        type: type || business.type,
        panAadhar: panAadhar || business.panAadhar
    });

    await business.save();

    return res.status(200).json(
        new ApiResponse(200, business, "Business updated successfully")
    );
});

export const deleteBusiness = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndDelete(id);
    
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Business deleted successfully")
    );
});
