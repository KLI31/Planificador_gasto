import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

const initialState = {
  amount: 0,
  expenseName: "",
  category: "",
  date: new Date(),
};

const ExpenseForm = () => {
  const [expense, setExpense] = useState<DraftExpense>(initialState);
  const [error, setError] = useState("");
  const [previousExpense, setPreviousExpense] = useState(0);
  const { dispatch, state, aviableExpense } = useBudget();

  const handleValueChange = (value: Value) => {
    setExpense({ ...expense, date: value });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const isNumberField = ["amount"].includes(e.target.id);
    setExpense({
      ...expense,
      [e.target.id]:
        isNumberField && e.target.value !== ""
          ? +e.target.value
          : e.target.value,
    });
  };

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (expense) => expense.id === state.editingId
      )[0];
      setExpense(editingExpense);
      setPreviousExpense(editingExpense.amount);
    }
  }, [state.editingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(expense).includes("")) {
      setError("Complete todos los campos");
      return;
    }

    // Validacion para que no se puedan agregar gastos mayores al presupuesto inicial

    if (expense.amount - previousExpense > aviableExpense) {
      setError("No puedes agregar gastos mayores al presupuesto");
      return;
    }

    // Agrega o actualiza el gasto
    if (state.editingId) {
      dispatch({
        type: "UPDATE_EXPENSE",
        payload: { expense: { id: state.editingId, ...expense } },
      });
    } else {
      dispatch({ type: "ADD_EXPENSE", payload: { expense } });
    }
    // Reiniciar los estados
    setExpense(initialState);
    setPreviousExpense(0);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Actualizar gasto" : "Nuevo gasto"}
      </legend>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex flex-col gap-2 ">
        <label htmlFor="expenseName" className="text-xl">
          Nombre gasto:
        </label>
        <input
          type="text"
          value={expense.expenseName}
          id="expenseName"
          className="w-full bg-slate-100 border-gray-200 p-2"
          placeholder="Nombre del gasto"
          name="expenseName"
          onChange={handleChange}
        />
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          className="w-full bg-slate-100 border-gray-200 p-2"
          placeholder="Ingrese la cantidad del gasto Ej: 100"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />

        <label htmlFor="category" className="text-xl">
          Categoria:
        </label>
        <select
          name="category"
          id="category"
          className=" bg-slate-100 p-2"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label htmlFor="amount" className="text-xl">
          Fecha gasto:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleValueChange}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Actualizar gasto" : "Registrar gasto"}
      />
    </form>
  );
};

export default ExpenseForm;
