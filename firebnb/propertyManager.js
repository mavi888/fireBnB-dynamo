
/*
    Grabs an array of properties straight from DynamoDB and returns a clean list of properties 
    without primaryKey and sortKey
*/ 
module.exports.cleanUpPropertyResults = propertiesFromDynamo => {
    return propertiesFromDynamo.map(prop => {
        return this.cleanUpProperty(prop);
    });
}

module.exports.cleanUpProperty = propertyFromDynamo => {
    return {
        propertyId: propertyFromDynamo.propertyId,
        ownerId: propertyFromDynamo.ownerId,
        city: propertyFromDynamo.city,
        country: propertyFromDynamo.country,
        title: propertyFromDynamo.title,
        description: propertyFromDynamo.description
    }
}

module.exports.createPropertyRecordToSave = propertyDetails => {
    propertyDetails.propertyId = propertyDetails.propertyId;
    propertyDetails.sortKey = 'property';
    propertyDetails.country_city = propertyDetails.country + '_' + propertyDetails.city;
    
    console.log(propertyDetails);
    return propertyDetails;
}

module.exports.createBookingRecordsToSave = bookingDetails => {
    bookingDetails.propertyId = bookingDetails.propertyId;
    bookingDetails.sortKey = bookingDetails.startBookingDate;

    console.log(bookingDetails);
    return bookingDetails;
}

/*
    Grabs an array of bookings straight from DynamoDB and returns a clean list of properties 
    without primaryKey and sortKey
*/ 
module.exports.cleanUpBookingResults = bookingsFromDynamo => {
    return bookingsFromDynamo.map(booking => {
        return this.cleanUpBooking(booking);
    });
}

module.exports.cleanUpBooking = bookingFromDynamo => {
    if (bookingFromDynamo.sortKey == undefined || bookingFromDynamo.sortKey !== 'property') {
        console.log('a')
        console.log(bookingFromDynamo);
        return {
            userId: bookingFromDynamo.userId,
            propertyId: bookingFromDynamo.propertyId,
            startBookingDate: bookingFromDynamo.startBookingDate,
            endBookingDate: bookingFromDynamo.endBookingDate
        }
    }
    
}