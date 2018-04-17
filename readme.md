![Logo of the project](./doc/github-icon.png)
# Github Organisation Explorer
> This is a real-time version of the [server-side Github organisation explorer](https://github.com/vandijkstef/performance-matters-server-side).

This app can be linked to a GitHub organisation to explore information about it. View the repositories and forks within that organisation. This was created as part of the Webdevelopment Minor at CMD Amsterdam.

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

## Getting started
### Prerequisites
This project assumes you are familiar with NodeJS (`9.11.1`) and NPM (`5.6.0`), and have those installed. Also, MongoDB (`3.6.4`) is assumed to be installed. Client side you would need a browser that supports `JS ES6 Modules` and `WebSocket`.

### Code style
All JS should conform to the eslint config thats included. Please make sure ESlint is functional in your code editor and the supplied config is being used.

Any data object handled in the system should be prefixed with its origin:
- `data` for MongoDB (`dataRepos`)
- `git` for Github (`gitRepos`)

### Installation and running
After cloning the project, install using:
```
npm install
```

The app requires no building.

Before starting the application, make sure MongoDB is running:
```
npm run mongo
```

Aftwards, start the app using:
```
npm start
```
Additionally, you can also watch the app using Nodemon:
```
npm run watch
```

### Deployment
The root of the project contains an `.env-example` file. Rename this to `.env` and set the variables for your envoirement.

## Features
<!-- ...but how does one use this project? What are its features 🤔 -->

## API's
<!-- What external data source is featured in your project and what are its properties 🌠 -->

## Server Caching (DB)
<!-- Where do the 0️⃣s and 1️⃣s live in your project? What db system are you using?-->
Data fetched from API's is cached on the server using MongoDB. Any data request within the system will first try to fetch that from the database. In the case the data doesn't exsist, or is invalid due to cache timeout, a (new) request to the API is made. That data is first stored, then fetched again from the database.
![Data request](./doc/data-request.JPG)


## Wishlist
<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

## Contributing
Currently, no contributions are accepted. However, you are free to fork the project and build on it.

## Licence
<!-- How about a license here? 📜 (or is it a licence?) 🤷 -->
This project is copyleft, all wrongs reversed. Have fun! *Note: This might not be true for dependencies*


## Acknowledgments
* Huge shoutout to the Coffee Bar on the HvA ☕️


<!-- * Create a "live" web app which reflects changes to the back-end data model in reactive front-end views, using real-time, event-based, messaging technologies like sockets or server-sent-events. -->
<!-- * Describe their work in a professional readme with insightful diagrams showing the life cycle of their data. -->


---

- Get all repo's back -> mongo
- Pull users from those repos -> mongo
- Create (oauth) login
- Smth, smth...