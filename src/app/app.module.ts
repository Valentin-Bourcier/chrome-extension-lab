import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { SigninComponent } from "./signin/signin.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { UserService } from "../services/user.service";

@NgModule({
    declarations: [AppComponent, SigninComponent, WelcomeComponent],
    imports: [AppRoutingModule, BrowserModule, ReactiveFormsModule],
    providers: [UserService],
    bootstrap: [AppComponent]
})
export class AppModule {}
