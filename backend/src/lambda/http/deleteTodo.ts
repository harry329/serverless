import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import  * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.To_Do_Table_Name;
const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

    await docClient.delete({
        TableName: TABLE_NAME,
        Key: {
          "id" : todoId
        }
    }).promise()

  // TODO: Remove a TODO item by id
  return {
      statusCode: 200,
      body: JSON.stringify(''),
      headers : {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
      }
  }
}

