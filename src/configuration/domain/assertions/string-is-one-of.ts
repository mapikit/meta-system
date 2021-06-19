export function stringIsOneOf <T extends string> (input : string, stringList : string[], message ?: string)
  : asserts input is T {
  const usedMessage = message ?? "Input Type Error";

  if (!stringList.includes(input)) {
    throw TypeError(`${usedMessage} : should be one of [${stringList.join(", ")}]`);
  }
};
