import { SQS } from 'aws-sdk';

export const getNotificationMessage =
  (awsEndPoint: string, queueName: string) =>
  async (customerReferenceId: string) => {
    const sqs = new SQS({ endpoint: awsEndPoint });
    const receiveMessageParams = {
      QueueUrl: `${awsEndPoint}/000000000000/${queueName}`,
      MaxNumberOfMessages: 10,
    };
    const data = await sqs.receiveMessage(receiveMessageParams).promise();
    if (!data.Messages || data.Messages.length === 0)
      return getNotificationMessage(
        awsEndPoint,
        queueName,
      )(customerReferenceId);
    const message = data.Messages.find((message) => {
      const messageBody = JSON.parse(message.Body);
      const kyc = JSON.parse(messageBody.Message);
      return kyc.customerReferenceId === customerReferenceId;
    });
    if (!message)
      return getNotificationMessage(
        awsEndPoint,
        queueName,
      )(customerReferenceId);
    const { ReceiptHandle } = message;
    const kyc = JSON.parse(JSON.parse(message.Body).Message);
    const deleteMessageParams = {
      QueueUrl: `${awsEndPoint}/000000000000/${queueName}`,
      ReceiptHandle,
    };
    await sqs.deleteMessage(deleteMessageParams).promise();
    return kyc;
  };
