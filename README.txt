In order to get this project up and running you will need: 
*Maven installed on your system
*Intellij IDEA
*SQL database

First you would need to set up the database and populate it with data.
Script for that could be found in "../backend/db"

Then go to the "../backend/src/main/resources" and edit application.properties file.
You will need to change fileds listed below to match your database setup.
*spring.datasource.url
*spring.datasource.username
*spring.datasource.password

Open up the backend folder with IntellijIDEA and reimport all maven projects.
(Maven button in the right top corner, then left most button in the opened sidebar).
Then you can run the backend by rightclicking IpsumApplication.java and selecting "Run IpsumApplication.main()"

Then you will need to set up some sort of live-server for the front-end.
I used "Live Server" extension for the VS Code. If you decide to use it - just press "Go Live" button in the bottom right corner of the VSCode while having project open.
Project should open up in the browser under "http://127.0.0.1:5500/".
