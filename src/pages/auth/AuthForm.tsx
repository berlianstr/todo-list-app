import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../components/Button";
import FormInput from "../../components/Input";
import { Link, useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../features/api/authSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../../features/auth/authInfoSlice";

interface IFormInput {
  email?: string;
  username: string;
  password: string;
}

const AuthForm = ({ isRegister }: { isRegister: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [register, { isLoading, isError, isSuccess }] = useRegisterMutation();
  const [
    login,
    {
      isLoading: isLoadingLogin,
      isError: isErrorLogin,
      isSuccess: isSuccessLogin,
    },
  ] = useLoginMutation();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (isRegister) {
      try {
        await register(data).unwrap();
        console.log("Registration successful");
      } catch (err) {
        console.error("Registration failed", err);
      }
    } else {
      try {
        const response = await login(data).unwrap();
        localStorage.setItem("token", response.data.token);
        dispatch(setToken(response.data.token));
        navigate("/todo");
      } catch (err) {
        console.error("Login failed", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Sign Up" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isRegister && (
            <FormInput
              label="Email"
              id="email"
              type="email"
              register={formRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              error={errors.email}
            />
          )}
          <FormInput
            label="Username"
            id="username"
            type="text"
            register={formRegister("username", {
              required: "Username is required",
            })}
            error={errors.email}
          />
          <FormInput
            label="Password"
            id="password"
            type="password"
            register={formRegister("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
          />
          <Button
            label="Login"
            loading={isRegister ? isLoading : isLoadingLogin}
            type="submit"
          />
          <div className="flex justify-end">
            {isRegister ? (
              <Link to={"/"} className="text-primary hover:opacity-80">
                Already have account? Sign In
              </Link>
            ) : (
              <Link to={"/register"} className="text-primary hover:opacity-80">
                Don't have account? Sign Up
              </Link>
            )}
          </div>
          {isRegister
            ? isError
            : isErrorLogin && (
                <div className="text-red-500">
                  {isRegister ? "Sign Up" : "Sign In"} failed
                </div>
              )}
          {isRegister
            ? isSuccess
            : isSuccessLogin && (
                <div className="text-green-500">
                  {isRegister ? "Sign Up" : "Sign In"} successful!
                </div>
              )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
