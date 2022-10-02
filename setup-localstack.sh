#!/bin/bash

export AWS_PAGER=''
export AWS_ACCESS_KEY_ID=any
export AWS_SECRET_ACCESS_KEY=any
AWS_REGION=us-east-1
AWS_URL=http://localhost:4566
NOTIFICATION_ENDPOINT=https://envs4x42e7fgmcy.m.pipedream.net/

aws dynamodb create-table --table-name kyc-dev \
--attribute-definitions AttributeName=id,AttributeType=S AttributeName=customerReferenceId,AttributeType=S \
--key-schema AttributeName=id,KeyType=HASH \
--billing-mode PAY_PER_REQUEST --endpoint-url ${AWS_URL} --region ${AWS_REGION} \
--global-secondary-indexes "IndexName=CustomerIndex,\
KeySchema=[{AttributeName=customerReferenceId,KeyType=HASH}],Projection={ProjectionType=ALL}"

aws sns create-topic --name kyc-dev-create-topic --endpoint-url ${AWS_URL} --region ${AWS_REGION}
aws sns subscribe --endpoint-url ${AWS_URL} --topic-arn arn:aws:sns:${AWS_REGION}:000000000000:kyc-dev-create-topic --notification-endpoint ${NOTIFICATION_ENDPOINT} --protocol http --region ${AWS_REGION}
