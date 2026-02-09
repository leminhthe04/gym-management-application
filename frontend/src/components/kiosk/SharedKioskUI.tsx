import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";

const SharedKioskUI = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.kiosk.count);
  const inputText = useAppSelector((state) => state.kiosk.inputText);

  return (
    <div className="flex items-center justify-center h-full bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-orange-500 text-2xl">
            GYM KIOSK SCREEN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-white rounded border">
            <p className="text-gray-500">Số lượt tương tác</p>
            <h1 className="text-6xl font-bold">{count}</h1>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nhập thông tin:</label>
            <Input
              value={inputText}
              onChange={(e) =>
                dispatch(kioskActions.setInputText(e.target.value))
              }
              placeholder="Gõ vào đây, cửa sổ kia sẽ nhảy theo..."
            />
          </div>

          <Button
            className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => dispatch(kioskActions.incrementCount())}
          >
            Tăng biến đếm (+1)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedKioskUI;
