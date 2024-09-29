export function bindAllMethods(instance: any) {
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
  methods.forEach((method) => {
    if (method !== "constructor" && typeof instance[method] == "function") {
      instance[method] = instance[method].bind(instance);
    }
  });
}
