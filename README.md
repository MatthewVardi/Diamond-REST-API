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
	- See all diamonds reserved by a particular user
	- Update diamond model to have reserved field: y/n
	- Limit on how much you can reserve per user
	- refrence to the user when listing all diamonds reserved - **Done**
- Seed the DB with Diamonds
- Update responses with valid URL's for further requests
- Hosting
- Documentation using Postman Docs

Created by Matthew Vardi


