/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />
// Some samples to try
let strings = ['Hello', '98052', '101']
// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {}
validators['ZIP code'] = new Validation.ZipCodeValidator()
validators['Letters only'] = new Validation.LettersOnlyValidator()
// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${validators[name].isAcceptable(s) ? 'matches' : 'does not match'} ${name}`,
    )
  }
}
// 编译，指定输出文件，会自动合并多个通过reference引用的文件
// tsc --outFile example.js Test.ts
