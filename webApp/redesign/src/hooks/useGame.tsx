import {AnyAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createContext, Dispatch, useContext, useEffect, useMemo, useReducer} from "react";
import randomUsernameGenerator from "random-username-generator";
import {GamePage} from "values/gamePages";

const USERNAME_KEY = "username";

interface GameState {
    guesses: Array<boolean>;
    page: GamePage;
    score: number;
    username: string;
}

const initialState: GameState = {
    guesses: [],
    page: GamePage.RULES,
    score: 0,
    username:
        (typeof window !== "undefined" && localStorage.getItem(USERNAME_KEY)) ||
        randomUsernameGenerator.generate()
};

const slice = createSlice({
    name: "gamePages",
    initialState,
    reducers: {
        setPage: (state: GameState, action: PayloadAction<GamePage>) => {
            const page = action.payload;

            if (page === GamePage.GAME) {
                state.guesses = [];
                state.score = 0;
            }

            state.page = page;
        },
        addGuess: (state: GameState, action: PayloadAction<boolean>) => {
            state.guesses.push(action.payload);
        },
        addScore: (state: GameState, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
        subtractScore: (state: GameState, action: PayloadAction<number>) => {
            state.score = Math.max(state.score - action.payload, 0);
        }
    }
});

type ContextType = {state: GameState; dispatch: Dispatch<AnyAction>};

const GameContext = createContext<ContextType | undefined>(undefined);

export const GameProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(slice.reducer, initialState);

    const value = useMemo(() => ({state, dispatch}), [state]);

    useEffect(() => {
        localStorage.setItem(USERNAME_KEY, state.username);
    }, [state.username]);

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): [ContextType, typeof slice.actions] => {
    const context = useContext(GameContext);

    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }

    return [context, slice.actions];
};
