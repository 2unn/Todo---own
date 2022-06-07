import { getLocalStorage } from "./getLocalStorage.js"
import {inforApi} from "./fetchFunction.js"




export function Auth () {
    const userId = JSON.parse(getLocalStorage('user'))
    
    const userApi = inforApi((list)=> {
        
        if(list.id !== userId || !userId){
            window.location.href = `http://127.0.0.1:5501/validationtest/SignIn.html`
        }

    },userId);   
}