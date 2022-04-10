const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        user: async (parent, { username }) => {
            return user = User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { user, token };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const correctPW = await user.isCorrectPassword(password);
            if (!correctPW) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const token = signToken(user);
            return { user, token };
        },
        saveBook: async (parent, args, context) => {

        }
    }
}