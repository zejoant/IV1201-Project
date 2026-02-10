'use strict'

class AvailabilityDTO{

constructor(availability_id, person_id, from_date, to_date){
    this.availability_id = availability_id;
    this.person_id = person_id;
    this.from_date = from_date;
    this.to_date = to_date;
    }

}

module.exports = AvailabilityDTO;