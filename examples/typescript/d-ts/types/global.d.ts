// global.d.ts

declare var myGlobalVariable: string;

declare function myGlobalFunction(): void;

declare namespace myGlobalObject {
  const prop: number;
}

declare class MyGlobalClass {
  constructor(name: string);
  sayHello(): void;
}

declare function $(selector: string): {html(str: string): void}

