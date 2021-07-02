import React, {Component} from "react"
import PatientService from "../services/PatientService";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../main.css'
import {Button, Form} from "react-bootstrap";
import Patient from "./Patient";
import NewPatient from "./NewPatient";

export default class PatientList extends Component {

    constructor(props) {
        super(props);

        this.findAllPatients = this.findAllPatients.bind(this)
        this.handleChangeForSearch = this.handleChangeForSearch.bind(this)
        this.findAllPatientsByName = this.findAllPatientsByName.bind(this)
        this.updateListAfterDeleting = this.updateListAfterDeleting.bind(this)
        this.updateListAfterCreating = this.updateListAfterCreating.bind(this)
        this.createNewPatient = this.createNewPatient.bind(this)

        this.state = {
            patients: [],
            searchByName: ""
        }

    }

    componentDidMount() {
        this.findAllPatients()
    }

    selectPatient(selectedPatient) {
        this.state.patientId ? document.getElementById(this.state.patientId).classList.remove("selected"):
            document.getElementById(selectedPatient.id).classList.add("selected")

        this.setState({
            currentPatient: selectedPatient,
            patientId: selectedPatient.id,
            creating:false
        }, ()=>{
            document.getElementById(this.state.patientId).classList.add("selected")
        })
    }

    findAllPatients() {
        PatientService.findAll()
            .then((response) => {
                const patients = response.data
                this.setState({
                    patients: patients
                })
            })

    }

    handleChangeForSearch(event) {
        this.setState({
            searchByName: event.target.value
        })
    }

    findAllPatientsByName(event) {
        event.preventDefault()
        PatientService.findAllByName(this.state.searchByName)
            .then((response) => {
                this.setState({
                    patients: response.data
                })
            })
    }

    createNewPatient() {
        if(this.state.patientId)
        document.getElementById(this.state.patientId).classList.remove("selected")
        this.setState({
            currentPatient: null,
            patientId: null,
            creating: !this.state.creating
        })
    }

    updateListAfterCreating(patient, creating) {
        this.findAllPatients()
        this.setState({
            currentPatient: patient,
            patientId: patient.id,
            creating: creating
        })
    }

    updateListAfterDeleting() {
        this.setState({
            currentPatient: null,
            patientId: null
        }, () => {
            this.findAllPatients()
        })
    }

    render() {
        return (
            <div className={"flex-container"}>
                <div className={"patients-container"}>
                    <Form onSubmit={this.findAllPatientsByName} className={"search"}>
                        <div className={"input-group"}>
                            <input type="text" className={"form-control"} placeholder={"Пошук"}
                                   onChange={this.handleChangeForSearch}/>
                            <Button variant={"outline-secondary"} type={"submit"}><i
                                className={"fa fa-search"}/></Button>
                            <Button variant={"outline-primary"} className={"ml-1"}
                                    onClick={this.createNewPatient}>
                                <i className={"fa fa-plus"}/></Button>
                        </div>
                    </Form>
                    <ul>
                        {this.state.patients.map((patient) => (
                            <li className={"patient"} key={patient.id} id={patient.id}
                                onClick={() => this.selectPatient(patient)}>
                                {patient.fullName} <br/>
                                {patient.birthday}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={"information"}>
                    {this.state.currentPatient ? (
                        <Patient currentPatient={this.state.currentPatient}
                                 updateListAfterDeleting={this.updateListAfterDeleting}
                                 updateListAfterUpdating={this.findAllPatients}/>
                    ) : null}
                    {this.state.creating ? (
                        <NewPatient creating={this.state.creating}
                                    updateList={this.updateListAfterCreating}/>
                    ) : null}
                </div>
            </div>
        )
    }
}