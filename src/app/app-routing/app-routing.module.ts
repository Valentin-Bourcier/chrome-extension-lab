import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SigninComponent } from "../signin/signin.component";
import { WelcomeComponent } from "../welcome/welcome.component";

const routes: Routes = [
    {
        path: "signin",
        component: SigninComponent
    },
    {
        path: "welcome",
        component: WelcomeComponent
    }
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
