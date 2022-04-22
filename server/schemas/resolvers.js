const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");
      }
      throw new AuthenticationError('Not Logged In')
    },
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
        throw new AuthenticationError("Incorrect Credentials");
      }

      const correctPW = await user.isCorrectPassword(password);
      if (!correctPW) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      const token = signToken(user);
      return { user, token };
    },
    saveBook: async (parent, args, context) => {
      /*
           {
               input: {
                   authors: [strings]
                   description: string
                   bookId: ID
                   link: string
                   title: string
               }
           } 
            
            */
      // console.log(context.user._id);
      const input = args.input;
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { ...input } } },
          { new: true }
        );
      }
      throw new AuthenticationError("Not Logged In");
    },
  },
};

module.exports = resolvers;
