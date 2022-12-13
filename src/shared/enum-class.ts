export class EnumClass<T = string> {
  private static readonly enums = {};
  static getFromValue<U>(value: U): EnumClass<U> {
    return EnumClass.enums[this.name].find((status) => status.value === value);
  }
  // protected static getValues() {
  //   return EnumClass.enums[this.name];
  // }
  constructor(public readonly value: T) {
    if (!EnumClass.enums[this.constructor.name]) {
      EnumClass.enums[this.constructor.name] = [];
    }
    EnumClass.enums[this.constructor.name].push(this);
  }
}
