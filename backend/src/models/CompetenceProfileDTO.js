'use strict'

/**
 * Data Transfer Object (DTO) representing a person's competence profile.
 *
 * Used to transfer competence profile data between the database layer
 * and other parts of the application without exposing the full model.
 *
 * @class CompetenceProfileDTO
 */
class CompetenceProfileDTO {

    /**
     * Creates a CompetenceProfileDTO instance.
     *
     * @param {number} competence_profile_id - Unique ID of the competence profile entry.
     * @param {number} person_id - ID of the person this profile belongs to.
     * @param {number} competence_id - ID of the associated competence/skill.
     * @param {number} years_of_experience - Years of experience in the competence.
     */
    constructor(competence_profile_id, person_id, competence_id, years_of_experience) {
        this.competence_profile_id = competence_profile_id;
        this.person_id = person_id;
        this.competence_id = competence_id;
        this.years_of_experience = years_of_experience;
    }

}

module.exports = CompetenceProfileDTO;