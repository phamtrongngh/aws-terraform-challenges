import json
import time

def lambda_handler(event, context):
    for record in event['Records']:
        message_body = record['body']
        print(f"Received message: {message_body}")
        
        # Simulate FAIL message processing
        if "FAIL" in message_body:
            raise Exception("Processing failed for message")
        
        # Simulate TIMEOUT message processing
        if "TIMEOUT" in message_body:
            time.sleep(20)
        
    return {
        'statusCode': 200,
        'body': json.dumps('Processed messages successfully!')
    }