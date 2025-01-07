import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body

   if(!email || !password || !username || !firstName || !lastName){
       throw new ApiError(400, "Please provide all the required fields")
   }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(400, "User already exists with this email or username")
    }

    const dpLocalPath = req.file?.path
    console.log(req.file?.path)
    const dp=await uploadOnCloudinary(dpLocalPath);
  //  console.log(dp)
  //  console.log(dp.url)
    const user= await User.create({
        email,
        password,
        username,
        firstName,
        lastName,
        dp:dp.url
    })
   
    if(!user){
        throw new ApiError(500, "User registration failed")
    }
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(201).json(new ApiResponse(201,{createdUser},"User registered successfully"))

})

const loginUser = asyncHandler(async (req, res, next) => {
    const { email,username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    if(!password){
        throw new ApiError(400, "Password is required")
    }

    const user = await User.findOne(
        { $or: [{ email }, { username }] }
    )

    if (!user) {
        throw new ApiError(400, "User not registered")
    }

    const isPassword = await user.isPasswordCorrect(password)

    if (!isPassword) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res, next) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
            // this option returns the updated document
        }
    )
 
    const options = {
        httpOnly: true,
        secure: true,
    }
    
    
    return res
        .status(200)
        .clearCookie("accessToken" , options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken }