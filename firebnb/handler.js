'use strict';

const dynamodbManager = require('./dynamodbManager');
const propertyManager = require('./propertyManager');

/* 
  With one search in the database we can get all the properties for this location
 */
module.exports.searchByLocation = async (event) => {
  console.log('searchByLocation');

  const primaryKey = event.queryStringParameters.country + '_' + event.queryStringParameters.city;
  const propertiesFromDynamoDB = await dynamodbManager.queryIndex(primaryKey, 'country_city');
  const properties = propertyManager.cleanUpPropertyResults(propertiesFromDynamoDB);

  return {
    statusCode: 200,
    body: JSON.stringify(properties),
    headers: {}
  }
}

/* 
  With one search in the database we get the property info
 */
module.exports.getProperty = async (event) => {
  console.log('getProperty');

  const primaryKey = event.queryStringParameters.propertyId;
  const sortKey = 'property';
  const propertyFromDynamo = await dynamodbManager.getItem(primaryKey, sortKey);
  const property = propertyManager.cleanUpProperty(propertyFromDynamo);
  
  return {
    statusCode: 200,
    body: JSON.stringify(property),
    headers: {}
  }
}

/* 
  With one search in the database we get all the properties for an owner
 */
module.exports.getPropertiesForOwner = async (event) => {
  console.log('getPropertiesForOwner');

  const ownerId = event.queryStringParameters.ownerId;
  const propertiesFromDynamoDB = await dynamodbManager.queryIndex(ownerId, 'ownerId');
  const properties = propertyManager.cleanUpPropertyResults(propertiesFromDynamoDB);

  return {
    statusCode: 200,
    body: JSON.stringify(properties),
    headers: {}
  }
}

/* 
  This will do a transactional write in the database of 3 records.
  This will create all the necesary duplicated data for keeping the data in sync
 */
module.exports.addNewProperty = async (event) => {
  console.log('addNewProperty');

  const propertyDetails = JSON.parse(event.body);
  const propertyRecordToSave = propertyManager.createPropertyRecordToSave(propertyDetails);
  const result = await dynamodbManager.saveItem(propertyRecordToSave);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {}
  }
}

/* 
  This will do a transactional write in the database of 2 records.
  This will create all the necesary duplicated data for keeping the data in sync
 */
module.exports.bookProperty = async (event) => {
  console.log('bookProperty');

  const booking = {
    userId: event.queryStringParameters.userId,
    propertyId: event.queryStringParameters.propertyId,
    startBookingDate: event.queryStringParameters.startBookingDate,
    endBookingDate: event.queryStringParameters.endBookingDate
  }

  const bookingRecordsToSave = propertyManager.createBookingRecordsToSave(booking);
  const result = await dynamodbManager.saveItem(bookingRecordsToSave);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {}
  }
}

/* 
  With one search in the database we get all the booked dates for a property
 */
module.exports.getBookedDatesProperty = async (event) => {
  console.log('getBookedDatesProperty');

  const propertyId = event.queryStringParameters.propertyId;
  const bookedDatesFromDynamoDB = await dynamodbManager.queryTable(propertyId, 'propertyId');
  const bookedDates = propertyManager.cleanUpBookingResults(bookedDatesFromDynamoDB);

  return {
    statusCode: 200,
    body: JSON.stringify(bookedDates),
    headers: {}
  }
}

/* 
  With one search in the database we get all the booked dates for an user
 */
module.exports.getBookedPropertiesForUsers = async (event) => {
  console.log('getBookedPropertiesForUsers');

  const userId = event.queryStringParameters.userId;
  const bookedPropertiesForUserFromDynamoDB = await dynamodbManager.queryIndex(userId, 'userId');
  const bookedProperties = propertyManager.cleanUpBookingResults(bookedPropertiesForUserFromDynamoDB);

  return {
    statusCode: 200,
    body: JSON.stringify(bookedProperties),
    headers: {}
  }
}