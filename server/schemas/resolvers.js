const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        user: async (parent, { username, _id }) => {
            return User.findOne({$or: [{ _id: _id }, { username: username }]})
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
        saveBook: async (parent, { userID, body }, context) => {
            // console.log('THIS IS THE CONTXT: ', context.user);
            const updatedUser = await User.findOneAndUpdate(
                { _id: userID },
                { $addToSet: { savedBooks: body }},
                { new: true, runValidators: true }
            );
            return updatedUser;
        }
    }
};

module.exports = resolvers;