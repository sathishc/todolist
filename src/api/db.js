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

import { API } from 'aws-amplify'

// This function is called immediately when the page loads, before populating the table with this data
export async function getUserItems() {
    return []
}

// This function is called when a user clicks the button 'Add'
export async function addItem(itemName) {
    
    const apiName = 'todolist-todoApi';
    const path = '/todos'; 
    const myInit = { // OPTIONAL   
        body: {  // OPTIONAL
            "name": itemName,
        },
    };

    console.log("Adding item ", myInit);
    console.log("Endpoint ",API.endpoint);
    API
        .put(apiName, path, myInit)
        .then(response => {
            // Add your code here
            console.log(response)
        })
        .catch(error => {
            console.log(error.response);
        });

}

// This function is called when a user deletes an existing item in the table
export async function deleteItem(itemId) {
    
}