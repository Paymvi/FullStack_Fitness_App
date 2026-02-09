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
2. User is greeted with a screen prompting their choice of exercise to record
3. Depending on the exercise type chosen, the user will be able to insert details about the workout session
4. Once the user is finished, the details of the session will be added to a database 
6. The user will then have several options to choose from this point (they can navigate via the tabs):
    * Add a new workout session (lift or run)
    * Look at previous sessions
    * Query for specific workout sessions (button prompts will be provided)
