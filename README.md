<p align="center">
  <img src="https://user-images.githubusercontent.com/13098424/131416580-f6718c24-5687-4016-8801-44c177a70d42.png">
</p>

# Meta-System - A system to be any system

Check the [roadmap](https://github.com/mapikit/meta-system/blob/master/ROADMAP.md)!

## What is Meta-System?
It is a software capable of executing flows and operations declared in a configuration file; Instead of coming up with the code yourself, you only tell Meta-System the business rules to follow.

## Installing and Running
It is possible to both run meta-system as a service on its own, or integrate it in an existing system.

### Running as a Standalone Service
- `npm run build` - To build the executables.
- `npm i -g` - To install the binaries.
- `meta-system <configuration-file-path>` - To start the system

### Integrating With an Existing Service
First, install meta-system to your code with `npm install meta-system`.

> Be sure to create a system configuration following the exported type `ConfigurationType`.

#### 1. Instantiate a `FunctionSetup` class
It requires 3 arguments:
  - An internal function manager,
  - An external function manager,
  - The system configuration

you can use the predefined managers singletons `externalFunctionManagerSingleton` and `internalFunctionManagerSingleton` or instantiate your own `ExternalFunctionManagerClass` and `InternalFunctionManagerClass`.

#### 2. Run setup sequence with: `await FunctionSetup.setup()`
#### 3. Get the system function manager: `FunctionManager.getBopsManager()`

The system function manager (`FunctionManager`) provides you a method `.get()`. The functions configured in your `ConfigurationType` should be available here with their names.
