<p align="center">
  <img src="https://github.com/mapikit/meta-system/assets/13098424/e520d2e4-229a-4b21-a146-317f26335623">
</p>

# Meta-System

## **The Everything Framework for Efficient Developers**

Meta-System is a data-centric framework created for reducing the need for duplicated code, or increasingly complex architectural setups.

> Install Meta-System with NPM: `npm i -g meta-system`

## What it Does

Meta-System provides a unique improvement to your development workflow, with all the structures to build the software you need, and the tools and libraries you love, or make.

Here's what Meta-System does for you:

-   **Maps to your data: **It dynamically adapts to your data schemas, minimizing the need for manual adjustments in your code.
-   **Improves code reusability:** The engine's API boosts your productivity by enforcing clear separations of concern, providing bite-sized components that you can effortlessly reuse across projects.
-   **Allows you to work on what matters:** Meta-System abstracts the software architecture responsible for wiring your code and libraries. Instead of writing scaffolding code, you can focus on features that deliver real value in your software.
-   **Eases the efforts for adding features over time:** Because of its structure, Meta-System makes adding more functionality or modifying existing ones remain consistently straightforward, regardless of project complexity.

## How it Works

Meta-System proposes a completely different approach to software development.

Leveraging a simple yet powerful configuration, you can build complete software applications using just plain JSON files to describe your system entities and behaviors. You also won't need to write JSON by hand, as with Meta-Editor, you gain deep control through an intuitive GUI, making it easier than ever to manage and customize your configurations.

Meta-system uses this configuration to fetch and connect all code pieces required, including your own local files, resulting in smaller and simpler code bases.

**Define the entities schemas**: Create all the data formats you will need in your software.

**Configure the Addons**: Addons (libraries) bring all the functions your software requires into Meta-System. Connect to databases, display or render Web Pages, Make HTTP Requests, or even tap into the File System.

**Wire the functionality**: Pass data, remap them, modify, check conditions, and call Addons functions to compose every feature you need.

## How To Use
Oversimplifying, It is actually as easy as:
1. Download Meta-System.
2. Configure your system's behavior.
3. Launch!
 
### 1. Downloading Meta-System
The Meta-System can be downloaded through [NPM](https://www.npmjs.com/package/meta-system). If you have NodeJs installed you probably already have npm and it is a matter of installing with the command
`npm install -g meta-system`
> Note: If you don't have NodeJs and/or npm installed, more info on those can be found [here](https://nodejs.org/en/).

### 2. Configuring your first system
For you to make Meta-System into your very own system, you'll need a configuration file. [Here](https://mapikit.github.io/meta-system-docs/docs/api-docs/configuring/basics.md) you can check in depth how to make Meta-System into your own software. If you're new around, though, here's a classic:  **FizzBuzz**!

Let's get the example from [our documentation page](https://mapikit.github.io/meta-system-docs/docs/api-docs/getting-started#2-configuring-your-first-system).


Simply copy and paste the configuration from the docs into a new text file and save it as `example.json` (you may change the name later, just make sure it is a `.json`).
Now, that you have installed Meta-System and have a configuration ready to go, all there is to do is run Meta-System!

### 3. Launching Meta-System
You can launch instances of Meta-System using the CLI command `meta-system run`. To continue our example, try doing:

- `meta-system run path/to/file/example.json` on Unix Systems;
- `meta-system run path\to\file\example.json` on Windows;

You should be now seeing your configuration being validated, then brought to life by Meta-System, and ready-to-go.

Let's quickly test it! With your Meta-System running, open a web-page and go to the address: [http://localhost:8080/number/2](http://localhost:8080/number/2)

Now change the number after the last slash (/) to any other, and see the results! 🚀

> There's a rundown of this project in the documentation. If you want to learn every bit and how it works, go to [this page](https://mapikit.github.io/meta-system-docs/docs/tutorials/fizz-buzz).

## Use-Cases
What people can build with MSYS? What is possible?

As an engine, Meta-System can be used to power any kind of software, as long as the target platform allows for running NodeJS or browser-based JavaScript.
Also, because it is extensible, you're never limited to only what you have in the engine. The combination of these properties sets Meta-System as a versatile lightweight no-code tool for almost any task! Here's some inspirations:
- **A Backup Daemon** : Configured to automatically run at startup, backs up a preconfigured set of files timely.
- **An authenticated API for accessing a DataSet** : With access to a DataBase, it filters, orders and joins data for a front end application to display.
- **A Live Sync tool for a Collaborative Software** : Used as the source of truth for an user interface to sync data live with peers using a protocol such as WebRTC.
- **A No-Code tool for Enterprise** : You can use Addons to inject business entities and their actions into Meta-System, and allow for wiring their business rules from within MSYS

## Getting in Touch & Contributing
Meta-System has many many moving parts for you to wrap your head around. For making learning and building easier, there's our [discord server](https://discord.gg/ndGsnbTW7V), where you can get help from the community, learn and master different configuration techniques, and also share your own creations.

That's also the place to go if you want to become a contributor and help develop Meta-System, or even getting help developing your own awesome Addon. All core contributors are active around there.

--------

#### Disclaimers
- Meta-System is completely Open-Source, following the GPL-3.0 License.
- Currently Meta-System is at version 0.4, which means the API might receive breaking changes faster than you expect. However, The team will make conscious effort to only make such changes if there are tangible benefits in doing so.

