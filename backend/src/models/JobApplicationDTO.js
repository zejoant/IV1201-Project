'use strict'

/**
 * Data Transfer Object (DTO) representing a job application.
 *
 * Used to transfer job application data between the database layer
 * and other parts of the application without exposing the full model.
 *
 * @class JobApplicationDTO
 */
class JobApplicationDTO{

     /**
     * Creates a JobApplicationDTO instance.
     *
     * @param {number} job_application_id - Unique ID of the job application.
     * @param {number} person_id - ID of the person who submitted the application.
     * @param {string} status - Current status of the job application.
     */
    constructor(job_application_id, person_id, status){
        this.job_application_id = job_application_id;
        this.person_id = person_id;
        this.status = status;
    }
}

module.exports = JobApplicationDTO;