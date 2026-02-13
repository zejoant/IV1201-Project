'use strict'

class JobApplicationDTO{

    constructor(job_application_id, person_id, status){
        this.job_application_id = job_application_id;
        this.person_id = person_id;
        this.status = status;
    }
}

module.exports = JobApplicationDTO;