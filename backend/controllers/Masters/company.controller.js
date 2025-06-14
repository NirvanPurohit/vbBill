import Company from '../../models/Masters/company.model.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/AsyncHandler.js';

const createCompany=asyncHandler(async(req,res)=>{
   const existingCompany=await Company.findOne({ companyCode: req.body.companyCode });
   if (existingCompany) {
      throw new ApiError(400, 'Company code already exists');
   }
   const savedCompany=await Company.create(req.body);
   res.status(201).json(new ApiResponse(201, savedCompany, 'Company created successfully'));
})

const getAllCompanies=asyncHandler(async(req,res)=>{
   const companies=await Company.find();
   if (!companies || companies.length === 0) {
      throw new ApiError(404, 'No companies found');
   }
   res.status(200).json(new ApiResponse(200, companies, 'All companies fetched successfully'));
});

const getCompanyById=asyncHandler(async(req,res)=>{
   const company=await Company.findById(req.params.id);
   if (!company) {
      throw new ApiError(404, 'Company not found');
   }
   res.status(200).json(new ApiResponse(200, company, 'Company fetched successfully'));
});

const updateCompany=asyncHandler(async(req,res)=>{
   const updatedCompany=await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });
   if (!updatedCompany) {
      throw new ApiError(404, 'Company not found');
   }
   res.status(200).json(new ApiResponse(200, updatedCompany, 'Company updated successfully'));
});

const deleteCompany=asyncHandler(async(req,res)=>{
   const deletedCompany=await Company.findByIdAndDelete(req.params.id);
   if (!deletedCompany) {
      throw new ApiError(404, 'Company not found');
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