
export const initialState = {
    user: null
}

export function reducer(state=initialState, action ){
    switch(action.type){
        case "LOGIN_USER":
            return {
                ...state,
                user: action.payload.user
            }
        case "LOGOUT_USER":
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
        

}