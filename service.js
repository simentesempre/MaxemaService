import { ENDPOINT, USER_DATA } from './config.js'
import ENV from './env.js'

/*
* TO USE IN CONSTRUCT 3 main.js
*
* import { initMaxemaService } from "./service.js";
*
* runOnStartup(async runtime =>
* {
* 	initMaxemaService();
* }); 
*
*/

export const initMaxemaService = () => {
    const endpoints = {
        dev: ENDPOINT.STAGE,
        stage: ENDPOINT.STAGE,
        prod: ENDPOINT.PROD
    }
    window.MaxemaService = new MaxemaService(endpoints[ENV], USER_DATA)
}

class MaxemaService {
    constructor(endpoint, userData) {
        this.endpoint = endpoint
        this.userData = userData
        this.userError = "mxmGameUserEmail storage has not been found"
        this.getUserData(userData)
    }
    getUserData(userData) {
        Object.keys(userData).forEach(key => {
            this[key] = window.localStorage.getItem(userData[key])
        })
        if (this.checkUserEmail()) console.error(this.userError)
    }
    checkUserEmail() {
        return Boolean(!this?.USER_EMAIL)
    }
    async sendEvent(eventName, eventValue) {
        if (this.checkUserEmail()) {
            try {
                const res = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: this.USER_EMAIL,
                        event: eventName,
                        value: eventValue
                    })
                })
                return await res.json()
            } catch(error) {
                return Promise.reject(error)
            }
        } else {
            return Promise.reject(this.userError)
        }
    }
}