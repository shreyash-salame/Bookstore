const validateEditProfileData = (req) => {
    const allowedEditFields = [
      "userName",
      "email",
      "address",
      "avatar",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
    return isEditAllowed;
  };
  module.exports = {  validateEditProfileData };