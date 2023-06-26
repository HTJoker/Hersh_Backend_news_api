# Hersh News API

To successfully use this repo you must create your own .env files as they will not be included by default
the files you need to create would be => .env.test and .env.development
Use the .env-example file to confirm the format of connecting to the correct database
Use the line 'PGADATABASE=<database_name> in each .env file
If you do not know the database name go to the setup dbs file to get the correct name

- I would first recommend to use npm install to download the necessary packages to begin using the repo
- To create the databases you can run the script 'npm run setup-dbs'
- To get data into the database use the script 'npm run seed' to create the tables and store the data in their necessary spaces
