import { Component, OnInit } from "@angular/core";
import User from "src/entities/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: "app-welcome",
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.css"]
})
export class WelcomeComponent implements OnInit {
    user?: User;

    constructor(private service: UserService) {}

    ngOnInit(): void {
        this.service
            .getUser()
            .then((user) => (this.user = user))
            .catch((error) => console.error(error));
    }

    onSignOut() {
        this.service.clearUser().catch((error) => console.error(error));
    }
}
