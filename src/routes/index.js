const express = require('express');
const userRouter = require('./user');
const cvRouter = require('./cv');
const authRouter = require('./auth');
const recommendationRouter = require('./recommendation');

const app = express();

app.use('/users', userRouter);
app.use('/cvs', cvRouter);
app.use('/auth', authRouter);
app.use('/recommendations', recommendationRouter);

module.exports = app;