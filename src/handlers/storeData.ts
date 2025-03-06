import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {fromEnv} from "@aws-sdk/credential-providers";
import * as dotenv from "dotenv";

dotenv.config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

const DATA_TABLE = "StarWarsCustomData";

export const storeData = async (event) => {
    try {
        const requestData = JSON.parse(event.body);

        const params = {
            TableName: DATA_TABLE,
            Item: {
                id: Date.now().toString(),
                ...requestData,
            },
        };

        await dynamoDB.send(new PutCommand(params));

        return {
            statusCode: 201,
            body: JSON.stringify({message: "Data stored successfully!", data: requestData}),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to store data", details: error.message}),
        };
    }
};
