import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store/store";

interface itemsChecklist {
  id: number;
  name: string;
  itemCompletionStatus: boolean;
}

interface ChecklistItem {
  id: number;
  name: string;
  items: itemsChecklist[] | null;
  checklistCompletionStatus: boolean;
}

interface ChecklistResponse {
  statusCode: number;
  message: string;
  errorMessage: string | null;
  data: ChecklistItem[];
}
interface ChecklistItemsResponse {
  statusCode: number;
  message: string;
  errorMessage: string | null;
  data: itemsChecklist[];
}

interface AddChecklistRequest {
  name: string;
}

interface AddChecklistResponse {
  statusCode: number;
  message: string;
  errorMessage: string | null;
  data: ChecklistItem;
}

interface AddItemRequest {
  checklistId: number;
  name: string;
}

interface UpdateChecklistItemRequest {
  checklistId: number;
  itemId: number;
}

interface RenameChecklistItemRequest {
  checklistId: number;
  itemId: number;
  newName: string;
}

export const todoApi = createApi({
  reducerPath: "todoApi", // Ensure this is unique
  baseQuery: fetchBaseQuery({
    baseUrl: "http://94.74.86.174:8080/api/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      console.log(state);
      const token = localStorage.getItem("token"); // Ensure this matches your state
      console.log(token);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChecklists: builder.query<ChecklistResponse, void>({
      query: () => "checklist",
    }),
    addChecklist: builder.mutation<AddChecklistResponse, AddChecklistRequest>({
      query: (newChecklist) => ({
        url: "checklist",
        method: "POST",
        body: newChecklist,
      }),
    }),
    addChecklistItem: builder.mutation<
      AddChecklistResponse,
      AddChecklistRequest
    >({
      query: (newChecklist) => ({
        url: "checklist",
        method: "POST",
        body: newChecklist,
      }),
    }),
    deleteChecklist: builder.mutation<void, number>({
      query: (id) => ({
        url: `checklist/${id}`,
        method: "DELETE",
      }),
    }),
    addItemToChecklist: builder.mutation<void, AddItemRequest>({
      query: ({ checklistId, name }) => ({
        url: `checklist/${checklistId}/item`,
        method: "POST",
        body: { itemName: name },
      }),
    }),
    getChecklistItems: builder.query<ChecklistItemsResponse, number>({
      query: (checklistId) => `checklist/${checklistId}/item`,
    }),
    updateChecklistItemStatus: builder.mutation<
      void,
      UpdateChecklistItemRequest
    >({
      query: ({ checklistId, itemId }) => ({
        url: `checklist/${checklistId}/item/${itemId}`,
        method: "PUT",
      }),
    }),
    renameChecklistItem: builder.mutation<void, RenameChecklistItemRequest>({
      query: ({ checklistId, itemId, newName }) => ({
        url: `checklist/${checklistId}/item/rename/${itemId}`,
        method: "PUT",
        body: { itemName: newName },
      }),
    }),
    deleteChecklistItem: builder.mutation<
      void,
      { checklistId: number; itemId: number }
    >({
      query: ({ checklistId, itemId }) => ({
        url: `checklist/${checklistId}/item/${itemId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetChecklistsQuery,
  useAddChecklistMutation,
  useDeleteChecklistMutation,
  useAddItemToChecklistMutation,
  useGetChecklistItemsQuery,
  useUpdateChecklistItemStatusMutation,
  useRenameChecklistItemMutation,
  useDeleteChecklistItemMutation,
} = todoApi;
