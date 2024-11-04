import AmountDisplay from "./AmountDisplay";
import { useBudget } from "../hooks/useBudget";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const BudgetTracker = () => {
  const { state, totalExpenses, aviableExpense, dispatch } = useBudget();

  const percentage = +((totalExpenses / state.budget) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex justify-center">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}% Gastado`}
          styles={buildStyles({
            pathColor: percentage === 100 ? "#DC2626" : "#3b82f6",
            trailColor: "#F5F5F5",
            textSize: 8,
            textColor: percentage === 100 ? "#DC2626" : "#3b82f6",
          })}
        />
      </div>
      <div className="flex flex-col justify-center gap-8">
        <button
          type="button"
          className="bg-pink-600 w-full p-2 text-white font-bold uppercase rounded-lg"
          onClick={() => dispatch({ type: "RESET_BUDGET" })}
        >
          Resetear app
        </button>
        <AmountDisplay label="Presupuesto" amount={state.budget} />
        <AmountDisplay label="Disponible" amount={aviableExpense} />
        <AmountDisplay label="Gastado" amount={totalExpenses} />
      </div>
    </div>
  );
};

export default BudgetTracker;
