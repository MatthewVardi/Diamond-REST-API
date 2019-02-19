# Diamond-API
This API is a RESTful API

Data is exchanged in JSON format

Resource Groups:
1. Diamonds
2. Reservations
3. Users

You can interact with my API using [Postman](https://www.getpostman.com/)

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
	"email": "youremailgoeshere",
	"password": "yourpasswordgoeshere"
}
```


Example Response:
```javascript
{
    "message": "Authentication Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYWRtaW4uY29tIiwidXNlcklkIjoiNWM2YjQ3YjU3MmFlM2MwMDI0Nzg3YjU2IiwiaWF0IjoxNTUwNTM0NjkyLCJleHAiOjE1NTA1MzgyOTJ9.8--OFArDsBlMMeOYKrUFH3mma_VdeNyevseoZVnTt7E",
    "user_id": "5c6b47b572ae3c0024787b56"
}
```

Save this token from the response as it will be used as the value for your API Key.

The token will remain valid for 1 hour, after that you must authenticate again. 

All subsequent calls that make any modificications to the data must include this key in the header.

In order to use the token, include a key-value pair in the header where

Key: "Bearer Token"

Value: {Token Goes Here}

If you do not include your key when using endpoints that require authentication, you will receive this response:

```javascript
{
    "message": "Authentication Failed"
}
```



## API Endpoint

The Diamond API uses the endpoint: https://diamondapi.herokuapp.com

Endpoints that require authentication will have a * next to the verb

## Resources

Documentation will follow this pattern:
HTTP Verb - End Point - Description

<strong>Diamonds</strong>

Interact with all diamonds in the database

GET - /diamonds - Returns a list of all diamonds

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

GET - /diamonds/{diamondId} - See Specific Diamond (More Detailed)

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
*POST - /diamonds - Upload a new diamond to the database

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

*PATCH - /diamonds/{diamondId} - Update a diamond in the database

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

*DELETE - /diamonds/{diamondId} - Delete a diamond from the database

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












---


Created using Node.js

#### **Will Include:**

- RESTful Endpoints
- CRUD
- User Validation
	- via JSON Web Token
	- Auth Timer
	- Route Protection
- Error Handling
- Data persistence


Information is exchanged in JSON format

The intent is to deploy this API with full documentation (using postman docs)

#### **To Do:**
- Insert auth middleware after all testing - **Done**
- Create reserve model
	- Routes for reserving diamonds
		- See all reserved - **Done**
		- Reserve a diamond + date reserved - **Done**
		- Route to see specific reservation - **Done**
		- Unreserve aka delete - **Done**
	- Update diamond model to have reserved field: y/n - **Done**
	- refrence to the user when listing all diamonds reserved - **Done**
	- Add name field for diamonds - **Done**
- Seed the DB with Diamonds - **Done**
- Error handling for invalid ID's (/diamonds and /reserve DELETE request) - **Done**
- Update responses with valid URL's for further requests - **Done**
- Hosting - LIVE: https://diamondapi.herokuapp.com
	- Heroku - **Done**
	- ENV Vars - **Done**
	- Testing - **Done**
- Documentation using Postman Docs & Add to website

Created by Matthew Vardi


