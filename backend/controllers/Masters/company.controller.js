import Company from '../../models/Masters/company.model.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/AsyncHandler.js';

// Create Company - user-specific
const createCompany = asyncHandler(async (req, res) => {
  const existingCompany = await Company.findOne({
    companyCode: req.body.companyCode,
    createdBy: req.user._id
  });

  if (existingCompany) {
    throw new ApiError(400, 'Company code already exists for this user');
  }

  const companyData = {
    ...req.body,
    createdBy: req.user._id
  };

  const savedCompany = await Company.create(companyData);
  res.status(201).json(new ApiResponse(201, savedCompany, 'Company created successfully'));
});

// Get all companies for the logged-in user
const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ createdBy: req.user._id });

  if (!companies || companies.length === 0) {
    throw new ApiError(404, 'No companies found for this user');
  }

  res.status(200).json(new ApiResponse(200, companies, 'All companies fetched successfully'));
});

// Get one company (user must own it)
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!company) {
    throw new ApiError(404, 'Company not found for this user');
  }

  res.status(200).json(new ApiResponse(200, company, 'Company fetched successfully'));
});

// Update a company (only if owned by user)
const updateCompany = asyncHandler(async (req, res) => {
  const updatedCompany = await Company.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedCompany) {
    throw new ApiError(404, 'Company not found or unauthorized');
  }

  res.status(200).json(new ApiResponse(200, updatedCompany, 'Company updated successfully'));
});

// Delete a company (only if owned by user)
const deleteCompany = asyncHandler(async (req, res) => {
  const deletedCompany = await Company.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!deletedCompany) {
    throw new ApiError(404, 'Company not found or unauthorized');
  }

  res.status(200).json(new ApiResponse(200, null, 'Company deleted successfully'));
});

export {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};
