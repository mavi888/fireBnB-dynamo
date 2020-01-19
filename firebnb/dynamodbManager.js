'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const INDEX_NAME = process.env.INDEX_NAME;

module.exports.getItem = async (propertyId, sortKey)  => {
    console.log('getItem');
    
    const params = {
      Key: {
        propertyId: propertyId,
        sortKey: sortKey,
      },
      TableName: TABLE_NAME
    };

    console.log(params);
  
    return dynamo.get(params).promise().then(result => {
        console.log(result);
        return result.Item;
    });
};

module.exports.queryTable = async (propertyId) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'propertyId = :HpropertyId',
        ExpressionAttributeValues: {
          ':HpropertyId': propertyId
        }
    };

    return dynamo.query(params).promise().then(result => {
        return result.Items;
    });
}

module.exports.queryIndex = async (primaryKey, primaryKeyName) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: INDEX_NAME,
    KeyConditionExpression: `${primaryKeyName}  = :HprimaryKey`,
    ExpressionAttributeValues: {
      ':HprimaryKey': primaryKey
    }
  };

  return dynamo.query(params).promise().then(result => {
    return result.Items;
  });
}

module.exports.saveItem = item => {
	const params = {
		TableName: TABLE_NAME,
		Item: item
	};

	return dynamo.put(params).promise().then(() => {
			return item;
		});
};