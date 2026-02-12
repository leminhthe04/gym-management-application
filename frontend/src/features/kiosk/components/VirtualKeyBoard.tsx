import React, { use, useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";

interface VirtualKeyBoardProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentClassName: string;
  keyboardRef: React.RefObject<any>;
  layoutType: "default" | "numbers";
  onChange: (input: string) => void;
  inputName: string;
}

const VirtualKeyBoard = ({
  containerRef,
  parentClassName,
  keyboardRef,
  layoutType,
  onChange,
  inputName,
}: VirtualKeyBoardProps) => {

const [internalLayout, setInternalLayout] = useState<string>("default");

  const [isCaps, setIsCaps] = useState<boolean>(false);

  const lastShiftPress = useRef<number>(0);


  useEffect(() => {
    setInternalLayout("default");
    setIsCaps(false);
  }, [layoutType, inputName]);

  const handleShift = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (isCaps) {
      setIsCaps(false);
      setInternalLayout("default");
      lastShiftPress.current = 0;
      return;
    }

    if (now - lastShiftPress.current < DOUBLE_TAP_DELAY) {
      setIsCaps(true);
      setInternalLayout("shift");
    } else {
      setInternalLayout((prev) => (prev === "default" ? "shift" : "default"));
    }

    lastShiftPress.current = now;
  }

  const onKeyPress = (button: string) => {
    if (button === "{shift}") {
      handleShift();
      return;
    }

    if (internalLayout === "shift" && !isCaps) {
      setInternalLayout("default");
    }
  };

  const getLayoutName = () => {
    if (layoutType === "numbers") {
      return "numbers";
    }
    return internalLayout;
  };

  const getShiftDisplay = () => {
    if (isCaps) {
      return "⇪";
    }
    if (internalLayout === "shift") {
      return "🠱";
    }
    return "⇧";
  }

  return (
    <div
      ref={containerRef}
      className={parentClassName}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={getLayoutName()}
        onChange={onChange}
        onKeyPress={onKeyPress}
        inputName={inputName}
        // preventMouseDownDefault={true}
        stopMouseDownPropagation={true}
        disableInternalInputStorage={true}
        layout={{
          default: [
            "1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m {backspace}",
            "{space}",
          ],
          shift: [
            "1 2 3 4 5 6 7 8 9 0",
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shift} Z X C V B N M {backspace}",
            "{space}",
          ],
          numbers: ["1 2 3", "4 5 6", "7 8 9", "0 {backspace}"],
        }}
        display={{
          "{backspace}": "⌫",
          "{shift}": getShiftDisplay(),
          "{space}": "⌴",
        }}
      />
    </div>
  );
};

export default VirtualKeyBoard;
