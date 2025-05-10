const express = require('express');
const { create } = require('../models/users');
const problemRouter = express.Router();
const { createProblem, getProblem, getAllProblems, updateProblem, deleteProblem, getSolvedProblems } = require('../controllers/userProblem');
const adminMiddleware = require('../Middleware/adminMiddleware');

//create
problemRouter.post('/create',adminMiddleware, createProblem);
problemRouter.patch('/update/:id', updateProblem);
problemRouter.delete('/delete/:id', deleteProblem);


problemRouter.get('/get/:id', getProblem);
problemRouter.get('/getAll', getAllProblems);
problemRouter.get('/user', getSolvedProblems);

module.exports = problemRouter;

