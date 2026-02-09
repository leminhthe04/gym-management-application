import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Mặc định là localStorage
import authReducer from "@/redux/slices/authSlice";
import kioskReducer from "@/redux/slices/kioskSlice";
import { broadcastMiddleware, initBroadcastListener } from "./middleware/broadcastMiddleware";

// 1. Cấu hình Persist (Chỉ lưu những gì cần thiết)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Chỉ lưu auth vào localStorage, các cái khác F5 là reset
};

const rootReducer = combineReducers({
  auth: authReducer, // Đăng ký authSlice vào store
  // sau này thêm: socket: socketReducer,
  kiosk: kioskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 2. Tạo Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt check serializable để không lỗi với redux-persist
    }).concat(broadcastMiddleware),
});


initBroadcastListener(store);

// 3. Tạo Persistor (Dùng để đồng bộ store với localStorage)
export const persistor = persistStore(store);

// 4. Export Types (Để dùng ở hooks.ts)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;