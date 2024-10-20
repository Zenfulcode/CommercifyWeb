import React from 'react'
import FormInput from '../Form/FormInput';

type PaymentProviderProps = {
    method: string;
    setMethod: (method: string) => void;
}

const PaymentProvider = ({ method, setMethod }: PaymentProviderProps) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Provider</h3>
            <FormInput
                type="select"
                label="Payment Provider"
                name="paymentProvider"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
                options={[
                    { value: "", label: "Select payment provider" },
                    { value: "stripe", label: "Stripe" },
                ]}
            />
        </div>
    )
}

export default PaymentProvider