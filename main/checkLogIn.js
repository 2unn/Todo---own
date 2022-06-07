import { getLocalStorage } from "./getLocalStorage.js"
import {inforApi} from "./fetchFunction.js"




export function Auth () {
    const userId = JSON.parse(getLocalStorage('user'))
    
    const userApi = inforApi((list)=> {
        
        if(list.id !== userId || !userId){
            window.location.href = `https://2unn.github.io/Todo---own/validationtest/SignIn.html`
        }

    },userId);   
}