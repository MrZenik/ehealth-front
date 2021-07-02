import React, {Component} from "react";
import {Button, ButtonGroup, Form} from "react-bootstrap";
import MedicalRecordService from "../services/MedicalRecordService";


export default class Comments extends Component {
    constructor(props) {
        super(props);

        this.findAllMedicalRecordsByPatientId = this.findAllMedicalRecordsByPatientId.bind(this)
        this.handleChangeForNewMedicalRecord = this.handleChangeForNewMedicalRecord.bind(this)
        this.saveNewMedicalRecord = this.saveNewMedicalRecord.bind(this)
        this.handleUpdateMedicalRecord = this.handleUpdateMedicalRecord.bind(this)

        this.state = {
            commentUpdating: false,
            medicalRecords: [],
            newComment: "",
            patientId: props.patientId,
            currentPatient: props.currentPatient
        }
    }

    componentDidMount() {
        this.findAllMedicalRecordsByPatientId()
    }

    findAllMedicalRecordsByPatientId() {
        MedicalRecordService.findAll(this.state.patientId)
            .then((response) => {
                this.setState({
                    medicalRecords: response.data
                })
            })
    }

    handleChangeForNewMedicalRecord(event) {
        this.setState({
            newComment: event.target.value
        })
    }

    saveNewMedicalRecord(event) {
        event.preventDefault()
        if (this.state.newComment.trim() !== "") {
            MedicalRecordService.save(this.state.patientId, this.state.newComment)
                .then((response) => {
                    this.setState({
                        medicalRecords: [...this.state.medicalRecords, response.data]
                    })
                })
                .catch((error) => {
                    this.props.setErrorMessage("Щось пішло не так!")
                })
        }else {
            this.props.setErrorMessage("Коментар пустий!")
        }
        this.setState({
            newComment: ""
        })
    }

    deleteMedicalRecord(id, patientId) {
        MedicalRecordService.delete(id, patientId)
            .then(response => {
                console.log(response.data)
                this.findAllMedicalRecordsByPatientId()
            })
            .catch(error => {
                this.props.setErrorMessage("Немає запису з таким айді!")
            })
    }

    handleUpdateMedicalRecord(event) {
        this.setState({
            currentComment: event.target.value
        })
    }

    editMedicalRecord(recordId) {
        MedicalRecordService.findById(recordId, this.state.patientId)
            .then((response) => {
                this.setState({
                    currentComment: response.data.comment,
                    currentRecordId: recordId,
                    commentUpdating: true,
                    medicalRecords: []
                })
            })
            .catch((error) => {
                this.props.setErrorMessage("Такого запису не існує!")
            })
    }

    confirmMedicalRecordUpdating() {
        if (this.state.currentComment.trim() !== "") {
            MedicalRecordService.update(this.state.currentRecordId, this.state.patientId, this.state.currentComment)
                .then((resp) => {
                    this.setState({
                        commentUpdating: false,
                        currentComment: null,
                        currentRecordId: null
                    }, () => {
                        this.findAllMedicalRecordsByPatientId()
                    })
                })
        } else {
            this.props.setErrorMessage("Коментар пустий!")
        }
    }

    cancelMedicalRecordUpdating() {
        this.setState({
            commentUpdating: false
        })
        this.findAllMedicalRecordsByPatientId()
    }

    render() {
        if(this.props.patientId !== this.state.patientId){
            this.setState({
                patientId: this.props.patientId,
                currentPatient: this.props.currentPatient
            }, () => {
                this.findAllMedicalRecordsByPatientId()
            })
        }

        return (
            <div className={"comments"}>
                {this.state.commentUpdating ? (
                    <div className={"comments-text"}>
                        <div className={"small-information"}>
                            <ButtonGroup className={"float-right"}>
                                <Button variant="outline-success"
                                        onClick={this.confirmMedicalRecordUpdating.bind(this)}>
                                    <i className={"fa fa-check"}/> </Button>
                                <Button variant="outline-danger"
                                        onClick={this.cancelMedicalRecordUpdating.bind(this)}>
                                    <i className={"fa fa-times"}/> </Button>
                            </ButtonGroup>
                            <h5>Редагування коментаря</h5>
                        </div>
                        <textarea value={this.state.currentComment} cols="100"
                                  className={"form-control mt-3"}
                                  style={{
                                      width: "90%",
                                      marginLeft: "5%",
                                      height: "70vh",
                                      resize: "none"
                                  }}
                                  onChange={this.handleUpdateMedicalRecord}/>

                    </div>
                ) : (
                    <div>
                        <div className={"comments-text"}>
                            <ul>
                                <h5 className={"record"}>Коментарі </h5>
                                {this.state.medicalRecords.map((record) => (
                                    <li className={"record"} key={record.id}><i>Дата: {record.addedAt}</i>
                                        <ButtonGroup className={"me-2 float-right mt-1"}>
                                            <Button variant="outline-primary"
                                                    onClick={() => this.editMedicalRecord(record.id)}>
                                                <i className={"fa fa-pencil"}/></Button>
                                            <Button variant="outline-danger"
                                                    onClick={() => this.deleteMedicalRecord(record.id, this.state.patientId)}>
                                                <i className={"fa fa-trash"}/></Button>
                                        </ButtonGroup>
                                        <p>{record.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Form onSubmit={this.saveNewMedicalRecord} className={"input-group col-auto"}>
                            <input type={"text"} className={"form-control"}
                                   placeholder={"Додати коментар"}
                                   onChange={this.handleChangeForNewMedicalRecord}
                                   value={this.state.newComment}/>
                            <Button variant={"outline-secondary"} type={"submit"}>Додати</Button>
                        </Form>
                    </div>
                )}
            </div>
        )
    }
}
