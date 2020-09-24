import jwt from 'jsonwebtoken'

const getUserId = (request, isAuthRequire=true) => {
    const header = request.request.headers.authorization
    if(header){
      const token = header.replace('Bearer ', '')
      const decoded = jwt.verify(token, 'thisisasecret')
      return decoded.userId
    }
    if (isAuthRequire) {
        throw new Error('Authentication required')
    }
  return null
}

export { getUserId as default }