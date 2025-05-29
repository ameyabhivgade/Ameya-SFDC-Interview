/* Trigger to update Contact Phone numbers when the related Account's Phone number is changed.
 * This trigger runs after an Account is updated and checks if the Phone field has changed.
 * If it has, it updates the Phone field on all related Contacts.
 */
trigger ContactPhoneUpdate on Account (after update) {
    if (Trigger.isAfter && Trigger.isUpdate) {
        Set<Id> updatedAccountIds = new Set<Id>();

        // Collect only accounts where Phone was changed
        for (Account acc : Trigger.new) {
            Account oldAcc = Trigger.oldMap.get(acc.Id);
            if (acc.Phone != oldAcc.Phone) {
                updatedAccountIds.add(acc.Id);
            }
        }

        if (!updatedAccountIds.isEmpty()) {
            // Get related contacts
            List<Contact> contactsToUpdate = new List<Contact>();
            Map<Id, String> accountPhoneMap = new Map<Id, String>();

            for (Account acc : Trigger.new) {
                if (updatedAccountIds.contains(acc.Id)) {
                    accountPhoneMap.put(acc.Id, acc.Phone);
                }
            }

            for (Contact con : [
                SELECT Id, AccountId, Phone 
                FROM Contact 
                WHERE AccountId IN :updatedAccountIds
            ]) {
                String updatedPhone = accountPhoneMap.get(con.AccountId);
                if (updatedPhone != con.Phone) {
                    con.Phone = updatedPhone;
                    contactsToUpdate.add(con);
                }
            }

            if (!contactsToUpdate.isEmpty()) {
                try {
                    update contactsToUpdate;
                } catch (DmlException e) {
                    // Optional: Add error logging or handling
                    System.debug('Failed to update contacts: ' + e.getMessage());
                }
            }
        }
    }
}
