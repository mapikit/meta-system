<p align="center">
  <img src="https://github.com/mapikit/meta-system/assets/13098424/e520d2e4-229a-4b21-a146-317f26335623">
</p>

# Meta-System
Meta-System is an extensible and modular no-code engine, built for everyone, free and open-source.

It aims to simplify software as a whole, freeing you, the developer, to work on what makes your software truly unique. It does so by being simple, capable, and [extensible](https://mapikit.github.io/meta-system-docs/docs/api-docs/architecture/extending-functionality): Just give Meta-System (**MSYS** for short) a configuration file and watch as it builds http routes, databases, functions and *voilà!* Your system should be up and running!

-----
## Features
- **Build Anything!** : Meta-System wasn't made for "a type" of software, meaning you can build anything you like!
- **Simple, Yet Extensible** : Its modular design allows you for adding, creating **and sharing** Add-ons, expanding your possibilities as far as you need them.
- **Unopinionated** : Meta-System doesn't make decisions for you, instead, it opens the path for you to focus only in what is necessary. Of course, however, you can extend it with your own opinions as you wish.
- **The Power of JSON** : Your Meta-System is configured using human-readable, and machine-parseable JSON.
- **GUI for Configuring your System** : (Coming Soon!) A graphical editor for your Meta-System configuration files, allowing for great visibility of the processes of your system.

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

