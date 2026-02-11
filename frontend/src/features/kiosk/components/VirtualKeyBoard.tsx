import React, { useEffect, useState } from "react";
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
  // const [layoutName, setLayoutName] = useState<"default" | "shift" | "numbers">(
  //   "default",
  // );

  const [isShift, setIsShift] = useState<boolean>(false);

  useEffect(() => {
    setIsShift(false);
  }, [layoutType, inputName]);

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setIsShift((prev) => !prev);
    }
  };

  const getLayoutName = () => {
    if (layoutType === "numbers") {
      return "numbers";
    }
    return isShift ? "shift" : "default";
  };

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
          "{shift}": "⬆",
          "{space}": "⌴",
        }}
      />
    </div>
  );
};

export default VirtualKeyBoard;
