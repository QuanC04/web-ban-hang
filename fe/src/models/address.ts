export interface AddressItem {
  id: string;
  name: string;
  phone_number: string;
  province_id: string;
  province_name: string;
  district: string;
  street: string;
  isdefault: boolean;
}

export interface CreateAddressPayload {
  name: string;
  phone_number: string;
  province_id: string;
    province_name: string;
  district: string;
  street: string;
  isdefault: boolean;
}

export interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit? : boolean;
  addressData? : AddressItem;
  onSuccess?: () => void;
}

export interface ProvinceOption {
    value: string;
    label: string;
    raw:any
    }
