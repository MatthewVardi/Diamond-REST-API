# Diamond-REST-API

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
- Insert auth middleware after all testing
- Create reserve model
	- Routes for reserving diamonds
		- See all reserved - **Done**
		- Reserve a diamond + date reserved - **Done**
		- Route to see specific reservation - **Done**
		- Unreserve aka delete - **Done**
	- Update diamond model to have reserved field: y/n - **Done**
	- refrence to the user when listing all diamonds reserved - **Done**
	- Add name field for diamonds - **Done**
- Seed the DB with Diamonds
- Error handling for invalid ID's (/diamonds and /reserve DELETE request) - **Done**
- Update responses with valid URL's for further requests - **Done**
- Hosting
- Documentation using Postman Docs

Created by Matthew Vardi


