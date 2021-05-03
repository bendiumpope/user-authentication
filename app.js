const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();

//set Security http headers
app.use(helmet());

//set maximum amout of limit request from an ip address in an hour
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

///Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data SanitizaTION AGAINST NoSQL  query injection
app.use(mongoSanitize());

//Data Sanitization against XSS i.e html codes
app.use(xss());

//API ROUTES///
app.use('/api/v1/users', userRouter);

////HANDLING ERROR ROUTES//////
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
  });
  
app.use(globalErrorHandler);
  
module.exports = app;