const USER = require("../model/user");
const BUILDER = require("../model/builder");
const { deleteUploadedFile } = require("../utils/fileHelper");
const { encryptData, decryptData } = require("../utils/crypto");
const jwt = require("jsonwebtoken");

exports.createUserService = async (body) => {
  const { 
    name, location, timing, website, refer, profileImage, 
    secondaryNumber, whatsappNumber, facebookLink, instagramLink, messageNumber, logo, companyName, adImage,
    ...userAuthData 
  } = body;
  const { number } = userAuthData;
  
  if (userAuthData.password) {
    userAuthData.password = encryptData(userAuthData.password);
  }

  const user = await USER.create(userAuthData);
  
  await BUILDER.create({
    userId: user._id,
    name,
    number,
    location,
    timing,
    website,
    refer,
    profileImage,
    secondaryNumber,
    whatsappNumber,
    facebookLink,
    instagramLink,
    messageNumber,
    logo,
    companyName,
    adImage
  });

  return { 
    ...user._doc, name, number, location, timing, website, refer, profileImage,
    secondaryNumber, whatsappNumber, facebookLink, instagramLink, messageNumber, logo, companyName
  };
};

exports.loginUserService = async ({ identifier, password }) => {
  const userVerify = await USER.findOne({
    $or: [{ email: identifier }, { number: identifier }],
    isDeleted: false,
    status: "active",
  });

  if (!userVerify) throw new Error("Invalid Email/Number or password, or account inactive");

  const decryptedPassword = decryptData(userVerify.password);
  if (String(decryptedPassword) !== password) throw new Error("Invalid password");

  const details = await BUILDER.findOne({ userId: userVerify._id });

  const token = jwt.sign({ id: userVerify._id }, process.env.JWT_SECRET_KEY);
  return { user: { ...userVerify._doc, ...details?._doc, _id: userVerify._id }, token };
};

exports.fetchAllUsersService = async ({ page, limit, search, roleFilter }) => {
  const skip = (page - 1) * limit;

  const matchQuery = { isDeleted: false };
  if (roleFilter) matchQuery.role = roleFilter;

  const aggregate = [
    {
      $lookup: {
        from: "builders",
        localField: "_id",
        foreignField: "userId",
        as: "details",
      },
    },
    { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        ...matchQuery,
        $or: [
          { email: { $regex: search, $options: "i" } },
          { number: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { "details.name": { $regex: search, $options: "i" } },
          { "details.refer": { $regex: search, $options: "i" } },
          { "details.location": { $regex: search, $options: "i" } },
          { "details.website": { $regex: search, $options: "i" } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const result = await USER.aggregate(aggregate);
  const totalUser = result[0].metadata[0]?.total || 0;
  const usersData = result[0].data.map(u => {
      let decodedPassword = u.password;
      if (u.password) {
        try {
          decodedPassword = decryptData(u.password) || u.password;
        } catch(e) {}
      }
      return {
          ...u,
          ...u.details,
          password: decodedPassword,
          details: undefined,
          _id: u._id // ensure user ID is preserved
      };
  });

  return { totalUser, usersData, page, limit };
};

exports.fetchUserByIdService = async (userId) => {
  // 1. Try to find user by User ID first
  let user = await USER.findOne({ _id: userId, isDeleted: false });
  let details;

  if (user) {
    // Found user, now find their builder details
    details = await BUILDER.findOne({ userId });
  } else {
    // 2. If not found by User ID, try finding a Builder record by its own ID
    details = await BUILDER.findById(userId);
    if (details) {
      // If builder entry found, find the associated user
      user = await USER.findOne({ _id: details.userId, isDeleted: false });
    }
  }

  if (!user) throw new Error("User not found or deleted");
  
  let decodedPassword = user.password;
  if (user.password) {
      try {
          decodedPassword = decryptData(user.password) || user.password;
      } catch(e) {}
  }
  
  return { ...user._doc, ...details?._doc, _id: user._id, password: decodedPassword };
};

exports.userUpdateService = async (userId, body) => {
  const { 
    name, location, timing, website, refer, profileImage,
    secondaryNumber, whatsappNumber, facebookLink, instagramLink, messageNumber, logo, companyName, adImage,
    ...userAuthData 
  } = body;
  const { number } = userAuthData;

  const oldUser = await USER.findOne({ _id: userId, isDeleted: false });
  if (!oldUser) throw new Error("User not found or deleted");

  if (userAuthData.password) userAuthData.password = encryptData(userAuthData.password);
  
  const updatedUser = await USER.findByIdAndUpdate(userId, userAuthData, { new: true });

  const oldDetails = await BUILDER.findOne({ userId });
  
  // If a new profile image is provided and there was an old one, delete the old one
  if (profileImage && oldDetails?.profileImage && profileImage !== oldDetails.profileImage) {
      deleteUploadedFile("builder", oldDetails.profileImage);
  }

  // If a new logo is provided and there was an old one, delete the old one
  if (logo && oldDetails?.logo && logo !== oldDetails.logo) {
    deleteUploadedFile("builder", oldDetails.logo);
  }
  if (adImage && oldDetails?.adImage && adImage !== oldDetails.adImage) {
    deleteUploadedFile("builder", oldDetails.adImage);
  }

  const updatedDetails = await BUILDER.findOneAndUpdate(
      { userId },
      { 
        name, number, location, timing, website, refer, profileImage,
        secondaryNumber, whatsappNumber, facebookLink, instagramLink, messageNumber, logo, companyName, adImage
      },
      { new: true, upsert: true }
  );

  return { ...updatedUser._doc, ...updatedDetails._doc, _id: updatedUser._id };
};

exports.userDeleteService = async (userId) => {
  const oldUser = await USER.findOne({ _id: userId, isDeleted: false });
  if (!oldUser) throw new Error("User not found or already deleted");
  await USER.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() });
};
