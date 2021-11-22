## Build a Simple Todo List using DynamoDb, API Gateway, Lambda and Amplify

In this demo, we are building an App that allows you to create a Todo list that can be accessed from the web. This app demonstrates commencting to a DynamoDB backned using API Gateway and Lambda functions

![Todo List Frontend](public/todo-list.png)


## Architecture 

The below diagram shows the architecture of the App - A react front-end utilizes AppSync graphql server to create, read, delete items to a DynamoDB database. We also have an integration with Amazon Rekognition which provides Computer Vision capabilities to detect objects in images that are used as labels to create the shopping list items. 

![Todo List Architecture](public/Todo-Architecture.png)

## Get Started by cloning the repo

`git clone https://github.com/sathishc/todolist`


## Install the necessary npm packages

`npm install`

Now you will have a frontend that includes just the React front-end. We are using React-Material-UI components to style the front-end. This is just boiler plate code without any backend integrations into AWS. In the repo, you fill find the files 'predictions.js' and 'db.js' under src/api folders. We will add code here after deploying the necessary backends using Amplify 

Run `npm start` to see the UI frontend

## Install Amplify CLI, Initialize the project and add necessary libraries

**Install the Amplify CLI globally**

`npm install -g @aws-amplify/cli`


**Initialize Amplify in the project from the root folder**

`amplify init --y` to initialize the amplify project with default parameters and AWS default profile


## Install Amplify javascript libraries needed from within the root folder of the repository

`npm install --save aws-amplify@4.2.9 @aws-amplify/ui-react@1.2.15`

## Add Authentication

**Add authentication backend to the app using the command**

`amplify add auth`

**Follow the steps below for inputs**

```
Select Default Configuration when asked if you'd like to use the default authentication and security configuration.
   
Select Username when asked how you want users to sign in.
   
Select "No, I am done." when asked about advanced settings.

Run `amplify push` and confirm with a 'Yes' to create these changes in the cloud.

Confirm you want Amplify to make changes in the cloud for you.
```

Wait for the provisioning to complete. This will take a few minutes. The above steps creates an Authentication backend provider using Cognito user and identity pools and connects that with the Amplify project.

**Add authentication front-end**

Open the file index.js and uncomment the below lines to import the necessary components and configure the amplify app.

```
// import { Amplify } from 'aws-amplify';
// import config from './aws-exports';
// import { AmplifyAuthenticator } from '@aws-amplify/ui-react';

// Amplify.configure(config);
```

Replace the `<App />` component in the same file with `<AmplifyAuthenticator><App /></AmplifyAuthenticator>`. 

AmplifyAuthenticator is a React higher-order component that adds sign-in, sign-up features into a React App. Reloading the App should now show you the signup functionality. 

Enable Hub functionality in `src/App.js` by uncommenting the relevant statements. You can do importing the Hub module `import { Hub } from 'aws-amplify';` and listening to signin events using

```javascript
    Hub.listen('auth', (data) => {
        if (data.payload.event === 'signIn') {
        fetchData()
        }
    });
```

Hub is a lightweight implementation of Publisher-Subscriber pattern, and is used to share data between modules and components in your app. Here we are using it to fetch backend data whenever a new sign-in occurs.

Enable sign out functionality in `src/components/Navbar.js` by un-commenting relevant code. We will be doing it by importing the Auth module `import { Auth } from 'aws-amplify';` and then adding `await Auth.signOut();` on click of the logout button.  

## Add the backend database 


## Add the necessary functions


## Add an API to interact with the DB

We will use Amplify to create a REST API using API gateway

**Add the api and backend to the app using the command**

`amplify add api`

**Follow the steps below for inputs**

```
Select REST
Provide API Name:todorestapi

```
The above will ceate the necessary Cloudformation scripts locally to create AppSync GraphQL infrastructure. Edit the Todo Schema and replace the same to ShoppingListItem below. 


To deploy the infrastructure to the backend run

`amplify push`

// Todo

**Integrate the API to front-end**

Now we will have the necessary infrasttucture to integrate our front end code. We will also be able to import the generate graphql queries and mutations for easy integration into AppSync. Since we need to have a way to identify a user with each item, we will also use the Auth library. Import the libraries and add necessary code for integration in api/db.js file.

```javascript
    

```
You should now be able to see the add, list and delete features working in the front end. 


 ## Add Hosting

 Until now we have just provisioned backend and connected from a local front-end. Now we will host the front-end using Amplify.

 Use the command `amplify add hosting` and follow the steps

 ```
 Select Hosting with Amplify Console
 Choose a type Manual deployment
 ```

 After providing the options type `amplify publish`. This step packages the front end and deploys the necessary binaries into a hosted Amplify frontend. The output of this command will be the url where the App is hosted on AWS.

## Cleanup

If you are just trying our Amplify and its features, you may want to cleanup the provisioned resources using

`amplify delete`

The features demonstrated is just the small subset of the various categories available. You may also want to try experimenting with categories like analytics, search and other AI features like translation, chatbots, etc.

Have fun and build on !

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This sample is licensed under the MIT-0 License. See the LICENSE file.
