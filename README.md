# How to Run

Follow this steps:
```
1. Run npm install
2. Make images directory above this folder.
3. Run node main.js
```
Later, make .env config with values :

``` 
DATABASE_USER = "DEFAULT: user"
DATABASE_HOST = "DEFAULT: localhost"
DATABASE_NAME = "YOUR DATABASE NAME"
DATABASE_PASSWORD = "YOUR DATABASE PASSWORD"
DATABASE_PORT = 5432
PORT = <YOUR PORT>
```

## Features

1. Register
2. Login
3. Verification Vehicles
4. Get User Vehicles
5. Delete User Vehicle   
6. History Transactions
7. Top up.
8. Pin Confirmation


### Optional :

In case you want your application keep running and have logging:

Install pm2 using `npm install pm2` then start with `pm2 start main.js --name={name your instance}`