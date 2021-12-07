/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { useEffect, useState } from 'react';
import './App.css';

import { getUserItems, deleteItem, addItem } from './api/db'
import TableCard from './components/TableCard'
import NavBar from './components/NavBar'
import AddItemCard from './components/AddItemCard'
import { Grid } from '@material-ui/core'

// import Amplift and Hub
import { Amplify, Hub } from 'aws-amplify';
// Retrieve confirguation info from aws-exports and cdk-exports
import config from './aws-exports';
import { BackendStack } from "./cdk-exports.json"

// import the Authenticator and ui for react
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// setup configurations
const cdkConfig = {
  API: {
    endpoints: [
      {
        name: BackendStack.apiname,
        endpoint: BackendStack.apiendpoint
      }
    ]
  }, 
  aws_cognito_region: BackendStack.awscognitoregion,
  aws_user_pools_id:  BackendStack.userpool,
  aws_user_pools_web_client_id: BackendStack.webclientid,
  aws_cognito_identity_pool_id: BackendStack.identitypool,
}

Amplify.configure(config);
Amplify.configure(cdkConfig);

function App() {

  const [items, setItems] = useState([])

  useEffect(() => {
    fetchData()

  }, [])

  async function fetchData() {
    setItems(await getUserItems())
  }
  
  // use the Hub to remspond toe events
  Hub.listen('auth', (data) => {
    if (data.payload.event === 'signIn') {
      fetchData()
    } else if (data.payload.event === 'signOut') {
      window.location.reload();
    }
  });

  return (
    // Wrap the code with authenticator, emnable email as an additional attribute
    <Authenticator signUpAttributes={[
      'email',
    ]}>
    {() => (  
    <div className="app">
      <NavBar/>
      
      <div className="content">
        <Grid container spacing={3}>
        
            <AddItemCard 
              addAction = {
                async (itemName) => {
                  const response = await addItem(itemName)
                  
                  if (response){
                    setItems([...items, response])  
                  }
                }
              }     
            />
            
           <TableCard 
              data={items}
              removeAction={async (id)=>{
                const response = await deleteItem(id)
                if (response) {
                  setItems(items.filter(item => item.id !== id))  
                }
              }}
            />
        </Grid>
      </div>
    </div>
    )}
    </Authenticator>
  );
}

export default App;