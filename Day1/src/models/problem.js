const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 1000,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    tags: {
        type: String,
        enum: ['array', 'string', 'linked list', 'tree', 'graph', 'dynamic programming', 'greedy', 'backtracking'],
        required: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            explanation: {
                type: String,
                required: true,
            },
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            }
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            }
        }
    ],
    referenceSolutions: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            }
        }
    ],
    problemCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})
const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
