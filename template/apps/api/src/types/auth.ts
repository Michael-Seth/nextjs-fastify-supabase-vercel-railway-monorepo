export interface JwtPayload { userId:string; email:string; role:string; type:"access"|"refresh"; }
export interface TokenPair { accessToken:string; refreshToken:string; expiresIn:number; }
