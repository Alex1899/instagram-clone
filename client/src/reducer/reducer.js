
export const initialState = {
    user: null,
    userId: null
}

export function reducer(state=initialState, action ){
    switch(action.type){
        case "LOGIN_USER":
            return {
                ...state,
                user: action.payload.username,
                userId: action.payload.userId
            }
        case "LOGOUT_USER":
            return {
                ...state,
                user: null,
                userId: null
            }
        default:
            return state;
    }
        

}