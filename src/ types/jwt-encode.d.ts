declare module "jwt-encode" {
  function jwt_encode(payload: any, secret: string): string;
  export default jwt_encode;
}
