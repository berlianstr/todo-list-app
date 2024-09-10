import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  useAddChecklistMutation,
  useDeleteChecklistMutation,
  useGetChecklistsQuery,
} from "../../features/api/todoSlice";
import { useState } from "react";
import FormInput from "../../components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { EyeIcon, TrashIcon } from "lucide-react";

interface IFormInput {
  name: string;
}

const TodoListPage = () => {
  const [postAddList, { isLoading }] = useAddChecklistMutation();
  const [deleteChecklist] = useDeleteChecklistMutation();
  const { data, refetch } = useGetChecklistsQuery();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Corrected object property definition
      await postAddList({ name: data.name }).unwrap();
      refetch();
      setShowModal(false);
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this checklist?")) {
      try {
        await deleteChecklist(id).unwrap();
        refetch(); // Refetch to update the UI after deletion
        console.log("Checklist deleted successfully");
      } catch (err) {
        console.error("Failed to delete checklist", err);
      }
    }
  };

  return (
    <div className="w-full mx-auto container my-10">
      <div className="flex justify-end">
        <Button
          label="Add List"
          className="w-fit"
          onClick={() => setShowModal(true)}
        />
      </div>
      <div className="grid grid-cols-6 gap-6">
        {data?.data.map((todo) => (
          <div className="w-full p-4 bg-blue-100 rounded-lg shadow-md ">
            <div className="mb-4" key={todo.id}>
              <div className="flex justify-between">
                <label className="font-medium mb-1">{todo.name}</label>
                <div className="flex gap-2">
                  <EyeIcon
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/todo/${todo.id}`, {
                        state: { title: todo.name, dataItems: todo.items },
                      })
                    }
                  />
                  <TrashIcon
                    color="red"
                    className="cursor-pointer"
                    onClick={() => handleDelete(todo.id)}
                  />
                </div>
              </div>
              <p>Ini Adalah {todo.name}</p>
              {/* <ul className="ml-4 mt-1 space-y-2">
                {todo!.items?.map((item) => (
                  <li key={item.id}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 rounded"
                        checked={item.itemCompletionStatus}
                        onChange={() => {}}
                      />
                      {item.name}
                    </label>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        ))}
        {showModal && (
          <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack flex items-center justify-center ">
            <div className="bg-white w-[500px] p-8 rounded-md ">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  label="Todo Name"
                  id="name"
                  type="text"
                  register={register("name", {
                    required: "Name is required",
                  })}
                  error={errors.name}
                />
                <div className="flex justify-end gap-6">
                  <Button
                    className="w-fit bg-slate-300 text-gray-700"
                    label="Cancel"
                    type="button"
                    onClick={() => setShowModal(false)}
                  />
                  <Button
                    className="w-fit"
                    label="Submit"
                    type="submit"
                    loading={isLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoListPage;
