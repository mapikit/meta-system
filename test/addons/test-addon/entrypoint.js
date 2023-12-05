/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-empty-function
export const boot = () => {
// Empty as it is required by the addons API
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const configure = (broker) => {
  const myModuleFunc = ({ arg }) => {
    return { type: typeof arg };
  };

  broker.addonsFunctions.register(myModuleFunc, {
    input: { arg: { "type": "any" } },
    output: { type: { "type": "any" } },
    functionName: "myModuleFunc",
  });

  broker.done();
};
