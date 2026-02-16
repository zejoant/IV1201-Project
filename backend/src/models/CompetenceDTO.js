'use strict'

/**
 * Data Transfer Object (DTO) representing a competence or skill.
 *
 * Used to transfer competence data between the database layer and
 * other parts of the application without exposing the full model.
 *
 * @class CompetenceDTO
 */
class CompetenceDTO {

    /**
    * Creates a CompetenceDTO instance.
    *
    * @param {number} competence_id - Unique ID of the competence.
    * @param {string} name - Name of the competence.
    */
    constructor(competence_id, name) {
        this.competence_id = competence_id;
        this.name = name;
    }

}

module.exports = CompetenceDTO;