import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type KioskState, type KioskView } from "@/types/store";
import { kioskService } from "@/services/kioskService";


const initialState: KioskState = {
    currentView: "HOME",
    // inputText: "",
    // count: 0,
    memberFormData: {
        name: "",
        phone: "",
        faceImg: null,
    },

    registerStatus: "IDLE",
    registerError: null,
};


export const registerMember = createAsyncThunk(
    "kiosk/registerMember",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { kiosk: KioskState };
            const { name, phone, faceImg } = state.kiosk.memberFormData;

            if (!name)
                throw new Error("Name is required");

            if (!faceImg)
                throw new Error("Face image is requied");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", phone || "");
            formData.append("faceImage", kioskService.dataURL2Blob(faceImg), "face.jpg");

            const response = await kioskService.registerMember(formData);
            return response;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);





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
            console.log(state.memberFormData);
        },
        resetFormData: (state) => {
            state.memberFormData = { name: "", phone: "", faceImg: null, };
        },
        resetAll: () => initialState,
        setAllState: (_, action: PayloadAction<KioskState>) => (action.payload),
    
        navigateKiosk: (state, actions: PayloadAction<KioskView>) => {
            state.currentView = actions.payload;
        },

        resetRegisterState: (state) => {
            state.registerStatus = "IDLE";
            state.registerError = null;
        }
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(registerMember.pending, (state) => {
                state.registerStatus = "LOADING";
                state.registerError = null;
            })
            .addCase(registerMember.fulfilled, (state) => {
                state.registerStatus = "SUCCEEDED";
                state.registerError = null;
            })
            .addCase(registerMember.rejected, (state, action) => {
                state.registerStatus = "FAILED";
                state.registerError = action.payload as string || "Failed to register member";
            });
    },
});


export const kioskActions = kioskSlice.actions;
export default kioskSlice.reducer;