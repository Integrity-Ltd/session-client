import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from "primereact/utils";
import { Controller, Resolver, useForm } from "react-hook-form";

interface FormValues {
    email: string;
    password: string;
}

const resolver: Resolver<FormValues> = async (values) => {
    return {
        values: values.email && values.password ? values : {},
        errors: !values.email ? {
            email: {
                type: 'required',
                message: 'This is required.',
            },
        } : !values.password ? {
            password: {
                type: 'required',
                message: 'This is required.',
            },
        } : {},
    };
};

const Login = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });

    const onSubmit = (data: any) => {
        fetch(`/api/auth`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            cache: 'no-cache'
        }).then((response) => {
            return response.json();
        }).then(data => {
            console.log(JSON.stringify(data));
            window.location.href = "/";
        }).catch((e) => {
            console.log(e);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ width: '50%', margin: 'auto', marginTop: '10%', height: '100%' }}>
            <Controller
                name="email"
                control={control}
                rules={{ required: 'E-mail is required.' }}
                render={({ field, fieldState }) => (
                    <>
                        <div className="grid align-items-baseline">
                            <div className="col-12 mb-2 md:col-2 md:mb-0">
                                <label htmlFor={field.name}>E-mail: </label>
                            </div>
                            <div className="col-12 md:col-10">
                                <InputText id={field.name} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} style={{ width: '100%' }}
                                    className={classNames({ 'p-invalid': fieldState.error })} />
                            </div>
                            <div className="col-fixed" style={{ width: '100%', textAlign: 'end' }}>
                                {errors?.email && <small>{errors.email.message}</small>}
                            </div>
                        </div>
                    </>
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required.' }}
                render={({ field, fieldState }) => (
                    <>
                        <div className="grid align-items-baseline">
                            <div className="col-12 mb-2 md:col-2 md:mb-0">
                                <label htmlFor={field.name}>Password: </label>
                            </div>
                            <div className="col-12 md:col-10">
                                <Password id={field.name} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} inputClassName="w-full"
                                    className={classNames({ 'p-invalid': fieldState.error })} feedback={false} style={{ width: '100%' }} />
                            </div>
                            <div className="col-fixed" style={{ width: '100%', textAlign: 'end' }}>
                                {errors?.password && <small>{errors.password.message}</small>}
                            </div>
                        </div>
                    </>

                )}
            />
            <div className="flex justify-content-center">
                <Button label="Submit" type="submit" icon="pi pi-check" />
            </div>
        </form>

    );
}

export default Login;