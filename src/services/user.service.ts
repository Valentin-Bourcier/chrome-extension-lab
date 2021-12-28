import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import User from "../entities/user";

@Injectable()
export class UserService {
    private static EMPTY_USER: User = {
        firstname: "",
        lastname: ""
    };

    private userSubject = new BehaviorSubject<User>(UserService.EMPTY_USER);

    setUser(user: User): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set({ user: user }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
        return promise.then(() => this.userSubject.next(user));
    }

    getUser(): Promise<User | undefined> {
        return new Promise<User>((resolve, reject) => {
            chrome.storage.sync.get(["user"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(result["user"]);
            });
        });
    }

    clearUser(): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            chrome.storage.sync.remove(["user"], () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
        return promise.then(() => this.userSubject.next(UserService.EMPTY_USER));
    }

    getObservableUser(): Observable<User> {
        return this.userSubject.asObservable();
    }
}
