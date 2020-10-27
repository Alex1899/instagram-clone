
export const initialState = {
    user: null,
    userId: null,
    avatar: null
}

export function reducer(state=initialState, action ){
    switch(action.type){
        case "LOGIN_USER":
            return {
                ...state,
                user: action.payload.username,
                userId: action.payload.userId,
                avatar: action.payload.avatar
            }
        case "LOGOUT_USER":
            return {
                ...state,
                user: null,
                userId: null,
                avatar: null
            }
        case "UPDATE_AVATAR":
            return {
                ...state,
                avatar: action.payload.avatar
            }
        default:
            return state;
    }
        

}