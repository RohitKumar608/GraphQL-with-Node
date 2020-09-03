const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0

      setInterval(() => {
        count++
        pubsub.publish("count", {
          count,
        })
      }, 1000)

      return pubsub.asyncIterator("count")
    },
  },
  comment: {
    subscribe(parent, { postId }, { pubsub, db: { posts } }, info) {
      const findPost = posts.find((post) => post.id === postId)
      if (!findPost) throw new Error("Post not found")
      console.log(postId, findPost)
      return pubsub.asyncIterator(`comment ${postId}`)
    },
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator(`post`)
    },
  }
}

export { Subscription as default }
