import { Category, DraftExpense, Expense } from "../types";
import { v4 as uuid } from "uuid";

export type BudgetActions =
  | { type: "ADD_BUDGET"; payload: { budget: number } }
  | { type: "REMOVE_BUDGET"; payload: { budget: number } }
  | { type: "SHOW_EXPENSE_MODAL" }
  | { type: "HIDE_EXPENSE_MODAL" }
  | { type: "ADD_EXPENSE"; payload: { expense: DraftExpense } }
  | { type: "REMOVE_EXPENSE"; payload: { id: string } }
  | { type: "GET_EXPENSE_BY_ID"; payload: { id: Expense["id"] } }
  | { type: "UPDATE_EXPENSE"; payload: { expense: Expense } }
  | { type: "RESET_BUDGET" }
  | { type: "ADD_FILTER_BY_CATEGORY"; payload: { id: Category["id"] } };

export type BudgetState = {
  budget: number;
  showExpenseModal: boolean;
  expenses: Expense[];
  editingId: Expense["id"];
  currentCategory: Category["id"];
};

const getExpensesToLocalStorage = (): Expense[] => {
  const savedExpenses = localStorage.getItem("expenses");
  return savedExpenses ? JSON.parse(savedExpenses) : [];
};

const initialBudget = (): number => {
  const savedBudget = localStorage.getItem("budget");
  return savedBudget ? +savedBudget : 0;
};

export const initialState: BudgetState = {
  budget: initialBudget(),
  showExpenseModal: false,
  expenses: getExpensesToLocalStorage(),
  editingId: "",
  currentCategory: "",
};

const createExpense = (payload: DraftExpense): Expense => {
  const id = uuid();

  return {
    ...payload,
    id,
  };
};

export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetActions
) => {
  if (action.type === "ADD_BUDGET") {
    return {
      ...state,
      budget: action.payload.budget,
    };
  }

  if (action.type === "SHOW_EXPENSE_MODAL") {
    return {
      ...state,
      showExpenseModal: true,
    };
  }

  if (action.type === "HIDE_EXPENSE_MODAL") {
    return {
      ...state,
      showExpenseModal: false,
      editingId: "",
    };
  }

  if (action.type === "ADD_EXPENSE") {
    const expenses = createExpense(action.payload.expense);
    return {
      ...state,
      expenses: [...state.expenses, expenses],
      showExpenseModal: false,
    };
  }

  if (action.type === "REMOVE_EXPENSE") {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id
      ),
    };
  }

  if (action.type === "GET_EXPENSE_BY_ID") {
    return {
      ...state,
      editingId: action.payload.id,
      showExpenseModal: true,
    };
  }

  if (action.type === "UPDATE_EXPENSE") {
    return {
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === action.payload.expense.id
          ? action.payload.expense
          : expense
      ),
      showExpenseModal: false,
      editingId: "",
    };
  }

  if (action.type === "ADD_FILTER_BY_CATEGORY") {
    return {
      ...state,
      currentCategory: action.payload.id,
    };
  }

  if (action.type === "RESET_BUDGET") {
    return {
      ...state,
      budget: 0,
      expenses: [],
    };
  }

  return state;
};
