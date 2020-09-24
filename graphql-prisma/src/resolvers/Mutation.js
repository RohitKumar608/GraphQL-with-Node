import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    })

    if (!user) {
      throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error("Unable to login")
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, "thisisasecret"),
    }
  },
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email })
    if (args.data.password.length < 7) {
      throw new Error("Password must be 8 character or longer")
    }
    if (emailTaken) {
      throw new Error("Email taken")
    }
    const password = await bcrypt.hash(args.data.password, 10)
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    })
    const token = jwt.sign({ userId: user.id }, "thisisthesecret")
    return {
      user,
      token,
    }
  },
  deleteUser(parent, args, { prisma }, info) {
    const userIndex = prisma.exists.User({ id: args.id })

    if (!userIndex) {
      throw new Error("User not found")
    }
    // info is the selection send from the query
    return prisma.mutation.deleteUser({ where: { id: args.id } }, info)
  },
  updateUser(parent, args, { prisma }, info) {
    const isExist = prisma.exists.User({ id: args.id })
    if (!isExist) {
      throw new Error("User not found")
    }
    return prisma.mutation.updateUser({
      where: {
        id: args.id,
      },
      data: args.data,
    })
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    const isUserExist = await prisma.exists.User({ id: args.data.author })
    if (!isUserExist) {
      throw new Error("User not found")
    }
    const post = prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.title,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author,
            },
          },
        },
      },
      info
    )

    return post
  },
  deletePost(parent, args, { prisma }, info) {
    const postIndex = prisma.exists.Post({ id: args.id })

    if (postIndex === -1) {
      throw new Error("Post not found")
    }
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info
    )
  },
  updatePost(parent, args, { prisma }, info) {
    const { id, data } = args
    const postIndex = prisma.exists.Post({ id: id })
    if (postIndex === -1) {
      throw new Error("Post not found")
    }
    return prisma.mutation.updatePost(
      {
        where: {
          id: id,
        },
        data: data,
      },
      info
    )
  },
  async createComment(parent, args, { prisma }, info) {
    const isPostExist = await prisma.exists.User({ id: args.data.author })
    const isUserExist = await prisma.exists.Post({ id: args.data.post })
    if (!isPostExist || !isUserExist) {
      throw new Error("Unable to find user and post")
    }
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    )
  },
  deleteComment(parent, args, { prisma }, info) {
    const isCommentExist = prisma.exists.Comment({ id: args.id })
    if (!isCommentExist) {
      throw new Error("Comment not found")
    }
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    )
  },
  updateComment(parent, args, { prisma }, info) {
    const { id, data } = args
    const isCommentExist = prisma.exists.Comment({ id: id })
    if (!isCommentExist) {
      throw new Error("Comment not found")
    }
    return prisma.mutation.updateComment(
      {
        where: {
          id: id,
        },
        data: data,
      },
      info
    )
  },
}

export { Mutation as default }
