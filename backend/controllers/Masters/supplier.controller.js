import { Supplier } from "../../models/Masters/Supplier.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AsyncHandler from "../../utils/AsyncHandler.js";

export const createSupplier = AsyncHandler(async (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        throw new ApiError(400, "All fields are required");
    }

    const supplier = await Supplier.create({
        name,
        address,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, supplier, "Supplier created successfully")
    );
});

export const getAllSuppliers = AsyncHandler(async (req, res) => {
    const suppliers = await Supplier.find();
    return res.status(200).json(
        new ApiResponse(200, suppliers, "Suppliers fetched successfully")
    );
});

export const getSupplierById = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(200, supplier, "Supplier fetched successfully")
    );
});

export const updateSupplier = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    Object.assign(supplier, {
        name: name || supplier.name,
        address: address || supplier.address
    });

    await supplier.save();

    return res.status(200).json(
        new ApiResponse(200, supplier, "Supplier updated successfully")
    );
});

export const deleteSupplier = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndDelete(id);
    
    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Supplier deleted successfully")
    );
});
