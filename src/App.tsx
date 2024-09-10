import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthForm from "./pages/auth/AuthForm";
import TodoListPage from "./pages/todo";
import TodoDetailPage from "./pages/todo/detail";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <AuthForm isRegister={false} />,
  },
  {
    path: "/register",
    element: <AuthForm isRegister={true} />,
  },
  {
    path: "/todo",
    element: <TodoListPage />,
  },
  {
    path: "/todo/:id",
    element: <TodoDetailPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
