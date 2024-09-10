import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import FormInput from "../../../components/Input";
import Button from "../../../components/Button";
import {
  useAddItemToChecklistMutation,
  useDeleteChecklistItemMutation,
  useGetChecklistItemsQuery,
  useRenameChecklistItemMutation,
  useUpdateChecklistItemStatusMutation,
} from "../../../features/api/todoSlice";

interface IFormInput {
  itemName: string;
}

const TodoDetailPage = () => {
  const { id } = useParams<{ id: string; state: any }>();
  const [showModal, setShowModal] = useState(false);
  const [showModalItem, setShowModalItem] = useState(false);
  const [addItemToChecklist] = useAddItemToChecklistMutation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();
  const { data: itemsData, refetch } = useGetChecklistItemsQuery(Number(id), {
    skip: !id, // Skip the query if no ID is available
  });
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [updateChecklistItemStatus] = useUpdateChecklistItemStatusMutation();
  const [renameChecklistItem] = useRenameChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const location = useLocation();
  const { title } = location.state;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (id) {
        await addItemToChecklist({
          checklistId: Number(id),
          name: data.itemName,
        }).unwrap();
        reset(); // Reset the form
        refetch();
        setShowModal(false); // Close the modal
      }
    } catch (err) {
      console.error("Failed to add item", err);
    }
  };

  const onCheckboxChange = async (itemId: number) => {
    try {
      await updateChecklistItemStatus({
        checklistId: Number(id),
        itemId,
      }).unwrap();
      refetch(); // Refetch the data after updating
    } catch (err) {
      console.error("Failed to update item status", err);
    }
  };
  const handleRenameItem = async (data: IFormInput) => {
    if (selectedItemId !== null && id) {
      try {
        await renameChecklistItem({
          checklistId: Number(id),
          itemId: selectedItemId,
          newName: data.itemName,
        }).unwrap();
        reset();
        refetch(); // Refetch the data after renaming
        setShowModalItem(false); // Close the rename modal
      } catch (err) {
        console.error("Failed to rename item", err);
      }
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (id) {
      try {
        await deleteChecklistItem({
          checklistId: Number(id),
          itemId,
        }).unwrap();
        refetch(); // Refetch the data after deletion
      } catch (err) {
        console.error("Failed to delete item", err);
      }
    }
  };

  const openRenameModal = (itemId: number, itemName: string) => {
    setSelectedItemId(itemId);
    setSelectedItemName(itemName); // Store the current name
    setValue("itemName", itemName); // Prepopulate the form input
    setShowModalItem(true);
  };

  return (
    <div className="w-full mx-auto container my-10">
      <div className="grid grid-cols-6">
        <div className="w-full p-4 bg-blue-100 rounded-lg shadow-md ">
          <div className="mb-4">
            <div className="flex justify-between">
              <label className="font-medium mb-1">{title}</label>
              <PencilIcon
                className="cursor-pointer"
                onClick={() => setShowModal(true)}
              />
            </div>
            <ul className="ml-4 mt-1 space-y-2">
              {itemsData?.data?.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 rounded cursor-pointer"
                      checked={item.itemCompletionStatus}
                      onChange={() => onCheckboxChange(item.id)}
                    />
                    {item.name}
                  </label>
                  <div className="flex gap-1">
                    <PencilIcon
                      size={15}
                      className="cursor-pointer"
                      onClick={() => openRenameModal(item.id, item.name)}
                    />
                    <TrashIcon
                      color="red"
                      className="cursor-pointer"
                      size={15}
                      onClick={() => handleDeleteItem(item.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showModalItem && (
        <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack flex items-center justify-center ">
          <div className="bg-white w-[500px] p-8 rounded-md ">
            <form
              onSubmit={handleSubmit(handleRenameItem)}
              className="space-y-6"
            >
              <FormInput
                label="Todo Item Name"
                id="name"
                type="text"
                register={register("itemName", {
                  required: "Item Name is required",
                })}
                defaultValue={selectedItemName}
                error={errors.itemName}
              />
              <div className="flex justify-end gap-6">
                <Button
                  className="w-fit bg-slate-300 text-gray-700"
                  label="Cancel"
                  type="button"
                  onClick={() => setShowModalItem(false)}
                />
                <Button className="w-fit" label="Submit" type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack flex items-center justify-center ">
          <div className="bg-white w-[500px] p-8 rounded-md ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                label="Todo Item Name"
                id="name"
                type="text"
                register={register("itemName", {
                  required: "Item Name is required",
                })}
                error={errors.itemName}
              />
              <div className="flex justify-end gap-6">
                <Button
                  className="w-fit bg-slate-300 text-gray-700"
                  label="Cancel"
                  type="button"
                  onClick={() => setShowModal(false)}
                />
                <Button className="w-fit" label="Submit" type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoDetailPage;
