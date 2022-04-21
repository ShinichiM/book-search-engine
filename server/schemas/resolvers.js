const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        user: async (parent, { username, _id }, context) => {
            return User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks');
        }
    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { user, token };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email: email });

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
        saveBook: async (parent, { input }, context) => {
            // console.log(context.user._id);
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: { ...input } } },
                    { new: true,  }
                );
            }
            throw new AuthenticationError('Not Logged In');
        }
    }
};

module.exports = resolvers;