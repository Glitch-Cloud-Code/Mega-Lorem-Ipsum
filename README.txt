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


Finally, you can open up "index.html" located in "../frontend" folder  with the browser of your choosing. (Except Internet Explorer. Please don't.)


Mandatory features that I decided not to include in this task due to time constraints: 
*Validations for inputs
*HTML tags stripping form inputs
*Security
*Backend error output to UI