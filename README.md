# Austin City Incident Map

The concept of our application is displaying on an Austin map different amounts and types of incidents that had happen since February 2015. 

We did this project because we were looking for an application that could help in someway to the city and after looking for many APIs we found the incidents at Austin year to date and we decided to used it in a more dynamic way.

We design this application in three different javascript files where we divided the project on UI, Map and Data. So we began displaying the google maps on our application and then we add the UI where the user would select the category of the incidents, search by a keyword and selecting a range of date on the incidents that would like to see on the map. After doing this it’s time for the Data script to perform an ajax call to look for the incidents that match the category, keyword and on the data range selected by the user. With the ajax call we would receive an object full of incidents with the name, report number, date, address, time, this object would be use on the Map script where this the information of each incident will create markers on the map after geocode the address provide it with a different icon depending on the category of the crime, and after a click on the icon it will display a window with the information on that incident.

We use the google maps API, Austin incident API, modals, bootstrap, ajax, firebase.
