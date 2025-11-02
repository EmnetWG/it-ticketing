require('dotenv').config()
require('express-async-errors')
const express = require('express')

const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express ()
const xss =require('xss-clean')
const rateLimiter = require('express-rate-limit')
const cookieParser = require('cookie-parser')


//const userRouter = require('./routes/userRouter')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const departmentRouter = require('./routes/departmentRouter')
const categoryRouter = require('./routes/categoryRouter')
const subCategoryRouter = require('./routes/subCategoryRouter')
const ticketRouter = require('./routes/ticketRouter')

const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')


/*
// Custom error handler middleware
app.use((err, req, res, next) => {
    if (err instanceof BadRequestError) {
        return res.status(400).json({ msg: err.message });
    }

    // Catch other types of errors
    res.status(500).json({ msg: "Internal Server Error" });
});

*/

app.use(express.static('./public'));
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs:15*60*1000,
  max:500,
}))

//app.use('/', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/department', departmentRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/subCategory', subCategoryRouter)
app.use('/api/v1/tickets', ticketRouter)
// fix "/posts"

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0')
  next ();
});


app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

 const port = process.env.PORT || 3000
// const port = process.env.PORT || 1040

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)  
  })
  
// module.exports = app
// npx sequelize init