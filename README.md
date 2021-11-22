## Build a Simple Todo List using DynamoDb, API Gateway, Lambda and Amplify

In this demo, we are building an App that allows you to create a Todo list that can be accessed from the web. This app demonstrates commencting to a DynamoDB backned using API Gateway and Lambda functions

![Todo List Frontend](public/todo-list.png)


## Architecture 

The below diagram shows the architecture of the App - A react front-end utilizes AppSync graphql server to create, read, delete items to a DynamoDB database. We also have an integration with Amazon Rekognition which provides Computer Vision capabilities to detect objects in images that are used as labels to create the shopping list items. 

![Todo List Architecture](public/Todo-Architecture.png)

## Get Started by cloning the repo

`git clone https://github.com/sathishc/todolist`

## Setup the backend using CDK

We will setup the backend which consists of lambda functions to add, list and delete todos, an api gateway, a dynamodb database and cognito user pool and identity pool using the CDK.

The Lambda functions are implemented in nodejs. To make sure the functions are ready to deploy you need to change directory into reach function directory and install the node modules

From the root of the directory run the following commands
```
cd backend

cd functions/addTodo
npm install
cd ../..

cd functions/getAllTodo
npm install
cd ../..

cd functions/deleteTodo
npm install
cd ../..

```

Now deploy the infrastructure.

```
cdk deploy -O ../src/cdk-exports.json
```

## Install the necessary npm packages in the frontend

From the root of the project

```
npm install
```

Now you will have a frontend that includes just the React front-end. We are using React-Material-UI components to style the front-end. This is just boiler plate code without any backend integrations into AWS. In the repo, you fill find the files 'predictions.js' and 'db.js' under src/api folders. We will add code here after deploying the necessary backends using Amplify 

Run `npm start` to see the UI frontend

## Install Amplify CLI, Initialize the project and add necessary libraries

**Install the Amplify CLI globally**

```
npm install -g @aws-amplify/cli
```

**Initialize Amplify in the project from the root folder**

```
amplify init --y
``` 

to initialize the amplify project with default parameters and AWS default profile

Install Amplify javascript libraries needed from within the root folder of the repository

```
npm install --save aws-amplify @aws-amplify/ui-react
```

## Connect the front-end to the backend infrastructure that we deployed

Open the file App.js and add the following to import the necessary components and configure the amplify app.

```
```


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
