import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS from 'aws-sdk'
import {getUserId} from "../utils";

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.To_Do_Table_Name;
const User_Id_Index = process.env.User_Id_Index;


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    const userId = getUserId(event)
    const result = await docClient.query({
        TableName: TABLE_NAME,
        IndexName: User_Id_Index,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId' : userId
        }
    }).promise();

    if (result.Count !== 0){
        return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            item: result.Items
        })
        }
    }

    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: ''
    }


}
