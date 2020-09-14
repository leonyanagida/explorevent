// import { AkismetClient } from 'akismet-api'
import { client as akismetClient } from 'akismet'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

dotenv.config()

export const textModerationHandler = (request: Request, response: Response, next: NextFunction) => {
  // Handles moderation of the text that users post.
  // We need to get the user's ip address for Akismet to properly check if the content is spam
  //
  // Get the user's IP address
  let ipAddress: string = ''
  // Amazon EC2 / Heroku workaround to get real client IP
  let forwardedIpsStr = request.header('x-forwarded-for')
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP", so take the first one
    let forwardedIps = forwardedIpsStr.split(',')
    ipAddress = forwardedIps[0]
  }

  if (!ipAddress) {
    // Ensure getting client IP address still works in development environment
    ipAddress = request.connection.remoteAddress!
  }

  // Keep the akismet api key a secret :)
  const apiKey: string = process.env.AKISMET_API_KEY || ''
  const blog = 'http://explorevent.herokuapp.com'

  return new Promise(async (resolve, reject) => {
    let client = akismetClient({ blog, apiKey })
    // Verify the akismet api key
    await client.verifyKey((err, verified) => {
      if (verified) {
        client.checkComment(
          {
            user_ip: ipAddress,
            permalink: 'http://www.my.blog.com/my-post',
            comment_author: 'user',
            comment_content: request.body.text,
            is_test: 1,
          },
          function (err, spam) {
            if (spam) {
              reject()
              return response.status(400).send()
            } else {
              resolve(comment)
              return next()
            }
          }
        )
      } else {
        reject()
        return response.status(404).send()
      }
    })
    // Comment object
    const comment = {
      content: request.body.text,
      ip: ipAddress,
      useragent: 'CommentorsAgent 1.0 WebKit',
      isTest: true, // Set this to true when running tests
    }
  })
}

// export const textModerationHandler = (request: Request, response: Response, next: NextFunction) => {
//   // Handles moderation of the text that users post.
//   // We need to get the user's ip address for Akismet to properly check if the content is spam
//   //
//   // Get the user's IP address
//   let ipAddress: string | undefined
//   // Amazon EC2 / Heroku workaround to get real client IP
//   let forwardedIpsStr = request.header('x-forwarded-for')
//   if (forwardedIpsStr) {
//     // 'x-forwarded-for' header may return multiple IP addresses in
//     // the format: "client IP, proxy 1 IP, proxy 2 IP", so take the first one
//     let forwardedIps = forwardedIpsStr.split(',')
//     ipAddress = forwardedIps[0]
//   }

//   if (!ipAddress) {
//     // Ensure getting client IP address still works in development environment
//     ipAddress = request.connection.remoteAddress
//   }

//   // Keep the akismet api key a secret :)
//   const key: string = process.env.AKISMET_API_KEY || ''
//   const blog = 'http://explorevent.herokuapp.com'

//   return new Promise(async (resolve, reject) => {
//     let client = new AkismetClient({ blog, key })
//     // Verify the akismet api key
//     const isValid = await client.verifyKey().catch((err: Error) => {
//       reject(err)
//       return response.status(404).send()
//     })
//     // If the key is not valid, send an error
//     if (!isValid) {
//       reject()
//       return response.status(404).send()
//     }
//     // Comment object
//     const comment = {
//       content: request.body.text,
//       ip: ipAddress,
//       useragent: 'CommentorsAgent 1.0 WebKit',
//       isTest: true, // Set this to true when running tests
//     }
//     // Call the Akismet API and check if the comment is spam
//     const isSpam = await client.checkSpam(comment)
//     if (isSpam) {
//       reject()
//       return response.status(400).send()
//     } else {
//       resolve(comment)
//       return next()
//     }
//   })
// }
