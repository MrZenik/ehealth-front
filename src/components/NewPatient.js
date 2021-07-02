import React, {Component} from "react";
import {Button, ButtonGroup, Form} from "react-bootstrap";
import PatientService from "../services/PatientService";
import Exception from "./Exception";

export default class NewPatient extends Component {

    constructor(props) {
        super(props);

        this.handleSexChange = this.handleSexChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)

        this.state = {
            fullName: "",
            date: "",
            sex: "",
            country: "",
            state: "",
            address: "",
            creating: props.creating
        }
    }

    handleSexChange(event) {
        this.setState({
            sex: event.target.value
        })
    }

    handleDateChange(event) {
        this.setState({
            date: event.target.value
        })
    }

    handleCountryChange(event) {
        this.setState({
            country: event.target.value
        })
    }

    handleStateChange(event) {
        this.setState({
            state: event.target.value
        })
    }

    handleAddressChange(event) {
        this.setState({
            address: event.target.value
        })
    }

    handleNameChange(event) {
        this.setState({
            fullName: event.target.value
        })
    }

    confirm() {
        if (this.state.fullName.trim() !== "" && this.state.date.trim() !== "" && this.state.sex.trim() !== "" &&
            this.state.country.trim() !== "" && this.state.state.trim() !== "" && this.state.address.trim() !== "") {

            PatientService.create(this.state.fullName, this.state.date, this.state.sex,
                this.state.country, this.state.state, this.state.address)
                .then((response) => {
                    this.setState({
                        currentPatient: response.data,
                        creating: false
                    }, () => {
                        this.props.updateList(response.data, false)
                    })
                })
        }else {
            this.setState({message: "Заповніть всі поля!Вони не можуть бути пустими!"})
            setTimeout(() => this.setState({message: null}), 5000)
        }
    }

    cancel() {
        this.setState({
            creating: false
        })
    }

    render() {
        return (
            <div>
                {this.state.creating ? (
                    <div className={"detailed-information"}>
                        <div className={"small-information"}>
                            <h5>Додати нового пацієнта</h5>
                        </div>
                        <div>
                            <Form>
                                <p>Повне ім'я: <input type="text" className={"form-control"}
                                                      onChange={this.handleNameChange}/>
                                </p>
                                <p>Дата народження: <input type="date" className={"form-control"}
                                                           onChange={this.handleDateChange}/>
                                </p>
                                <p>Стать:
                                    <select className={"form-select form-control"} onChange={this.handleSexChange}>
                                        <option selected disabled>Виберіть</option>
                                        <option value="Чоловіча">Чоловіча</option>
                                        <option value="Жіноча">Жіноча</option>
                                    </select>
                                </p>
                                <p>Країна: <input type="text" className={"form-control"}
                                                  onChange={this.handleCountryChange}/>
                                </p>
                                <p>Область: <input type="text" className={"form-control"}
                                                   onChange={this.handleStateChange}/>
                                </p>
                                <p>Адреса: <input type="text" className={"form-control"}
                                                  onChange={this.handleAddressChange}/>
                                </p>
                                <ButtonGroup className={"ml-3"}>
                                    <Button variant="outline-success" onClick={this.confirm.bind(this)}>
                                        <i className={"fa fa-check"}/>Зберегти</Button>
                                    <Button variant="outline-danger" onClick={this.cancel.bind(this)}>
                                        <i className={"fa fa-times"}/>Відмінити</Button>
                                </ButtonGroup>
                                <Exception message={this.state.message}/>
                            </Form>
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}