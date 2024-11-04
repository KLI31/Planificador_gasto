import { useState, useMemo } from "react";
import { useBudget } from "../hooks/useBudget";

const BudgetForm = () => {
  const [budget, setBudget] = useState(0);
  const { dispatch } = useBudget();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.valueAsNumber);
  };

  const isDisabled = useMemo(() => {
    return isNaN(budget) || budget <= 0;
  }, [budget]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "ADD_BUDGET", payload: { budget } });
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-5">
          <label
            htmlFor="budget"
            className="text-4xl text-blue-600 font-bold text-center"
          >
            Definir presupuesto
          </label>
          <input
            id="budget"
            type="number"
            className="w-full bg-white border-gray-200 p-2"
            placeholder="Define tu presupuesto"
            name="budget"
            value={budget}
            onChange={handleChange}
          />
        </div>
        <input
          type="submit"
          value="Definir presupuesto"
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:bg-gray-500 disabled:cursor-auto"
          disabled={isDisabled}
        />
      </form>
    </>
  );
};

export default BudgetForm;