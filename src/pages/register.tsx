import { Controller, Resolver, useForm } from "react-hook-form";
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { Password } from "primereact/password";

interface FormValues {
    name: string;
    email: string;
    password: string;
}

const resolver: Resolver<FormValues> = async (values) => {
    return {
        values: values.name && values.email && values.password ? values : {},
        errors: !values.name ? {
            name: {
                type: 'required',
                message: 'This is required.',
            },
        }
            : !values.email ? {
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

const verifyToken = async (token: string): Promise<any[] | undefined> => {
    let APIResponse = [];

    try {
        let params = JSON.stringify({
            reCAPTCHA_TOKEN: token,
            Secret_Key: process.env.REACT_APP_SECRET_KEY
        });

        let response: any = await fetch(`/api/auth/verify-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: params,
            cache: 'no-cache'
        });

        let responseJSON: any = await response.json();
        APIResponse.push(responseJSON['verification_info']);
        return APIResponse;
    } catch (error) {
        console.log(error);
    }
};

const Register = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });
    const captchaRef = useRef<ReCAPTCHA>(null);

    const onSubmit = async (data: any) => {
        let token = captchaRef?.current?.getValue();
        captchaRef?.current?.reset();

        if (token) {
            let valid_token = await verifyToken(token);

            if ((valid_token !== undefined) && (valid_token.length > 0) && (valid_token[0].success === true)) {
                console.log("verified");
                fetch(`/api/users`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    cache: 'no-cache'
                }).then((response) => response.json()).then(data => {
                    console.log(JSON.stringify(data));
                    window.location.href = "/";
                });
            } else {
                console.log("not verified");
            }
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ width: '60%', margin: 'auto', marginTop: '10%', height: '100%' }}>

            <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required.' }}
                render={({ field, fieldState }) => (
                    <>
                        <div className="grid align-items-baseline">
                            <div className="col-12 mb-2 md:col-2 md:mb-0">
                                <label className="col-fixed" style={{ width: '100px' }} htmlFor={field.name}>Name: </label>
                            </div>
                            <div className="col-12 md:col-10">
                                <InputText id={field.name} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} style={{ width: '100%' }}
                                    className={classNames({ 'p-invalid': fieldState.error })} />
                            </div>
                            <div className="col-fixed" style={{ width: '100%', textAlign: 'end' }}>
                                {errors?.name && <small>{errors.name.message}</small>}
                            </div>
                        </div>
                    </>
                )}
            />

            <Controller
                name="email"
                control={control}
                rules={{ required: 'E-mail is required.' }}
                render={({ field, fieldState }) => (
                    <>
                        <div className="grid align-items-baseline">
                            <div className="col-12 mb-2 md:col-2 md:mb-0">
                                <label className="col-fixed" style={{ width: '100px' }} htmlFor={field.name}>E-mail: </label>
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
                                <label className="col-fixed" style={{ width: '100px' }} htmlFor={field.name}>Password: </label>
                            </div>
                            <div className="col-12 md:col-10">
                                <Password id={field.name} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} style={{ width: '100%' }} inputClassName="w-full"
                                    className={classNames({ 'p-invalid': fieldState.error })} />
                            </div>
                            <div className="col-fixed" style={{ width: '100%', textAlign: 'end' }}>
                                {errors?.password && <small>{errors.password.message}</small>}
                            </div>
                        </div>
                    </>

                )}
            />
            <div className='flex justify-content-center'>
                <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY || ''} ref={captchaRef} />
            </div>
            <div className='flex justify-content-center'>
                <Button label="Submit" type="submit" icon="pi pi-check" />
            </div>
        </form>
    )
}

export default Register;