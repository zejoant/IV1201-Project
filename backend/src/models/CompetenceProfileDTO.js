'use strict'

class CompetenceProfileDTO{

constructor(competence_profile_id, person_id, competence_id, years_of_experience){
    this.competence_profile_id = competence_profile_id;
    this.person_id = person_id;
    this.competence_id = competence_id;
    this.years_of_experience = years_of_experience;
    }

}

module.exports = CompetenceProfileDTO;