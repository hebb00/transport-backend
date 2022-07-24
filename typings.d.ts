// ./src/typings/express-session/index.d.ts
import "express-session"; // don't forget to import the original module

declare module "express-session" {
    interface SessionData {
        user: {
            id:number,
            firstname:string,
            lastname:string, 
            username:string,
            phone_num:string
          
        
        } // whatever property you like
    }
}