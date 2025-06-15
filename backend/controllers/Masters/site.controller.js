import Site from "../../models/Masters/Site.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AsyncHandler from "../../utils/AsyncHandler.js";

export const createSite = AsyncHandler(async (req, res) => {
    const { siteCode, siteName, siteAddress, city, pin, state, gstNum } = req.body;

    if (!siteCode || !siteName || !siteAddress || !city || !pin || !state || !gstNum) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if site code exists for this user
    const existingSite = await Site.findOne({ 
        siteCode, 
        createdBy: req.user._id 
    });

    if (existingSite) {
        throw new ApiError(409, "Site with this code already exists in your account");
    }

    const site = await Site.create({
        siteCode,
        siteName,
        siteAddress,
        city,
        pin,
        state,
        gstNum,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, site, "Site created successfully")
    );
});

export const getAllSites = AsyncHandler(async (req, res) => {
    // Only fetch sites for the logged-in user
    const sites = await Site.find({ createdBy: req.user._id });
    
    return res.status(200).json(
        new ApiResponse(200, sites, "Sites fetched successfully")
    );
});

export const getSiteById = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find site that belongs to the logged-in user
    const site = await Site.findOne({
        _id: id,
        createdBy: req.user._id
    });
    
    if (!site) {
        throw new ApiError(404, "Site not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, site, "Site fetched successfully")
    );
});

export const updateSite = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { siteCode, siteName, siteAddress, city, pin, state, gstNum } = req.body;

    // Find site that belongs to the logged-in user
    const site = await Site.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!site) {
        throw new ApiError(404, "Site not found or access denied");
    }

    // If site code is being changed, check it doesn't conflict with other sites of this user
    if (siteCode && siteCode !== site.siteCode) {
        const existingSite = await Site.findOne({
            siteCode,
            createdBy: req.user._id,
            _id: { $ne: id }
        });

        if (existingSite) {
            throw new ApiError(409, "Site with this code already exists in your account");
        }
    }

    Object.assign(site, {
        siteCode: siteCode || site.siteCode,
        siteName: siteName || site.siteName,
        siteAddress: siteAddress || site.siteAddress,
        city: city || site.city,
        pin: pin || site.pin,
        state: state || site.state,
        gstNum: gstNum || site.gstNum
    });

    await site.save();

    return res.status(200).json(
        new ApiResponse(200, site, "Site updated successfully")
    );
});

export const deleteSite = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find and delete site that belongs to the logged-in user
    const site = await Site.findOneAndDelete({
        _id: id,
        createdBy: req.user._id
    });
    
    if (!site) {
        throw new ApiError(404, "Site not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Site deleted successfully")
    );
});
