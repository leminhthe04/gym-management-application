import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";

const Back2HomeButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      onClick={() => { 
        dispatch(kioskActions.navigateKiosk("HOME"));  
        dispatch(kioskActions.resetFormData());
      }}
    >
      Trang chủ
    </Button>
  );
};

export default Back2HomeButton;
