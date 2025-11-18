
export namespace AccountLogin {
  //            сервис.название.тип_команды
  export const topic = 'account.login.command'

  export class Request {
    email:string
    password:string
  }
  export class Response {
    access_token:string
  }
}

