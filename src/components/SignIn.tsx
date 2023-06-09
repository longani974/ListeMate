import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSignIn from "../hooks/useSignIn";

type SignInProps = {
    // props
};

export interface signInFormInput {
    email: string;
    password: string;
}

const SignIn: React.FC<SignInProps> = () => {
    const {
        mutate: signIn,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useSignIn();
    const { register, handleSubmit, reset } = useForm<signInFormInput>();
    const onSubmit: SubmitHandler<signInFormInput> = (data) => {
        signIn(data);
        isSuccess && reset();
        isError && console.log(error);
    };

    return (
        <>
            <form
                className="flex flex-col w-80 gap-4 m-auto mt-10"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="email"
                    placeholder="Adresse e-mail"
                    className="input input-bordered w-full max-w-xs"
                    {...register("email")}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="input input-bordered w-full max-w-xs"
                    {...register("password")}
                />
                <button
                    type="submit"
                    className={`btn btn-primary ${
                        isLoading && "loading disabled"
                    } `}
                >
                    Se connecter
                </button>
            </form>
            <div className="mt-8">
                <label
                    className="link link-hover"
                    htmlFor="modalForgetPassword"
                >
                    Mot de passe oublié
                </label>
            </div>
        </>
    );
};
export default SignIn;
