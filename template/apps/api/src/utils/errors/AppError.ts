export class AppError extends Error {
  constructor(public message:string, public statusCode=400, public code?:string) { super(message); this.name="AppError"; }
  static badRequest = (m:string,c?:string) => new AppError(m,400,c);
  static unauthorized = (m="Unauthorized") => new AppError(m,401,"UNAUTHORIZED");
  static forbidden    = (m="Forbidden")    => new AppError(m,403,"FORBIDDEN");
  static notFound     = (m="Not found")    => new AppError(m,404,"NOT_FOUND");
  static conflict     = (m:string)         => new AppError(m,409,"CONFLICT");
  static internal     = (m="Internal server error") => new AppError(m,500,"INTERNAL");
}
