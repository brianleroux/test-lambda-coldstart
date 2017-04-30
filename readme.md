## test lambda coldstart

AWS Lambda's coldstart is notoriously obscure but consistently slower than a warm executation. The generally accepted technique for mitigation is using keep alive pings on a cloudwatch scheduled function.

Herein you can find a quick hacky test for measuring coldstarts from Python and Node.

### the setup

1. You need to have `.aws/credentials` setup
2. You need to create two lambdas in the aws console: `test-node-hello` and `test-python-hello`
3. Setup an API Gateway deployment with `/node/{proxy+}` and `/python/{proxy+}` pointing at the lambdas above
4. Touch an `.env` file in the root of this directory with the urls to the lambdas

Example `.env`:
```
NODE_ENDPOINT=https://xxx.execute-api.us-east-1.amazonaws.com/production/node/{proxy+}
PYTHON_ENDPOINT=https://xxx.execute-api.us-east-1.amazonaws.com/production/python/{proxy+}

```

5. Run the test suite with `npm start`

### the test

These tests mock a real world scenario: invoking a Lambda via an API Gateway endpoint. This is a very common scenario and really highlights an opportunity for performance improvement. The tests essentially:

1. Upload fresh code to Lambda (this forces a cold start scenario)
2. GET the API Gateway endpoint
