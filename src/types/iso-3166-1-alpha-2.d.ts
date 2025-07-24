declare module "iso-3166-1-alpha-2" {
  const ISO31661: {
    getCountry: (code: string) => string | undefined;
    getCodes: () => string[];
    getName: (code: string) => string | undefined;
    getCode: (name: string) => string | undefined;
  };
  export default ISO31661;
}
