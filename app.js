//Importing modules: express and morgan
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

//Importing route handlers, which are defined in separate files
const productRoutes = require("./routes/productRoutes");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express(); //Creating an Express application

app.use(helmet());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //Using morgan middleware for logging HTTP requests in development mode
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" })); //Middleware continuation on the right
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

app.use(express.static(`${__dirname}/public`)); //Serving static files from the 'public' directory, allowing access to files like index.html

app.use((req, res, next) => {
  console.log("Hello from the middleware!");
  next(); //Calling next() to pass control to the next middleware function in the stack
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //Adding a custom property to the request object to store the time of the request
  next();
});

app.use("/api/v1/products", productRoutes); //Mounting the product routes on the specified path (link for GET)
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app; //Exporting the Express application for use in other files (like server.js)
