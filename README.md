API for Advanced Software Engineering Project built on Nodejs and Expressjs

## Description
* This application contains different services used for the application <https://660f5ee94f0a0422c53624b4--comforting-blancmange-162032.netlify.app/>
* The database that this API interacts with is a PostgreSQL db
* The base routes are defined in index.js, while the complete REST routes are implemented in separate files within the routes folder depending on the service
* The services folder contains files and functions responsible for handling data retrieval and communication with the database. There are separate files for different services
* Any merge to the main branch, automatically deployes the API on our Render server

## Services
* citizen - APIs for citizen account registration
* comment - APIs for creation and retrieval of comments
* event - APIs for creation, retrieval and registration for events
* login - APIs for login/logout functionality
* party - APIs to vote/unvote for parties, retrieve parties, and get list of parties aligned with user interests
* project - APIs to create, retrieve, upvote/downvote and remove projects

## Run server

First run `npm i` to install all the necessary dependencies.
Then, `npm start` for a dev server. Use `http://localhost:3000/` to make the API calls.

## Further help

To get more help on Nodejs and Expressjs, go check out the [Latest Node documentation](https://nodejs.org/docs/latest/api/) and [Latest Express documentation](https://expressjs.com/en/api.html) pages.
