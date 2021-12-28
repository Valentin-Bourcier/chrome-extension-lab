import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.css"]
})
export class SigninComponent {
    signinForm = new FormGroup({
        firstname: new FormControl("", [Validators.required, Validators.minLength(2)]),
        lastname: new FormControl("", [Validators.required, Validators.minLength(2)])
    });

    constructor(private service: UserService) {}

    get ctrls() {
        return this.signinForm.controls;
    }

    onSubmit() {
        if (this.signinForm.valid) {
            this.service.setUser(this.signinForm.value);
            this.signinForm.reset();
        } else {
            console.error("Invalid value in signin form: " + this.signinForm.value);
        }
    }
}
