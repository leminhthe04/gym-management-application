import { useAppSelector } from "@/redux/hooks";
import type { KioskView } from "@/types/store";
import React from "react";

const KioskHomeScreen = React.lazy(() => import("../screens/KioskHomeScreen"));
const CheckInScreen = React.lazy(() => import("../screens/CheckInScreen"));
const RegisterScreen = React.lazy(() => import("../screens/RegisterScreen"));
const RegisterWalkInScreen = React.lazy(() => import("../screens/RegisterWalkIn"));
const RegisterMemberScreen = React.lazy(() => import("../screens/RegisterMemberScreen"));
const RegisterMember2Screen = React.lazy(() => import("../screens/RegisterMember2Screen"));


const VIEW_COMPONENTS: Record<KioskView, React.ReactNode> = {
  HOME: <KioskHomeScreen />,
  CHECK_IN: <CheckInScreen />,
  REGISTER: <RegisterScreen />,
  REGISTER_WALK_IN: <RegisterWalkInScreen />,
  REGISTER_MEMBER: <RegisterMemberScreen />,
  REGISTER_MEMBER_2: <RegisterMember2Screen />,
};


const SharedKioskUI = () => {
  const currentView = useAppSelector((state) => state.kiosk.currentView);
  const view = VIEW_COMPONENTS[currentView] || <div className="text-red-500">Màn hình không tồn tại</div>;
  
  return view;


  // const count = useAppSelector((state) => state.kiosk.count);
  // const inputText = useAppSelector((state) => state.kiosk.inputText);

  // return (
  //   <div className="flex items-center justify-center h-full bg-slate-100 p-4">
  //     <Card className="w-full max-w-md shadow-lg">
  //       <CardHeader>
  //         <CardTitle className="text-center text-orange-500 text-2xl">
  //           GYM KIOSK SCREEN
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         <div className="text-center p-4 bg-white rounded border">
  //           <p className="text-gray-500">Số lượt tương tác</p>
  //           <h1 className="text-6xl font-bold">{count}</h1>
  //         </div>

  //         <div className="space-y-2">
  //           <label className="text-sm font-medium">Nhập thông tin:</label>
  //           <Input
  //             value={inputText}
  //             onChange={(e) =>
  //               dispatch(kioskActions.setInputText(e.target.value))
  //             }
  //             placeholder="Gõ vào đây, cửa sổ kia sẽ nhảy theo..."
  //           />
  //         </div>

  //         <Button
  //           className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
  //           onClick={() => dispatch(kioskActions.incrementCount())}
  //         >
  //           Tăng biến đếm (+1)
  //         </Button>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );

};

export default SharedKioskUI;
