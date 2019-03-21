declare namespace NodeJS {
    export interface Global {
        XMLHttpRequest: any,
        GetGlobalContext: () => any,
        Xrm: any;
    }
  }