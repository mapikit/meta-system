export const isHttpError  = (code : number) : boolean => {
  return code >= 300;
};
