import http from "../http-common";

class MedicalRecordService {

    findAll(patientId) {
        return http.get("/medical-records?patientId=" + patientId);
    }

    findById(id, patientId) {
        return http.get("/medical-records/" + id + "?patientId=" + patientId)
    }

    save(patientId, comment) {

        const medicalRecord = {
            "patientId" : patientId,
            "comment" : comment
        }

        return http.post("/medical-records", medicalRecord)
    }

    update(id, patientId, comment) {
        const medicalRecord = {
            "patientId" : patientId,
            "comment" : comment
        }
        return http.put("/medical-records/" + id, medicalRecord)
    }

    delete(id, patientId) {
        return http.delete("/medical-records/" + id + "?patientId=" + patientId)
    }

}

export default new MedicalRecordService();