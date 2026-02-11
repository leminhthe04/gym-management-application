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
            console.log(action.payload)
            state.memberFormData = { ...state.memberFormData, ...action.payload };
        },
        resetFormData: (state) => {
            state.memberFormData = { name: "", phone: "" };
        },
        resetKiosk: (state) => {
            state.currentView = "HOME";
            state.memberFormData = { name: "", phone: "" };
        },
        setAllState: (_, action: PayloadAction<KioskState>) => (action.payload),
    
        navigateKiosk: (state, actions: PayloadAction<KioskView>) => {
            state.currentView = actions.payload;
        },
    }
});


export const kioskActions = kioskSlice.actions;
export default kioskSlice.reducer;