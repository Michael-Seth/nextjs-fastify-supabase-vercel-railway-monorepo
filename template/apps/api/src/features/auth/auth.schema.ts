import { Type,type Static } from "@sinclair/typebox";
export const RegisterBody=Type.Object({email:Type.String({format:"email"}),password:Type.String({minLength:8}),name:Type.Optional(Type.String({minLength:1}))});
export const LoginBody=Type.Object({email:Type.String({format:"email"}),password:Type.String()});
export const RefreshBody=Type.Object({refreshToken:Type.String()});
export type TRegister=Static<typeof RegisterBody>; export type TLogin=Static<typeof LoginBody>; export type TRefresh=Static<typeof RefreshBody>;
