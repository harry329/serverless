import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.To_Do_Table_Name;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const item = await getItem(todoId)
    if(!!!item){
      return {
          statusCode: 404,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify('Item doesnot exist')
      }
    }
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await docClient.update( {
        TableName: TABLE_NAME,
        Key : {
          id: todoId
        },
        UpdateExpression : "set #name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeNames:{
            "#name":"name"
        },
        ExpressionAttributeValues : {
            ":name" : updatedTodo.name,
            ":dueDate" : updatedTodo.dueDate,
            ":done" : updatedTodo.done
        }
    }).promise()

  return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify('')

  }
}

async function getItem(todoId : String) {
  const result = await docClient.get({
      TableName: TABLE_NAME,
      Key : {
        id: todoId
      }
  }).promise();
  return result.Item;
}
