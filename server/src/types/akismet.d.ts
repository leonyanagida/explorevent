// <reference types="node" />
interface IAkismetClient {
  key: string
  blog: string
}

declare module 'akismet-api' {
  export class AkismetClient {
    key: string
    blog: string
    verifyKey: function
    checkComment: function
    checkSpam: function
    constructor({ blog, key }: IAkismetClient) {
      this.key = key
      this.blog = blog
    }
  }
}
