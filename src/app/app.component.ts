import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    title = "chrome-extension-lab";

    signinForm = new FormGroup({
        firstname: new FormControl("", [
            Validators.required,
            Validators.minLength(2)
        ]),
        lastname: new FormControl("", [
            Validators.required,
            Validators.minLength(2)
        ])
    });

    get ctrls() {
        return this.signinForm.controls;
    }

    ngOnInit(): void {}

    onSubmit() {
        const firstname = this.signinForm.value.firstname;
        const lastname = this.signinForm.value.lastname;
    }
}
