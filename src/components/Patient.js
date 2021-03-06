import React, {Component} from "react"
import {Button, ButtonGroup, Form} from "react-bootstrap"
import PatientService from "../services/PatientService"
import Comments from "./Comments"
import Exception from "./Exception";


export default class Patient extends Component {

    constructor(props) {
        super(props)

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleSexChange = this.handleSexChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleAddressChange = this.handleAddressChange.bind(this)

        this.editCurrentPatient = this.editCurrentPatient.bind(this)
        this.delete = this.delete.bind(this)
        this.cancelPatientEditing = this.cancelPatientEditing.bind(this)
        this.confirmPatientEditing = this.confirmPatientEditing.bind(this)
        this.setErrorMessage = this.setErrorMessage.bind(this)

        this.state = {
            updatingPatient: false,
            currentPatient: props.currentPatient,
            patientId: props.currentPatient.id
        }

    }

    editCurrentPatient() {
        this.setState({
            updatingPatient: true,
            message: null
        })
    }

    cancelPatientEditing() {
        this.setState({
            currentPatient: null,
            updatingPatient: false,
            message: null
        }, () => {
            PatientService.findById(this.state.patientId)
                .then((response) => {
                    this.setState({
                        currentPatient: response.data
                    })
                })
        })

    }

    confirmPatientEditing() {
        this.state.currentPatient.fullName = this.state.currentPatient.fullName.trim()
        this.state.currentPatient.address = this.state.currentPatient.address.trim()
        this.state.currentPatient.state = this.state.currentPatient.state.trim()
        this.state.currentPatient.country = this.state.currentPatient.country.trim()

        let toUpdate = true;
        Object.values(this.state.currentPatient).forEach(value => {
            if (value === "") toUpdate = false
        })
        if (toUpdate) {
            PatientService.update(this.state.currentPatient)
                .then((response) => {
                    this.setState({
                        currentPatient: response.data,
                        updatingPatient: false,
                        message: null

                    }, () => {
                        this.props.updateListAfterUpdating()
                    })
                })
                .catch((error) => {
                    this.setErrorMessage("?????????????????? ?????????????? ????????????????!")
                })
        } else {
            this.setErrorMessage("?????????????????? ?????? ????????! ???????? ???? ?????????? ???????? ??????????????!")
        }
    }

    handleNameChange(event) {
        this.state.currentPatient.fullName = event.target.value
        this.setState({
            currentPatient: this.state.currentPatient
        })
    }

    handleDateChange(event) {
        this.state.currentPatient.birthday = event.target.value
        this.setState({
            currentPatient: this.state.currentPatient
        })
    }

    handleSexChange(event) {
        this.state.currentPatient.sex = event.target.value
        this.setState({
            currentPatient: this.state.currentPatient
        })
    }

    handleCountryChange(event) {
        this.state.currentPatient.country = event.target.value
        this.setState({
            currentPatient: this.state.currentPatient
        })
    }

    handleStateChange(event) {
        this.state.currentPatient.state = event.target.value
        this.setState({
            currentPatient: this.state.currentPatient
        })
    }

    handleAddressChange(event) {
        this.state.currentPatient.address = event.target.value
        this.setState({
            currentPatient: this.state.currentPatient
        })
    }

    delete() {
        PatientService.delete(this.state.patientId)
            .then(() => {
                this.setState({
                    currentPatient: null,
                    patientId: null
                }, () => {
                    this.props.updateListAfterDeleting()
                })
            })
            .catch((error) => {
                this.setErrorMessage("?????????????????? ???????????????? ????????????????!")
            })
    }

    setErrorMessage(message) {
        this.setState({message: message})
        setTimeout(() => this.setState({message: null}), 5000)
    }

    render() {
        if (this.props.currentPatient.id !== this.state.patientId && this.state.currentPatient) {
            this.setState({
                patientId: this.props.currentPatient.id,
                currentPatient: this.props.currentPatient
            }, () => {
                if (this.state.updatingPatient)
                    this.cancelPatientEditing()
            })
        }
        return (
            <div>
                {this.state.currentPatient ? (
                    <div>
                        <div className={"small-information"}>
                            {this.state.updatingPatient ? (
                                <ButtonGroup className={"float-right"}>
                                    <Button variant="outline-success" onClick={this.confirmPatientEditing}>
                                        <i className={"fa fa-check"}/>???????????????? </Button>
                                    <Button variant="outline-danger" onClick={this.cancelPatientEditing}>
                                        <i className={"fa fa-times"}/>??????????????????</Button>
                                </ButtonGroup>
                            ) : (
                                <ButtonGroup className={"float-right"}>
                                    <Button variant="outline-primary" onClick={this.editCurrentPatient}>
                                        <i className={"fa fa-pencil"}/>????????????????????</Button>
                                    <Button variant="outline-danger" onClick={this.delete}>
                                        <i className={"fa fa-trash"}/>????????????????</Button>
                                </ButtonGroup>
                            )}
                            <input type="text" value={this.state.currentPatient.fullName}
                                   onChange={this.handleNameChange}
                                   disabled={!this.state.updatingPatient}
                                   className={"form-control"}
                                   style={{width: "325px"}}/>
                        </div>
                        <div className={"flex-container"}>
                            <div className={"detailed-information"}>
                                <Form>
                                    <p>???????? ????????????????????: <input type="date" value={this.state.currentPatient.birthday}
                                                               onChange={this.handleDateChange}
                                                               disabled={!this.state.updatingPatient}
                                                               className={"form-control"}/>
                                    </p>
                                    {!this.state.updatingPatient ? (<p>??????????: {this.state.currentPatient.sex}</p>) : (
                                        <p>??????????:
                                            <select className={"form-select form-control"}
                                                    onChange={this.handleSexChange}
                                                    disabled={!this.state.updatingPatient}>
                                                <option selected disabled>????????????????</option>
                                                <option value="????????????????">????????????????</option>
                                                <option value="????????????">????????????</option>
                                            </select>
                                        </p>
                                    )}

                                    <p>????????????: <input type="text" value={this.state.currentPatient.country}
                                                      disabled={!this.state.updatingPatient}
                                                      onChange={this.handleCountryChange}
                                                      className={"form-control"}/>
                                    </p>
                                    <p>??????????????: <input type="text" value={this.state.currentPatient.state}
                                                       disabled={!this.state.updatingPatient}
                                                       onChange={this.handleStateChange}
                                                       className={"form-control"}/>
                                    </p>
                                    <p>????????????: <input type="text" value={this.state.currentPatient.address}
                                                      disabled={!this.state.updatingPatient}
                                                      onChange={this.handleAddressChange}
                                                      className={"form-control"}/>
                                    </p>
                                </Form>

                                <Exception message={this.state.message}/>
                            </div>
                            <Comments patientId={this.state.patientId} currentPatient={this.state.currentPatient}
                                      setErrorMessage={this.setErrorMessage}/>
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}