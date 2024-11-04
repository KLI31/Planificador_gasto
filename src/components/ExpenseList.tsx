import { useBudget } from "../hooks/useBudget";
import { useMemo } from "react";
import ExpenseDetail from "./ExpenseDetail";

const ExpenseList = () => {
  const { state } = useBudget();

  const isEmpy = useMemo(() => state.expenses.length === 0, [state.expenses]);

  const filteredExpenses = useMemo(() => {
    if (state.currentCategory === "") {
      return state.expenses;
    }

    return state.expenses.filter(
      (expense) => expense.category === state.currentCategory
    );
  }, [state.expenses, state.currentCategory]);

  return (
    <div className="mt-10 p-5 bg-white shadow-lg rounded-lg">
      {isEmpy ? (
        <p className="text-gray-600 text-2xl font-bold">No Hay Gastos</p>
      ) : (
        <>
          <p className="text-gray-600 text-2xl font-bold my-5 ">
            Listado de Gastos:
          </p>
          {filteredExpenses.map((expense) => (
            <ExpenseDetail key={expense.id} expense={expense} />
          ))}
        </>
      )}
    </div>
  );
};

export default ExpenseList;
