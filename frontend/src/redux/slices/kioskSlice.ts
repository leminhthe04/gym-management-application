import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type KioskState, type KioskView } from "@/types/store";



const initialState: KioskState = {
    currentView: "HOME",
    // inputText: "",
    // count: 0,
    memberFormData: {
        name: "",
        phone: "",
    }
};

const kioskSlice = createSlice({
    name: "kiosk",
    initialState,
    reducers: {
        // setInputText: (state, action: PayloadAction<string>) => {
        //     state.inputText = action.payload;
        // },
        // incrementCount: (state) => {
        //     state.count += 1;
        // },
        updateFormData: (state, action: PayloadAction<Partial<KioskState["memberFormData"]>>) => {
            state.memberFormData = { ...state.memberFormData, ...action.payload };
        },
        resetKiosk: () => (initialState),
        setAllState: (_, action: PayloadAction<KioskState>) => (action.payload),
    
        navigateKiosk: (state, actions: PayloadAction<KioskView>) => {
            state.currentView = actions.payload;
        },
    }
});


export const kioskActions = kioskSlice.actions;
export default kioskSlice.reducer;