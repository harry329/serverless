import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {getUserId} from "../utils";

const TABLE_NAME = process.env.To_Do_Table_Name;
const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const id = uuid.v4();

  //TODO - getUserId and put in item so that we can use get item for user
  // TODO: Implement creating a new TODO item
  //   const authorization = event.headers.Authorization
  //   const split = authorization.split(' ')
  //   const jwtToken = split[1]

    const item = {
        id : id,
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false,
        createdAt: new Date().toISOString(),
        userId: getUserId(event)
    }
   await docClient.put({
      TableName: TABLE_NAME,
      Item: item
  }).promise()

  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify( {
          item: item
      })
  }
}
