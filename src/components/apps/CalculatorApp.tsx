import { useState } from "react";
import { Button } from "../ui/button";
import { Delete } from "lucide-react";

export const CalculatorApp = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setDisplay(display === "0" ? num : display + num);
  };

  const handleOperation = (op: string) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setDisplay("0");
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      let result = 0;
      switch (operation) {
        case "+":
          result = previousValue + current;
          break;
        case "-":
          result = previousValue - current;
          break;
        case "×":
          result = previousValue * current;
          break;
        case "÷":
          result = previousValue / current;
          break;
      }
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
  };

  const buttonClass = "h-14 text-lg font-medium hover:bg-primary/20 transition-colors";
  const operationClass = "h-14 text-lg font-medium bg-primary/30 hover:bg-primary/40 transition-colors";

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        {/* Display */}
        <div className="bg-muted/30 rounded-lg p-6 text-right">
          <div className="text-4xl font-bold truncate">{display}</div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button variant="secondary" className={buttonClass} onClick={handleClear}>
            AC
          </Button>
          <Button variant="secondary" className={buttonClass}>
            <Delete className="h-5 w-5" />
          </Button>
          <Button variant="secondary" className={buttonClass}>%</Button>
          <Button variant="secondary" className={operationClass} onClick={() => handleOperation("÷")}>
            ÷
          </Button>

          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("7")}>7</Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("8")}>8</Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("9")}>9</Button>
          <Button variant="secondary" className={operationClass} onClick={() => handleOperation("×")}>
            ×
          </Button>

          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("4")}>4</Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("5")}>5</Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("6")}>6</Button>
          <Button variant="secondary" className={operationClass} onClick={() => handleOperation("-")}>
            -
          </Button>

          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("1")}>1</Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("2")}>2</Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber("3")}>3</Button>
          <Button variant="secondary" className={operationClass} onClick={() => handleOperation("+")}>
            +
          </Button>

          <Button variant="secondary" className={`${buttonClass} col-span-2`} onClick={() => handleNumber("0")}>
            0
          </Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleNumber(".")}>
            .
          </Button>
          <Button variant="secondary" className={operationClass} onClick={handleEquals}>
            =
          </Button>
        </div>
      </div>
    </div>
  );
};
