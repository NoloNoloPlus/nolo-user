import ValidatedInput from "../components/ValidatedInput"

export default function Profile ({ register, errors, registration }) {
    return (
        <div className="is-flex is-flex-direction-column is-align-items-center">
            <h1 className="title is-1">Your profile</h1>
            <div className="is-flex" style={{width: "30em", maxWidth: '90vw'}}>
                <ValidatedInput label="First Name" name="firstName" register={register} errors={errors} />
                <ValidatedInput label="Last Name" name="lastName" register={register} errors={errors} />
            </div>
            
            <ValidatedInput label="Email" name="email" register={register} errors={errors} />
            { registration ? (
                <div style={{width: "30em", maxWidth: '90vw'}}>
                    <ValidatedInput label="Password" name="password" type="password" register={register} errors={errors} />
                    <ValidatedInput label="Confirm Password" name="confirmPassword" type="password" register={register} errors={errors} />
                </div>
            )
            : null }
            <ValidatedInput label="Company" name="company" register={register} errors={errors} />
            <ValidatedInput label="Avatar URL" name="avatarUrl" register={register} errors={errors} />
            <div>
                <div className="is-flex" style={{width: "30em", maxWidth: '90vw'}}>
                    <ValidatedInput label="Line 1" name="address.street.line1" register={register} errors={errors} />
                    <ValidatedInput label="Line 2" name="address.street.line2" register={register} errors={errors} />
                </div>
                <div className="is-flex" style={{width: "30em", maxWidth: '90vw'}}>
                    <ValidatedInput label="City" name="address.city" register={register} errors={errors} />
                    <ValidatedInput label="State" name="address.state" register={register} errors={errors} />
                </div>
                <div className="is-flex" style={{width: "30em", maxWidth: '90vw'}}>
                    <ValidatedInput label="ZIP" name="address.zip" register={register} errors={errors} />
                    <ValidatedInput label="Country" name="address.country" register={register} errors={errors} />
                </div>
            </div>
        </div>
    )
}