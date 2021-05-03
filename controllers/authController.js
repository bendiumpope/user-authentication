const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync'); 
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    //remove the password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: [
            {
            user: user
            }
        ]
    });    
}

exports.register =  catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        firstName: req.body.firstName,
        sureName: req.body.sureName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync (async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){

        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password'); 

    if(!user || !await user.correctPassword(password, user.password)){

        return next(new AppError('Incorrect email or password', 401));
    }

     createSendToken(user, 200, res);    
});

//protecting route using a middleware function
exports.protect = catchAsync(async (req, res, next) => {
    //Getting token and check if it's there
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        
        token = req.headers.authorization.split(' ')[1];
    }


    if(!token){
        return next(new AppError('Please login', 401));
    }

    //validate token
    let decoded
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); 
    } catch (err) {
        return next(new AppError('Please login', 401));
    }
    

    //check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belongging to this token no longer exists', 401));
    }

    //Grant access to protected route
    req.user = currentUser;

    next();
});
