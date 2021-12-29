import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import User from "../entities/user";

/**
 * Service allowing to save (an track changes of) user information in chrome local/sync storage.
 */
@Injectable()
export class UserService {
    private static EMPTY_USER: User = {
        firstname: "",
        lastname: ""
    };

    private userSubject = new BehaviorSubject<User>(UserService.EMPTY_USER);

    /**
     * Save the user in chrome's sync storage.
     *
     * @param {User} user User's data to save.
     * @returns {Promise<void>} An empty promise resolving when user data is correctly saved.
     */
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

    /**
     * Get the user data from chrome's sync storage (if it exists).
     *
     * @returns {Promise<User | undefined>} An promise resolving with the user data if it exists, with undefined otherwise.
     */
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

    /**
     * Remove the user data from chrome's sync storage.
     *
     * @returns {Promise<void>} An empty promise resolving when user data is correctly removed.
     */
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

    /**
     * Get user's data wrapper in an observable object.
     * @returns {Observable<User>} An observable of user's data.
     */
    getObservableUser(): Observable<User> {
        return this.userSubject.asObservable();
    }
}
