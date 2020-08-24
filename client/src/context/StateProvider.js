import React, { createContext, useContext, useReducer, useEffect } from 'react';

export const StateContext = createContext();

function StateProvider({reducer, initialState, children}) {
    const [ state, dispatch ] = useReducer(reducer, initialState, () => {
        const appState = localStorage.getItem('ig-state');
        return appState ? JSON.parse(appState): initialState;
    })

    useEffect(()=>{
        localStorage.setItem('ig-state', JSON.stringify(state));
    }, [state]);

    return (
        <StateContext.Provider value={{state, dispatch}}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateValue = () => useContext(StateContext);

export default StateProvider;
