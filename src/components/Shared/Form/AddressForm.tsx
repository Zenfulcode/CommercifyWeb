import { Address } from '@/types';
import React from 'react'
import FormInput from './FormInput';

type AddressFormProps = {
    address: Address;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    title: string;
}

const AddressForm = ({ address, onChange, title }: AddressFormProps) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <FormInput label="First name" name="firstName" value={address.firstName} onChange={onChange} required />
                <FormInput label="Last name" name="lastName" value={address.lastName} onChange={onChange} required />
                <FormInput label="Address" name="address1" value={address.address1} onChange={onChange} required className="sm:col-span-2" />
                <FormInput label="Apartment, suite, etc." name="address2" value={address.address2} onChange={onChange} className="sm:col-span-2" />
                <FormInput label="City" name="city" value={address.city} onChange={onChange} required />
                <FormInput label="State / Province" name="state" value={address.state} onChange={onChange} required />
                <FormInput label="Postal code" name="zipCode" value={address.zipCode} onChange={onChange} required />
                <FormInput label="Country" name="country" value={address.country} onChange={onChange} required />
            </div>
        </div>
    )
}

export default AddressForm