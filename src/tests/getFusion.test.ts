import {getFusion} from "../handlers/getFusions";
import {APIGatewayEvent} from "aws-lambda";

test("getFusion should return merged Star Wars and Rick and Morty data", async () => {
    const event = {"pathParameters": {"id": "1"}} as unknown as APIGatewayEvent;
    const response = await getFusion(event);
    expect(response.statusCode).toBe(200);
    const data = JSON.parse(response.body);
    expect(data.starWars).toBeDefined();
    expect(data.relatedRickAndMortyLocation).toBeDefined();
});
