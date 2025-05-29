/*Scenario - Implement a trigger that updates a custom "Revenue Forecast" field on Account when a related Opportunity is updated.
Solution - AccountRevenueTrigger.trigger
This trigger updates the "Revenue Forecast" field on Account whenever an Opportunity is inserted, updated, deleted, or undeleted.*/

trigger AccountRevenueTrigger on Opportunity (after insert, after update, after delete, after undelete) {
    Set<Id> accountIdSet = new set<Id>();
    if(Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete)){
        for(Opportunity opp :Trigger.new){
            if(Trigger.isInsert || Trigger.isUndelete){
                if(opp.stageName != 'Closed Lost'){
                    accountIdSet.add(opp.accountId);
                }
            }else if(Trigger.isUpdate){
                if(opp.StageName != trigger.oldMap.get(opp.Id).StageName || opp.Amount != trigger.oldMap.get(opp.Id).Amount){
					accountIdSet.add(opp.accountId);
                }
                if(opp.accountId != trigger.oldMap.get(opp.Id).accountId){
                    accountIdSet.add(opp.accountId);
                    accountIdSet.add(trigger.oldMap.get(opp.Id).accountId);
                }
            }
        }
    }
    
    if(Trigger.isAfter && Trigger.isDelete){
        for(Opportunity opp : trigger.old){
			accountIdSet.add(opp.accountId);
        }
    }
    
    List<AggregateResult> aggregateResults = [SELECT accountId, SUM(Amount) FROM Opportunity WHERE accountId IN:accountIdSet AND StageName != 'Closed Lost' GROUP BY accountId];
    List<Account> accountList = new List<Account>();
    for(AggregateResult aggregateResult : aggregateResults){
		Account acc = new Account();
        acc.Id = (Id)aggregateResult.get('accountId');
        acc.Revenue_Forecast__c = Integer.valueOf(aggregateResult.get('expr0'));
        accountList.add(acc);
    }
    if(!accountList.isEmpty()){
        UPDATE accountList;
    }
}