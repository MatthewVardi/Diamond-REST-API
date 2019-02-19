# Diamond API

Use this API to interact with a list of Diamonds and make Reservations for them.

This concept / relationship is similar to a products and orders relationship.

This API is a RESTful API and supports CRUD.

Data is exchanged in JSON format

Resource Groups:
1. Diamonds
2. Reservations
3. Users

You can interact with my API using [Postman](https://www.getpostman.com/).

## API Endpoint

The Diamond API uses the endpoint: https://diamondapi.herokuapp.com.

Endpoints that require authentication will have a * next to the HTTP verb.

## Authentication

All API calls making modifications to the data must be authenticated using an API Key.

If you intend to use the API for read-only purposes then no authentication is required.

Authentication for the first time is a two step process:

<strong>Signing Up:</strong>

Make a POST Request to /user/signup with the following:

Example Body:

```javascript
{
	"email": "youremailgoeshere",
	"password": "yourpasswordgoeshere"
}
```

Example Response:
```javascript
{
    "message": "User Created, sign in to receive Authentication token"
}
```

<strong>Logging In:</strong>

Make a POST Request to /user/login with the following:

Example Body:

```javascript
{  
   "email":"youremailgoeshere",
   "password":"yourpasswordgoeshere"
}
```


Example Response:
```javascript
{  
   "message":"Authentication Successful",
   "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYWRtaW4uY29tIiwidXNlcklkIjoiNWM2YjQ3YjU3MmFlM2MwMDI0Nzg3YjU2IiwiaWF0IjoxNTUwNTM0NjkyLCJleHAiOjE1NTA1MzgyOTJ9.8--OFArDsBlMMeOYKrUFH3mma_VdeNyevseoZVnTt7E",
   "user_id":"5c6b47b572ae3c0024787b56"
}
```

Save this token from the response as it will be used as the value for your API Key.

The token will remain valid for <strong>1 hour</strong>, after that you must authenticate again. 

All subsequent calls that make any modificications to the data must include this key in the header.

In order to use the token, include a key-value pair in the header where:
```
Key: "Bearer Token"

Value: {Token Goes Here}
```

If you do not include your key when using endpoints that require authentication, you will receive this response:

```javascript
{  
   "message":"Authentication Failed"
}
```


## Resources

Documentation will follow this pattern:
HTTP Verb - End Point - Description

<strong>Diamonds</strong>

Interact with all diamonds in the database.

GET - /diamonds - Returns a list of all diamonds.

Example Response:

```javascript
{  
   response:{  
      count:2,
      diamonds:[  
         {  
            name:"Princess Cut 1.2 CT G SI1",
            available:"No",
            id:"5c65bdab96ef372de8ddb86c",
            see_more:{  
               request_type:"GET",
               description:"See Specific Diamond",
               endpoint:"/diamonds/5c65bdab96ef372de8ddb86c"
            }
         },
         {  
            name:"Round Cut 3.0 CT F SI",
            available:"Yes",
            id:"5c65d850098da0323c859543",
            see_more:{  
               request_type:"GET",
               description:"See Specific Diamond",
               endpoint:"/diamonds/5c65d850098da0323c859543"
            }
         }
      ]
   }
}
```

GET - /diamonds/{diamondId} - See Specific Diamond (More Detailed).

 Example Response:

```javascript
{  
   diamond:{  
      available:"No",
      _id:"5c65bdab96ef372de8ddb86c",
      name:"Princess Cut 1.2 CT G SI1",
      shape:"Princess",
      color:"G",
      clarity:"SI1",
      carat:1.2,
      price:1450,
      certification:"EGL"
   },
   see_more:{  
      type:"GET",
      description:"See All Diamonds",
      endpoint:"/diamonds"
   }
}
```
*POST - /diamonds - Upload a new diamond to the database.

Example Body:

```javascript
{  
   "shape":"Square",
   "color":"E",
   "clarity":"VVS",
   "carat":"1.10",
   "price":"2500",
   "certification":"None"
}
```

Example Response:
```javascript
{
    "message": "New Diamond Added Succesfully",
    "see_more": {
        "request_type": "GET",
        "diamond_id": "5c6b41ed72ae3c0024787b55",
        "description": "See Specific Diamond",
        "endpoint": "/diamonds/5c6b41ed72ae3c0024787b55"
    }
}
```

*PATCH - /diamonds/{diamondId} - Update a diamond in the database.

Example Body:

Where "propName" can be any of the keys in the POST request body (See above).

```javascript
[  
   {  
      "propName":"price",
      "value":"2500"
   },
   {  
      "propName":"certification",
      "value":"GIA"
   }
]
```

Example Response:
```javascript
{  
   "message":"Diamond updated",
   "see_more":{  
      "type":"GET",
      "description":"See Updated Diamond",
      "endpoint":"/diamonds/5c6b41ed72ae3c0024787b55"
   }
}
```

*DELETE - /diamonds/{diamondId} - Delete a diamond from the database.

Example Response:

```javascript
{  
   "message":"Product Deleted",
   "see_more":{  
      "type":"GET",
      "Description":"See All Diamonds",
      "endpoint":"/diamonds"
   }
}
```

<strong>Reservations</strong>

This resource builds on the diamond resource.

Interact with all reservations in the database.

GET - /reserve - Returns a list of all reservations.

Example Response:

```javascript
{
   "count":2,
   "reservations":[
      {
         "reservation_id":"5c65e4e1021e6200249f62c9",
         "reserved_on":"02/14/2019",
         "reserved_by":"user@password.com",
         "diamond":{
            "_id":"5c65bdab96ef372de8ddb86c",
            "name":"Princess Cut 1.2 CT G SI1"
         },
         "see_more":{
            "type":"GET",
            "description":"See Specific Reservation",
            "endpoint":"/reserve/5c65e4e1021e6200249f62c9"
         }
      },
      {
         "reservation_id":"5c65e808021e6200249f62ca",
         "reserved_on":"02/14/2019",
         "reserved_by":"user@password.com",
         "diamond":{
            "_id":"5c65d9a5098da0323c859553",
            "name":"Round Cut 3 CT H SI"
         },
         "see_more":{
            "type":"GET",
            "description":"See Specific Reservation",
            "endpoint":"/reserve/5c65e808021e6200249f62ca"
         }
      }
   ]
}
```

GET - /reserve/{reservationId} - See Specific Information about a reservation.

Example Response:

```javascript
{  
   "reservation":{  
      "_id":"5c65e4e1021e6200249f62c9",
      "diamond":{  
         "_id":"5c65bdab96ef372de8ddb86c",
         "name":"Princess Cut 1.2 CT G SI1",
         "shape":"Princess",
         "color":"G",
         "clarity":"SI1",
         "carat":1.2,
         "price":1450,
         "certification":"EGL"
      },
      "reserved_by":"user@password.com",
      "date":"02/14/2019",
      "__v":0
   },
   "see_more":{  
      "type":"GET",
      "description":"See All Reservations",
      "endpoint":"/reserve"
   }
}
```

POST - /reserve - Make a new reservation in the database.

Example Body:
```javascript
{  
   "diamondId": "5c65bdab96ef372de8ddb86c"
}
```

Example Response:
```javascript
{
   "message":"Reservation Created",
   "createdReservation":{
      "reservation_id":"5c6b617d4839b800248f3544",
      "reserved_on":"02/19/2019",
      "diamond":"5c65bdab96ef372de8ddb86c"
   },
   "see_more":{
      "type":"GET",
      "description":"See Specific Reservation",
      "endpoint":"/reserve/5c6b617d4839b800248f3544"
   }
}
```
DELETE - /reserve/{reservationId} - Delete a reservation from the database.

Example Response:

```javascript
{  
   "message":"Reservation Removed",
   "see_more":{  
      "type":"GET",
      "description":"See All Reservations",
      "endpoint":"/reserve"
   }
}
```


---


Created using Node.js

#### **Project Includes:**

- RESTful Endpoints
- CRUD
- User Validation
	- via JSON Web Token
	- Auth Timer
	- Route Protection
- Error Handling
- Data persistence

This API is built using Node.js / Express / MongoDB
Authentication was created using "bcrypt" and "jsonwebtoken"

See package.json for  a full list of dependencies

Created by Matthew Vardi


