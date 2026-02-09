# README


### Setup and Installation
For a user to use our app locally, the use of two terminals will be required. One for the client and the other for the server. For the client, the user needs to run:
```
npm install 
npm run dev
```  
While the server (do `cd private`), the user needs to run:  
```go run main.go```
or
```go run .```

### Usage Guide 
1. User enters the web application
2. User is greeted with screen prompting their choice of exercise to record
3. Depending on the exercise type chosen, the user will be able to insert details about the workout session
4. Once the user is finished, the details of the session will be added to a database 
5. The user is transferred to a menu displaying their most recent workout session
6. The user will then have several options to choose from this point:
    * Edit any added session
    * Add a new workout session
    * Delete any session present in the database
    * Query for workout sessions 
