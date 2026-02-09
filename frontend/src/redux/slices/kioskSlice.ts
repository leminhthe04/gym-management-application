import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type KioskState } from "@/types/store";


const initialState: KioskState = {
    inputText: "",
    count: 0,
};

const kioskSlice = createSlice({
    name: "kiosk",
    initialState,
    reducers: {
        setInputText: (state, action: PayloadAction<string>) => {
            state.inputText = action.payload;
        },
        incrementCount: (state) => {
            state.count += 1;
        },
        resetKiosk: () => (initialState),
        setAllState: (state, action: PayloadAction<KioskState>) => (action.payload),
    }
});


export const kioskActions = kioskSlice.actions;
export default kioskSlice.reducer;