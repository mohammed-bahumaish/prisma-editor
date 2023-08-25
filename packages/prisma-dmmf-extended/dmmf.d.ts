import "@prisma/generator-helper";

declare module "@prisma/generator-helper" {
  declare namespace DMMF {
    interface Model {
      startComments: string[];
      endComments: string[];
      index: string[];
    }
  }
}
