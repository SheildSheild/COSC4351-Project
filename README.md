# Getting Started

In your ubuntu terminal, run this code

`git clone https://github.com/SheildSheild/COSC4353-Project.git`

Then type this into your terminal

`./script/bootstrap`

Ensure that you have the latest dependencies by running this command

`npm install`

# How to run the Client and Server!

In your terminal, direct to the server folder i.e.: `cd COSC4353-Project/server` and run the command `node server.js`
This starts the server for the application which allows real time CRUD operations with the front end and back end

After starting the server, you can proceed with starting the client in order to access the front end.

It is important to open a separate terminal in order to run the client along side the server.

Once you have a new terminal open, direct to the client folder via this command in your terminal: `cd COSC4353-Project/client` and run the command `npm start`

This starts the front end for the server, but it will attempt to use the same port "3000". You should be prompted with a yes or no option to start the client on port "3001", to which you should agree by pressing "y" on the keyboard.
