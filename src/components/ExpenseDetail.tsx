import { useMemo } from "react";
import { Expense } from "../types";
import { formatDate } from "../utils";
import AmountDisplay from "./AmountDisplay";
import { categories } from "../data/categories";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { useBudget } from "../hooks/useBudget";

interface ExpenseDetailProps {
  expense: Expense;
}

const ExpenseDetail = ({ expense }: ExpenseDetailProps) => {
  const { expenseName, amount, date, category, id } = expense;
  const { dispatch } = useBudget();

  const categoryFilter = useMemo(
    () => categories.filter((cat) => cat.id === category)[0],
    [category]
  );

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction
        onClick={() => {
          dispatch({ type: "GET_EXPENSE_BY_ID", payload: { id } });
        }}
      >
        Actualizar
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        onClick={() => {
          dispatch({ type: "REMOVE_EXPENSE", payload: { id } });
        }}
        destructive
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList>
      <SwipeableListItem
        maxSwipe={1}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className="bg-white shadow-lg p-5 w-full border-b border-gray-200 flex gap-5 items-center">
          <div className="">
            <img
              src={`icono_${categoryFilter.icon}.svg`}
              alt="icon category"
              className="w-20"
            />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold uppercase text-slate-500">
              {categoryFilter.name}
            </p>
            <p className="text-xl font-bold">{expenseName}</p>
            <p className="text-slate-600 text-sm">
              {formatDate(date!.toString())}
            </p>
          </div>
          <AmountDisplay amount={amount} />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  );
};

export default ExpenseDetail;
