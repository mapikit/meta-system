export interface Error {message : string; context ?: unknown; errorStack ?: string; [extraData : string] : unknown}
export interface Warn {message : string; possibleProblem : string; [extraData : string] : unknown}
export interface Info {message : string; [extraData : string] : unknown}
export interface Verbose {message : string; [extraData : string] : unknown}
export interface Debug {message : string; [extraData : string] : unknown}
export interface Silly {message : string; [extraData : string] : unknown}
