import { Draft } from "../models/draft.model";
import { AddressResponse, AddressUpdateDTO, DraftSearchParams, DraftUpdateDTO } from "../services/Address.interface";

// FP Utilities
const compose = (...functions: any[]) => {
  return (input: any) => {
    return functions.reduceRight((acc, fn) => fn(acc), input);
  };
};
// FP Utilities

export function addressToAddressDTO(address: AddressResponse): AddressUpdateDTO {
  const { shenaseTakhsis, shenaseKharid, havCode, status } = address
  return { shenaseTakhsis, shenaseKharid, havCode, status }
}

export function addressDTOToDraftSearch(addressDTO: AddressUpdateDTO): DraftUpdateDTO {
  const { shenaseTakhsis, shenaseKharid, havCode, status } = addressDTO
  return [{ shenaseh: shenaseTakhsis, bargah: shenaseKharid, code: +havCode }, status]
}

const transformAddress = compose(addressDTOToDraftSearch, addressToAddressDTO);

export function addressMapper(addresses: AddressResponse[]): DraftUpdateDTO[] {
  return addresses.map(transformAddress)
}

export async function updateDraftsIndividually(updates: DraftUpdateDTO[]): Promise<any[]> {
    const updateOperations = updates.map(async ([searchParams, status]) => {
        // Correct the types in searchParams before querying
        const query: any = {
            shenaseh: searchParams.shenaseh,
            bargah: parseInt(searchParams.bargah, 10), // Assuming bargah should be a number
            code: searchParams.code,
        };

        // Find drafts based on search parameters.
        const draftsToUpdate = await Draft.find(query);

        // Update each found draft with the new status.
        const updatePromises = draftsToUpdate.map(({ _id }) =>
            Draft.updateOne({ _id }, { $set: { status } })
        );

        return Promise.all(updatePromises);
    });

    try {
        // Execute all update operations concurrently and await their completion.
        const results = await Promise.all(updateOperations);
        return results;
    } catch (error) {
        console.error('Error updating drafts:', error);
        throw error;
    }
}

