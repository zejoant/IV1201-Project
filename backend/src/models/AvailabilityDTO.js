'use strict'

/**
 * Data Transfer Object (DTO) representing a person's availability.
 *
 * Used to transfer availability data between the database layer and
 * other parts of the application without exposing the full model.
 *
 * @class AvailabilityDTO
 */
class AvailabilityDTO {

    /**
     * Creates an AvailabilityDTO instance.
     *
     * @param {number} availability_id - Unique ID of the availability entry.
     * @param {number} person_id - ID of the person this availability belongs to.
     * @param {Date} from_date - Start date of the availability period.
     * @param {Date} to_date - End date of the availability period.
     */
    constructor(availability_id, person_id, from_date, to_date) {
        this.availability_id = availability_id;
        this.person_id = person_id;
        this.from_date = from_date;
        this.to_date = to_date;
    }

}

module.exports = AvailabilityDTO;