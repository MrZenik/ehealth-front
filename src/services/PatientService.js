import http from "../http-common";

class PatientService {

    findAll() {
        return http.get("/patients");
    }

    findById(id) {
        return http.get("/patients/" + id)
    }

    findAllByName(fullName) {
        return http.get("/patients?name=" + fullName)
    }

    create(fullName, birthday, sex, country, state, address) {

        const patient = {
            "fullName": fullName,
            "birthday": birthday,
            "sex": sex,
            "country": country,
            "state": state,
            "address": address
        }

        return http.post("/patients", patient)
    }

    update(patient) {
        const updatedPatient = {
            "fullName": patient.fullName,
            "birthday": patient.birthday,
            "sex": patient.sex,
            "country": patient.country,
            "state": patient.state,
            "address": patient.address
        }

        return http.put("/patients/" + patient.id, updatedPatient)
    }

    delete(id) {
        return http.delete("/patients/" + id)
    }

}

export default new PatientService();