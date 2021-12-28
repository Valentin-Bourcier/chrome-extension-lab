import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import User from "src/entities/user";
import { UserService } from "../services/user.service";
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
    title = "Chrome extension lab";

    constructor(private router: Router, private service: UserService) {}

    userSubscription?: Subscription;

    ngOnInit(): void {
        this.service
            .getUser()
            .then((user) => this.redirect(user))
            .catch((error) => console.error(error));

        this.userSubscription = this.service.getObservableUser().subscribe((user) => this.redirect(user));
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    redirect(user: User | undefined) {
        if (user && user.firstname && user.lastname) {
            this.router.navigate(["welcome"]);
        } else {
            this.router.navigate(["signin"]);
        }
    }
}
