const express = require('express');
const publicRouter = require('./publicRouter')
const adminRouter = require('./adminRouter')

const app = express();


app.use('/', publicRouter)
app.use('/admin', adminRouter)

// const loggerWrapper = (options) => {
//     return function (req, res, next) {
//         if (options.log) {
//             console.log(`${new Date(Date.now()).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${req.protocol}- ${req.ip}`);
//             next()
//         } else {
//             throw new Error('Failed to log')
//         }
//     }
// }


// admin.use(loggerWrapper({log: true}))

// // app.use(logger)
// admin.use('/admin', adminRouter)

// app.get('/about', (req, res) => {
//     res.send('About')
// })

// const errorMiddleware = (err, req, res, next) => {
//     console.log(err.message);
//     res.status(500).send("There was a server side error!")
// }

// adminRouter.use(errorMiddleware)

app.listen(3000, ()=> {
    console.log(`listening on port 3000`);
})