import * as config from './config.json'
import * as env from './env.json'

const initMaxemaService = () => {
    const { ENDPOINT, USER_DATA } = config
    const { ENV } = env
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
        this.getUserData(userData)
    }
    getUserData(userData) {
        Object.keys(userData).forEach(key => {
            this[key] = window.localStorage.getItem(userData[key])
        })
        this.checkUserEmail()
    }
    checkUserEmail() {
        if(!this?.USER_EMAIL) console.log('mxmGameUserEmail is not defined')
    }
    async sendEvent(eventName, eventValue) {
        try {
            const res = await fetch(this.endpoint, {
                method: 'POST',
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
    }
}

export default initMaxemaService