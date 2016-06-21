(function () {
    "use strict";

    var modelName = 'CaseModel';

    var recalculateUrl = '~/api/ProcedureParts/Recalculate/';
    var saveAndPrintUrl = '~/api/ProcedureParts/SaveAndPrint/';
    var partsLoadUrl = '~/api/ProcedureParts/';
    var headerLoadUrl = '~/api/PatientProcedure/header/';
    var benefitsLoadUrl = '~/api/PatientProcedure/benefits/';
    var partCostsUpdateUrl = '~/api/ProcedureParts/UpdateActualPartCosts/';
    var partPricesUpdateUrl = '~/api/ProcedureParts/UpdateActualPartPrices/';

    var modelFunc = [
        '$http', 'currentUser',
        function($http, currentUser) {

            var self = this;

            self.ppId = '';
            self.caseId = 0;
            self.header = {};
            self.parts = [];
            self.dataLoadInProgress = false;

            self.anyCostModified = false;
            self.anyPriceModified = false;
            self.caseInEditMode = false;
            self.allowOverrideArEstimates = false;

            self.enableCaseEditMode = function() {
                self.caseInEditMode = true;
            };

            self.resetCaseEditMode = function() {
                self.caseInEditMode = false;
                self.anyCostModified = false;
                self.anyPriceModified = false;
                return self.loadParts();
            };

            var loadHeader = function(url) {
                self.caseId = 0;
                self.header = {};
                self.dataLoadInProgress = true;

                var data = {'dxCode1':'K42.9','dxCode2':null,'dxCode3':null,'dxCode4':null,'dxCode5':null,'cptCode1':'49585','cptCode2':null,'cptCode3':null,'cptCode4':null,'cptCode5':null,'cptCode6':null,'patMaritalStatus':null,'patAddress':'245 MASON LANE','patCity':'BEAUFORT','patState':'NC','patZipCode':'28516-6000','patHomePhone':'2527251927','patWorkPhone':null,'planType':'Commercial-PPO','primaryMemberId':'YPYW1262049603','primaryGroupId':'S27138','relatedTo':'Self','insuredEmployer':null,'insuredGender':'male','insuredFirstName':null,'insuredMiddleName':null,'insuredLastName':null,'insuredDob':null,'insuredSsn':null,'insuredPhone':'2527251927','insuredAddress':null,'insuredCity':null,'insuredState':null,'insuredZipCode':null,'secondaryCarrier':null,'secondaryCarrierId':'','secondaryMemberId':null,'secondaryGroupId':null,'dateOfInjury':null,'areaOfInjury':'unknown!','wcClaimNumber':null,'adjusterName':null,'adjusterPhone':null,'adjusterFax':null,'ncmName':'ncmname','ncmPhone':'ncmphone','ncmFax':'ncmfax','notes':'<<notes>>','approvalRequired':true,'profitApproved':false,'locked':false,'allowArEstimateOverride':false,'networkType':'Aetna','actualMemberResp':2898.60,'actualCarrierResp':8794.40,'patientWriteOff':0.00,'carrierWriteOff':10000.00,'totalPoCost':3499.03,'totalPoPartsCost':3376.29,'totalClaimBilledAmount':11693.00,'totalClaimAllowedAmount':11693.00,'postedToAccount':false,'procedureBenefit':{'patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','inOutNetwork':'In','billToPatient':true,'memberCoinsurancePct':20,'carrierCoinsurancePct':80,'memberOopMax':3210.00,'memberOopMet':0.00,'deductableMax':700.00,'deductableMet':0.00},'priceSummary':{'patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','primaryCarrierId':'c5887b49-ddbc-cb06-d0c5-4f88815019ea','homePlanCarrierId':'','secondaryCarrierId':'','feeScheduleId':'4676c021-eab4-d788-51e3-51d2f968ebd3','feeSchedule':{'id':'4676c021-eab4-d788-51e3-51d2f968ebd3','name':'Aetna - CFS'},'priceRuleGroupId':2,'priceRuleGroup':{'id':2,'name':'IPG - HCPCS Pricing Rules'},'billedAmount':11693.0000,'estAllowedAmount':11693.0000,'dateTimeCreated':'2016-06-09T14:39:12.2871432-04:00','dateTimeModified':'2016-06-16T16:15:23.6093312-04:00','versionNumber':25,'primaryCarrier':{'id':'c5887b49-ddbc-cb06-d0c5-4f88815019ea','name':'Aetna'},'homePlanCarrier':null,'secondaryCarrier':null},'costSummary':{'patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partsCost':3376.2900,'estTax':58.2400,'estShipping':64.5000,'totalCost':3499.0300,'dateTimeCreated':'2016-06-09T14:39:11.5730718-04:00','dateTimeModified':'2016-06-16T16:15:22.0203312-04:00','versionNumber':31},'procedureResponsibility':{'patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','totalCost':3499.0300,'allowedAmount':11693.0000,'carrierWriteoffAmount':-10000.0000,'patientWriteoffAmount':0.0000,'patientResponsibility':2898.6000,'carrierResponsibility':-1205.6000,'profitAmount':-1806.0300,'profitPct':-106.6763,'approvalRequired':true,'approved':false,'partsCost':0.0,'adjustedProfit':1693.0000},'adjustments':[{'id':6621,'patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','entityCode':'C','adjustmentAmount':-10000.0000,'adjustmentReasonId':2,'reason':{'isEnabled':true,'entityCode':'C','id':'2','code':'Carrier - Negotiated Pricing','description':'Carrier - Negotiated Pricing'}}],'calcRevSaved':true,'id':'b8927cae-ca90-a39c-4380-56eaf519aa99','name':'ALL_OLI_Umbilical Hernia Repair_199968','caseId':199968,'referalType':'Portal','surgeryScheduledDate':'2016-06-07T00:00:00','surgeryActualDate':'2016-06-07T00:00:00','dateEnteredUtc':'2016-03-17T18:20:18','referralDateUtc':'2016-03-17T18:20:00','facPatientId':null,'facilityId':'c271d633-3299-8bfa-5bba-4f675cb10817','facility':{'id':'c271d633-3299-8bfa-5bba-4f675cb10817','name':'Charlotte Surgery Center ','caseManagerId':'a2410954-ba45-eb4c-577f-4b9aba64cbd1'},'physicianId':'b78bb1d5-509d-7d5c-7c75-49626e33fa2d','physician':{'id':'b78bb1d5-509d-7d5c-7c75-49626e33fa2d','firstName':'Dean','lastName':'Marson'},'procedureId':'d1798e8d-eda0-9a3d-d443-4d5d1cdc3524','procedure':{'id':'d1798e8d-eda0-9a3d-d443-4d5d1cdc3524','name':'Umbilical Hernia Repair'},'procedureStatus':{'id':'301750a3-3336-1c97-b94d-4a9e30e03590','name':'Benefits Verified & Surgery Scheduled'},'reportingCategory':'Case Mgmt - Approved & Scheduled','billedCptCode':'49585','homePlanCarrierId':'','homePlanCarrier':null,'primaryCarrier':{'macEnabled':false,'macEnabledDate':null,'expectedInsAllowedPct':0.0,'pctMarkupForCostCalc':0.0,'usePctMarkupForCostCalc':false,'isContracted':true,'allowSecondaryHcpcs':false,'bandingMaxBilled':25000.0,'bandingMaxProfitMargin':75.00,'bandingMinProfitMargin':-10.00,'statementToPatient':true,'allowUnsupportedParts':false,'id':'c5887b49-ddbc-cb06-d0c5-4f88815019ea','name':'Aetna'},'primaryCarrierId':'c5887b49-ddbc-cb06-d0c5-4f88815019ea','patGender':'female','patFirstName':'OLIVIA','patMiddleName':'G','patLastName':'ALLEN','patSsn':null,'patDob':'2002-12-06T00:00:00','expectedInsAllowedPct':75.0};
                
                        self.caseId = data.caseId;
                        self.header = data;
                        self.reCalculateAdjustments();
                        self.hasPermToOvrdArEst = currentUser.hasPermission('CALCREV_OVERRIDE') && self.header.allowArEstimateOverride;
                        self.hasPermissionToSave = currentUser.hasPermission('CALCREV_SAVE');
                        _.forEach(self.header.adjustments, function(value) {
                            value.negativeAdjustmentAmount = - value.adjustmentAmount;
                        });
                        validateBilled();
                        validateProfit();
                        calculateOldHeaderValue();

                return $http.get(url + self.ppId)
                    .success(function(data) {
                        //self.caseId = data.caseId;
                        //self.header = data;
                        //self.reCalculateAdjustments();
                        //self.hasPermToOvrdArEst = currentUser.hasPermission('CALCREV_OVERRIDE') && self.header.allowArEstimateOverride;
                        //self.hasPermissionToSave = currentUser.hasPermission('CALCREV_SAVE');
                        //_.forEach(self.header.adjustments, function(value) {
                        //    value.negativeAdjustmentAmount = - value.adjustmentAmount;
                        //});
                        //validateBilled();
                        //validateProfit();
                        //calculateOldHeaderValue();
                    }).then(function() {
                        self.dataLoadInProgress = false;
                    });
            };

            self.loadCase = function (ppId) {
                self.ppId = ppId || self.ppId;
                return loadHeader(headerLoadUrl).then(self.loadParts);
            };

            self.reLoadCase = function() {
                return loadHeader(headerLoadUrl);
            };

            self.refreshBenefits = function () {
                self.header.procedureBenefit = {};
                $http.get(benefitsLoadUrl + self.ppId)
                    .success(function(data) {
                        self.header.procedureBenefit = data;
                    });
            };

            var loadParts = function(url) {
                self.dataLoadInProgress = true;
                self.parts = [{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':3.00,'calculatedUnitCost':200.00,'calculatedLineTax':7.32,'calculatedLineShipping':3.00,'calculatedLineCost':410.32,'mac':0.00,'serialNumber':null,'lotNumber':null,'macEnabled':true,'maicDisableReason':0,'poType':{'id':'1','name':'C','description':'CPA - Pay Facility'},'payFacility':true,'partTypeName':'Implantables','partTaxCategory':null,'poId':'b14ef9bd-c813-ab2f-5060-575b0a7e1530','multiPackPoId':null,'poDateAdd':'2016-06-10T00:00:00','debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':11,'partCost':{'id':'753d8ab7-1885-4614-854d-372160fdcf67','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'104fba6a-b950-840f-93cd-4e404561488e','partSku':'AR-8740-38PTS','partName':'LOW PROFILE SCREW 4.0 x 38mm CANNULATED SHORT THREAD','manufacturerId':'1126cb0d-58ab-0306-992e-48d7ad0d8209','payFacilityFlag':true,'quantityUsed':2.00,'mfrListPrice':150.0000,'mfrDiscountUnitCost':150.0000,'enteredUnitCost':200.0000,'estimatedUnitCost':200.0000,'maicIsEnabled':true,'maicUnitCost':0.0000,'maicReimbursePct':100.0000,'maicCalcReasons':'1','calculatedLineTax':7.3200,'enteredLineTax':7.3200,'calculatedLineShipping':0.0000,'enteredLineShipping':3.0000,'poUnitCost':200.0000,'poEstimatedLineTax':7.3200,'poEstimatedLineShipping':3.0000,'poLineCost':400.0000,'poLineCostTax':407.3200,'poTotalLineCost':410.3200,'deleted':false,'dateTimeModified':'2016-06-10T13:50:21.6876033-04:00','enteredDiscountOptions':''},'partPrice':{'id':'753d8ab7-1885-4614-854d-372160fdcf67','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'104fba6a-b950-840f-93cd-4e404561488e','partName':'LOW PROFILE SCREW 4.0 x 38mm CANNULATED SHORT THREAD','partSku':'AR-8740-38PTS','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':2.00,'poUnitCost':200.0000,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':410.3200,'mfrListPrice':150.0000,'multiplier':1,'billedQuantity':2.00,'billedUnitPrice':382.0000,'billedLineAmt':764.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':382.0000,'expReimburseLineAmt':764.0000,'hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','hcpcsCode':'C1713','billedHcpcsIdOnPri':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','billedHcpcsCodeOnPri':'C1713','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_HCPCS:563904a7-8ddb-99d1-487e-4f8c5d39ec97','dateTimeModified':'2016-06-10T13:50:22.7706033-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':7.3200,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'screw','poName':'CIPG199968-903237','linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'753d8ab7-1885-4614-854d-372160fdcf67','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'104fba6a-b950-840f-93cd-4e404561488e','partSku':'AR-8740-38PTS','partName':'LOW PROFILE SCREW 4.0 x 38mm CANNULATED SHORT THREAD','manufacturerId':'1126cb0d-58ab-0306-992e-48d7ad0d8209','manufacturer':{'id':'1126cb0d-58ab-0306-992e-48d7ad0d8209','name':'Arthrex'},'hcpcsCode':'C1713','hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','quantity':2.0,'enteredUnitCost':200.00,'mfrUnitCost':150.00,'mfrDiscUnitCost':150.00,'multiplier':1,'billedQuantity':2,'billedUnitPrice':382.00,'billedLineAmt':764.00,'allowedUnitPrice':382.00,'allowedLineAmt':764.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':24.50,'calculatedUnitCost':1500.00,'calculatedLineTax':0.00,'calculatedLineShipping':24.50,'calculatedLineCost':1524.50,'mac':0.00,'serialNumber':null,'lotNumber':null,'macEnabled':true,'maicDisableReason':0,'poType':{'id':'1','name':'C','description':'CPA - Pay Facility'},'payFacility':true,'partTypeName':'Implantables','partTaxCategory':null,'poId':'b14ef9bd-c813-ab2f-5060-575b0a7e1530','multiPackPoId':null,'poDateAdd':'2016-06-10T00:00:00','debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':21,'partCost':{'id':'c5181e37-0501-4902-a640-78602e2c1c65','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'602fcc88-61c5-4a1e-97ad-52f50d55ddc7','partSku':'AR-501-UFRB','partName':'!BALANCE UKA FEMORAL CEMENTED SIZE 2, RT-MEDIAL','manufacturerId':'1126cb0d-58ab-0306-992e-48d7ad0d8209','payFacilityFlag':true,'quantityUsed':1.00,'mfrListPrice':1430.0000,'mfrDiscountUnitCost':1430.0000,'enteredUnitCost':1500.0000,'estimatedUnitCost':1500.0000,'maicIsEnabled':true,'maicUnitCost':0.0000,'maicReimbursePct':100.0000,'maicCalcReasons':'1','calculatedLineTax':0.0000,'enteredLineTax':0.0000,'calculatedLineShipping':0.0000,'enteredLineShipping':24.5000,'poUnitCost':1500.0000,'poEstimatedLineTax':0.0000,'poEstimatedLineShipping':24.5000,'poLineCost':1500.0000,'poLineCostTax':1500.0000,'poTotalLineCost':1524.5000,'deleted':false,'dateTimeModified':'2016-06-10T14:31:13.9400843-04:00','enteredDiscountOptions':''},'partPrice':{'id':'c5181e37-0501-4902-a640-78602e2c1c65','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'602fcc88-61c5-4a1e-97ad-52f50d55ddc7','partName':'!BALANCE UKA FEMORAL CEMENTED SIZE 2, RT-MEDIAL','partSku':'AR-501-UFRB','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':1.00,'poUnitCost':1500.0000,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':1524.5000,'mfrListPrice':1430.0000,'multiplier':1,'billedQuantity':1.00,'billedUnitPrice':4995.0000,'billedLineAmt':4995.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':4995.0000,'expReimburseLineAmt':4995.0000,'hcpcsId':'278A9E8B-D1C6-4B4D-A0FD-8DDC63A2B3FE','hcpcsCode':'C1776','billedHcpcsIdOnPri':'278A9E8B-D1C6-4B4D-A0FD-8DDC63A2B3FE','billedHcpcsCodeOnPri':'C1776','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_HCPCS:4d33689f-8354-0602-4712-4f8c5da3ce0c','dateTimeModified':'2016-06-10T14:31:15.2652168-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':0.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'joint','poName':'CIPG199968-903237','linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'c5181e37-0501-4902-a640-78602e2c1c65','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'602fcc88-61c5-4a1e-97ad-52f50d55ddc7','partSku':'AR-501-UFRB','partName':'!BALANCE UKA FEMORAL CEMENTED SIZE 2, RT-MEDIAL','manufacturerId':'1126cb0d-58ab-0306-992e-48d7ad0d8209','manufacturer':{'id':'1126cb0d-58ab-0306-992e-48d7ad0d8209','name':'Arthrex'},'hcpcsCode':'C1776','hcpcsId':'278A9E8B-D1C6-4B4D-A0FD-8DDC63A2B3FE','quantity':1.0,'enteredUnitCost':1500.00,'mfrUnitCost':1430.00,'mfrDiscUnitCost':1430.00,'multiplier':1,'billedQuantity':1,'billedUnitPrice':4995.00,'billedLineAmt':4995.00,'allowedUnitPrice':4995.00,'allowedLineAmt':4995.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':0.00,'calculatedUnitCost':1040.00,'calculatedLineTax':44.72,'calculatedLineShipping':0.00,'calculatedLineCost':1084.72,'mac':1191.60,'serialNumber':null,'lotNumber':null,'macEnabled':false,'maicDisableReason':0,'poType':{'id':'','name':'','description':''},'payFacility':false,'partTypeName':'Disposables','partTaxCategory':null,'poId':null,'multiPackPoId':null,'poDateAdd':null,'debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':31,'partCost':{'id':'d477e927-b51f-40a5-8f93-7022f8f7132d','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'513109e9-a881-1fe3-09d8-4dde663a91c3','partSku':'10-403','partName':'MyoSure Tissue Removal Device','manufacturerId':'3238dfb8-c646-349b-25c3-494fc126dd9a','payFacilityFlag':false,'quantityUsed':1.00,'mfrListPrice':1300.0000,'mfrDiscountUnitCost':1040.0000,'enteredUnitCost':0.0000,'estimatedUnitCost':1040.0000,'maicIsEnabled':false,'maicUnitCost':1191.6000,'maicReimbursePct':0.0000,'maicCalcReasons':'-10','calculatedLineTax':44.7200,'enteredLineTax':0.0000,'calculatedLineShipping':0.0000,'enteredLineShipping':0.0000,'poUnitCost':1040.0000,'poEstimatedLineTax':44.7200,'poEstimatedLineShipping':0.0000,'poLineCost':1040.0000,'poLineCostTax':1084.7200,'poTotalLineCost':1084.7200,'deleted':false,'dateTimeModified':'2016-06-16T16:15:21.9523312-04:00','enteredDiscountOptions':''},'partPrice':{'id':'d477e927-b51f-40a5-8f93-7022f8f7132d','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'513109e9-a881-1fe3-09d8-4dde663a91c3','partName':'MyoSure Tissue Removal Device','partSku':'10-403','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':1.00,'poUnitCost':1040.0000,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':1084.7200,'mfrListPrice':1300.0000,'multiplier':1,'billedQuantity':1.00,'billedUnitPrice':1395.0000,'billedLineAmt':1395.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':1395.0000,'expReimburseLineAmt':1395.0000,'hcpcsId':'CC4837EE-756A-4CC3-B486-315E2ED09E06','hcpcsCode':'A4649','billedHcpcsIdOnPri':'CC4837EE-756A-4CC3-B486-315E2ED09E06','billedHcpcsCodeOnPri':'A4649','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_PART_CATEGORY_HCPCS:f2be67dc-6354-eada-3158-4f8c5d137644','dateTimeModified':'2016-06-16T16:15:23.5593312-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':0.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':3,'ipgPartNumber':'wand','poName':null,'linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'d477e927-b51f-40a5-8f93-7022f8f7132d','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'513109e9-a881-1fe3-09d8-4dde663a91c3','partSku':'10-403','partName':'MyoSure Tissue Removal Device','manufacturerId':'3238dfb8-c646-349b-25c3-494fc126dd9a','manufacturer':{'id':'3238dfb8-c646-349b-25c3-494fc126dd9a','name':'Hologic'},'hcpcsCode':'A4649','hcpcsId':'CC4837EE-756A-4CC3-B486-315E2ED09E06','quantity':1.0,'enteredUnitCost':0.00,'mfrUnitCost':1300.00,'mfrDiscUnitCost':1040.00,'multiplier':1,'billedQuantity':1,'billedUnitPrice':1395.00,'billedLineAmt':1395.00,'allowedUnitPrice':1395.00,'allowedLineAmt':1395.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':55.00,'calculatedUnitCost':100.00,'calculatedLineTax':3.66,'calculatedLineShipping':55.00,'calculatedLineCost':558.66,'mac':95.43,'serialNumber':null,'lotNumber':null,'macEnabled':true,'maicDisableReason':0,'poType':{'id':'1','name':'C','description':'CPA - Pay Facility'},'payFacility':true,'partTypeName':'Implantables','partTaxCategory':null,'poId':'b14ef9bd-c813-ab2f-5060-575b0a7e1530','multiPackPoId':null,'poDateAdd':'2016-06-10T00:00:00','debitActualPartId':null,'debitedQuantity':-2.0,'displaySortOrder':41,'partCost':{'id':'e0f8d333-91bf-4e5c-992a-04057e233dc3','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'9dbbd43d-dc70-22c2-b46f-50045b25cb66','partSku':'PANL-35140-TS','partName':'Polyaxial Screw Non-Locking 3.5 x 14mm','manufacturerId':'44b8e3dd-95b7-05b3-c9dd-4e04c225b597','payFacilityFlag':true,'quantityUsed':5.00,'mfrListPrice':99.0000,'mfrDiscountUnitCost':89.0000,'enteredUnitCost':100.0000,'estimatedUnitCost':100.0000,'maicIsEnabled':true,'maicUnitCost':95.4300,'maicReimbursePct':100.0000,'maicCalcReasons':'1','calculatedLineTax':3.6600,'enteredLineTax':3.6600,'calculatedLineShipping':0.0000,'enteredLineShipping':55.0000,'poUnitCost':95.4300,'poEstimatedLineTax':3.6600,'poEstimatedLineShipping':55.0000,'poLineCost':477.1500,'poLineCostTax':480.8100,'poTotalLineCost':535.8100,'deleted':false,'dateTimeModified':'2016-06-10T14:29:35.1102023-04:00','enteredDiscountOptions':''},'partPrice':{'id':'e0f8d333-91bf-4e5c-992a-04057e233dc3','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'9dbbd43d-dc70-22c2-b46f-50045b25cb66','partName':'Polyaxial Screw Non-Locking 3.5 x 14mm','partSku':'PANL-35140-TS','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':5.00,'poUnitCost':95.4300,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':535.8100,'mfrListPrice':99.0000,'multiplier':1,'billedQuantity':5.00,'billedUnitPrice':382.0000,'billedLineAmt':1910.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':382.0000,'expReimburseLineAmt':1910.0000,'hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','hcpcsCode':'C1713','billedHcpcsIdOnPri':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','billedHcpcsCodeOnPri':'C1713','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_HCPCS:563904a7-8ddb-99d1-487e-4f8c5d39ec97','dateTimeModified':'2016-06-10T14:29:36.6323545-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':3.6600,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'screw','poName':'CIPG199968-903237','linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'e0f8d333-91bf-4e5c-992a-04057e233dc3','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'9dbbd43d-dc70-22c2-b46f-50045b25cb66','partSku':'PANL-35140-TS','partName':'Polyaxial Screw Non-Locking 3.5 x 14mm','manufacturerId':'44b8e3dd-95b7-05b3-c9dd-4e04c225b597','manufacturer':{'id':'44b8e3dd-95b7-05b3-c9dd-4e04c225b597','name':'Skeletal Dynamics'},'hcpcsCode':'C1713','hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','quantity':5.0,'enteredUnitCost':100.00,'mfrUnitCost':99.00,'mfrDiscUnitCost':89.00,'multiplier':1,'billedQuantity':5,'billedUnitPrice':382.00,'billedLineAmt':1910.00,'allowedUnitPrice':382.00,'allowedLineAmt':1910.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':-22.00,'calculatedUnitCost':100.00,'calculatedLineTax':-1.46,'calculatedLineShipping':-22.00,'calculatedLineCost':-223.46,'mac':95.43,'serialNumber':null,'lotNumber':null,'macEnabled':true,'maicDisableReason':0,'poType':{'id':'','name':'C','description':''},'payFacility':true,'partTypeName':'Implantables','partTaxCategory':null,'poId':'ca84f0da-5db3-4d47-4218-575b122302b7','multiPackPoId':null,'poDateAdd':'2016-06-10T00:00:00','debitActualPartId':'e0f8d333-91bf-4e5c-992a-04057e233dc3','debitedQuantity':0.0,'displaySortOrder':42,'partCost':{'id':'75F78339-5AE0-4435-BA94-EAA04767CCE1','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'9dbbd43d-dc70-22c2-b46f-50045b25cb66','partSku':'PANL-35140-TS','partName':'Polyaxial Screw Non-Locking 3.5 x 14mm','manufacturerId':'44b8e3dd-95b7-05b3-c9dd-4e04c225b597','payFacilityFlag':true,'quantityUsed':-2.00,'mfrListPrice':99.0000,'mfrDiscountUnitCost':89.0000,'enteredUnitCost':100.0000,'estimatedUnitCost':100.0000,'maicIsEnabled':true,'maicUnitCost':95.4300,'maicReimbursePct':100.0000,'maicCalcReasons':'1','calculatedLineTax':-1.4600,'enteredLineTax':0.0000,'calculatedLineShipping':0.0000,'enteredLineShipping':-22.0000,'poUnitCost':95.4300,'poEstimatedLineTax':-1.4600,'poEstimatedLineShipping':-22.0000,'poLineCost':-190.8600,'poLineCostTax':-192.3200,'poTotalLineCost':-214.3200,'deleted':false,'dateTimeModified':'2016-06-10T14:43:49.1726-04:00','enteredDiscountOptions':''},'partPrice':{'id':'75F78339-5AE0-4435-BA94-EAA04767CCE1','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'9dbbd43d-dc70-22c2-b46f-50045b25cb66','partName':'Polyaxial Screw Non-Locking 3.5 x 14mm','partSku':'PANL-35140-TS','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':-2.00,'poUnitCost':95.4300,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':-214.3200,'mfrListPrice':99.0000,'multiplier':1,'billedQuantity':-2.00,'billedUnitPrice':382.0000,'billedLineAmt':-764.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':382.0000,'expReimburseLineAmt':-764.0000,'hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','hcpcsCode':'C1713','billedHcpcsIdOnPri':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','billedHcpcsCodeOnPri':'C1713','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_HCPCS:563904a7-8ddb-99d1-487e-4f8c5d39ec97','dateTimeModified':'2016-06-10T14:43:50.1046932-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':3.6600,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'screw','poName':'CIPG199968-903237DM','linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'75F78339-5AE0-4435-BA94-EAA04767CCE1','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'9dbbd43d-dc70-22c2-b46f-50045b25cb66','partSku':'PANL-35140-TS','partName':'Polyaxial Screw Non-Locking 3.5 x 14mm','manufacturerId':'44b8e3dd-95b7-05b3-c9dd-4e04c225b597','manufacturer':{'id':'44b8e3dd-95b7-05b3-c9dd-4e04c225b597','name':'Skeletal Dynamics'},'hcpcsCode':'C1713','hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','quantity':-2.0,'enteredUnitCost':100.00,'mfrUnitCost':99.00,'mfrDiscUnitCost':89.00,'multiplier':1,'billedQuantity':-2,'billedUnitPrice':382.00,'billedLineAmt':-764.00,'allowedUnitPrice':382.00,'allowedLineAmt':-764.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':2.00,'calculatedUnitCost':25.00,'calculatedLineTax':2.00,'calculatedLineShipping':2.00,'calculatedLineCost':79.00,'mac':0.00,'serialNumber':null,'lotNumber':null,'macEnabled':true,'maicDisableReason':-1,'poType':{'id':'1','name':'C','description':'CPA - Pay Facility'},'payFacility':true,'partTypeName':'Biologics','partTaxCategory':null,'poId':null,'multiPackPoId':null,'poDateAdd':null,'debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':51,'partCost':{'id':'a3528eda-1d5e-4b92-a8f8-653a42c3138a','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'bd8ec712-acaa-84a1-c3dc-558431f63e26','partSku':'452010BME','partName':'MATRIXCELLECT 100 PUTTY (SYRINGE) 1.0CC','manufacturerId':'739c5a14-529a-3dd9-2724-48d7ad9d6711','payFacilityFlag':true,'quantityUsed':3.00,'mfrListPrice':700.0000,'mfrDiscountUnitCost':647.5000,'enteredUnitCost':25.0000,'estimatedUnitCost':25.0000,'maicIsEnabled':false,'maicUnitCost':0.0000,'maicReimbursePct':0.0000,'maicCalcReasons':'1,-1','calculatedLineTax':0.0000,'enteredLineTax':2.0000,'calculatedLineShipping':0.0000,'enteredLineShipping':2.0000,'poUnitCost':25.0000,'poEstimatedLineTax':2.0000,'poEstimatedLineShipping':2.0000,'poLineCost':75.0000,'poLineCostTax':77.0000,'poTotalLineCost':79.0000,'deleted':false,'dateTimeModified':'2016-06-14T16:00:45.4637663-04:00','enteredDiscountOptions':''},'partPrice':{'id':'a3528eda-1d5e-4b92-a8f8-653a42c3138a','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'bd8ec712-acaa-84a1-c3dc-558431f63e26','partName':'MATRIXCELLECT 100 PUTTY (SYRINGE) 1.0CC','partSku':'452010BME','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':3.00,'poUnitCost':25.0000,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':79.0000,'mfrListPrice':700.0000,'multiplier':1,'billedQuantity':3.00,'billedUnitPrice':749.0000,'billedLineAmt':2247.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':749.0000,'expReimburseLineAmt':2247.0000,'hcpcsId':'FA6B6F52-8129-4DA0-B8FB-F0D8F5BABDD4','hcpcsCode':'C9359','billedHcpcsIdOnPri':'FA6B6F52-8129-4DA0-B8FB-F0D8F5BABDD4','billedHcpcsCodeOnPri':'C9359','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_HCPCS:6d791f45-0857-9f20-3193-4f8c5d257bd7','dateTimeModified':'2016-06-14T16:00:48.2267663-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':2.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':null,'poName':null,'linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'a3528eda-1d5e-4b92-a8f8-653a42c3138a','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'bd8ec712-acaa-84a1-c3dc-558431f63e26','partSku':'452010BME','partName':'MATRIXCELLECT 100 PUTTY (SYRINGE) 1.0CC','manufacturerId':'739c5a14-529a-3dd9-2724-48d7ad9d6711','manufacturer':{'id':'739c5a14-529a-3dd9-2724-48d7ad9d6711','name':'Biomedical Enterprises (BME)'},'hcpcsCode':'C9359','hcpcsId':'FA6B6F52-8129-4DA0-B8FB-F0D8F5BABDD4','quantity':3.0,'enteredUnitCost':25.00,'mfrUnitCost':700.00,'mfrDiscUnitCost':647.50,'multiplier':1,'billedQuantity':3,'billedUnitPrice':749.00,'billedLineAmt':2247.00,'allowedUnitPrice':749.00,'allowedLineAmt':2247.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':2.00,'calculatedUnitCost':25.00,'calculatedLineTax':2.00,'calculatedLineShipping':2.00,'calculatedLineCost':79.00,'mac':170.10,'serialNumber':null,'lotNumber':null,'macEnabled':true,'maicDisableReason':-1,'poType':{'id':'1','name':'C','description':'CPA - Pay Facility'},'payFacility':true,'partTypeName':'Implantables','partTaxCategory':null,'poId':null,'multiPackPoId':null,'poDateAdd':null,'debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':61,'partCost':{'id':'93d4c941-1c7b-4eae-9a2b-e5429b717433','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'89a51a13-b797-8bd4-1a01-571938d41e50','partSku':'07-412','partName':' 2.7 X 12MM NL SCREW','manufacturerId':'8ff3eeb1-3009-03c2-6246-4919f3a9720e','payFacilityFlag':true,'quantityUsed':3.00,'mfrListPrice':189.0000,'mfrDiscountUnitCost':189.0000,'enteredUnitCost':25.0000,'estimatedUnitCost':25.0000,'maicIsEnabled':false,'maicUnitCost':170.1000,'maicReimbursePct':0.0000,'maicCalcReasons':'1,-1','calculatedLineTax':0.0000,'enteredLineTax':2.0000,'calculatedLineShipping':0.0000,'enteredLineShipping':2.0000,'poUnitCost':25.0000,'poEstimatedLineTax':2.0000,'poEstimatedLineShipping':2.0000,'poLineCost':75.0000,'poLineCostTax':77.0000,'poTotalLineCost':79.0000,'deleted':false,'dateTimeModified':'2016-06-14T16:00:45.7217663-04:00','enteredDiscountOptions':''},'partPrice':{'id':'93d4c941-1c7b-4eae-9a2b-e5429b717433','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'89a51a13-b797-8bd4-1a01-571938d41e50','partName':' 2.7 X 12MM NL SCREW','partSku':'07-412','isPaidForByIpg':true,'isPaidForByIns':true,'poQuantity':3.00,'poUnitCost':25.0000,'payFacility':false,'maicIsEnabled':false,'maicUnitCost':0.0,'poTotalLineCost':79.0000,'mfrListPrice':189.0000,'multiplier':1,'billedQuantity':3.00,'billedUnitPrice':382.0000,'billedLineAmt':1146.0000,'expReimbursePct':100.0,'expReimburseUnitPrice':382.0000,'expReimburseLineAmt':1146.0000,'hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','hcpcsCode':'C1713','billedHcpcsIdOnPri':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','billedHcpcsCodeOnPri':'C1713','priHcpcsUpdatedByUser':false,'billedHcpcsIdOnSec':null,'billedHcpcsCodeOnSec':null,'processingNotes':'LINE_PRICE_BY_HCPCS:563904a7-8ddb-99d1-487e-4f8c5d39ec97','dateTimeModified':'2016-06-14T16:00:48.1677663-04:00','poLineTax':0.0,'poLineShipping':0.0},'enteredLineTax':2.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'Screw','poName':null,'linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'93d4c941-1c7b-4eae-9a2b-e5429b717433','patientProcedureId':'b8927cae-ca90-a39c-4380-56eaf519aa99','partId':'89a51a13-b797-8bd4-1a01-571938d41e50','partSku':'07-412','partName':' 2.7 X 12MM NL SCREW','manufacturerId':'8ff3eeb1-3009-03c2-6246-4919f3a9720e','manufacturer':{'id':'8ff3eeb1-3009-03c2-6246-4919f3a9720e','name':'Wright Medical Technology'},'hcpcsCode':'C1713','hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','quantity':3.0,'enteredUnitCost':25.00,'mfrUnitCost':189.00,'mfrDiscUnitCost':189.00,'multiplier':1,'billedQuantity':3,'billedUnitPrice':382.00,'billedLineAmt':1146.00,'allowedUnitPrice':382.00,'allowedLineAmt':1146.00}];
                return $http.post(url)
                    .success(function(data) {
                        //self.parts = data;
                    }).then(function() {
                        self.anyCostModified = false;
                        self.anyPriceModified = false;
                    });
            };

            // Load what's in the database...
            self.loadParts = function () {
                return loadParts(partsLoadUrl + self.ppId);
            };

            self.reCalculateAdjustments = function () {

                if (!self.header.procedureResponsibility)
                    return;

                self.header.procedureResponsibility.overrideCarrierWriteOff = _.some(self.header.adjustments, function (value) {
                    return value.reason.isEnabled && value.entityCode === 'C';
                });

                self.header.procedureResponsibility.carrierWriteOff_Ovrrd = 0;
                _.forEach(self.header.adjustments, function(value) {
                    if (value.reason.isEnabled && value.entityCode === 'C')
                        self.header.procedureResponsibility.carrierWriteOff_Ovrrd += value.adjustmentAmount;
                });

                self.header.procedureResponsibility.overridePatientWriteOff = _.some(self.header.adjustments, function (value) {
                    return value.reason.isEnabled && value.entityCode === 'P';
                });


                self.header.procedureResponsibility.patientWriteOff_Ovrrd = 0;
                _.forEach(self.header.adjustments, function (value) {
                    if (value.reason.isEnabled && value.entityCode === 'P')
                        self.header.procedureResponsibility.patientWriteOff_Ovrrd += value.adjustmentAmount;
                });

            };

            // recalculate costs
            self.reCalculateCosts = function () {
                return loadParts(recalculateUrl + self.ppId).then(self.reLoadCase);
            };

            // recalculate costs and save
            self.savePartsToActualParts = function () {
                self.dataLoadInProgress = true;

                return $http.post(saveAndPrintUrl + self.ppId)
                .then(function () {
                    self.loadCase(self.ppId);
                        self.dataLoadInProgress = false;
                    });
            };

            self.hcpcsUpdated = function(item) {
                var pp = item.partPrice;
                self.anyPriceModified = true;
                pp.modified = true;
            };

            self.recalcPartPrice = function (item) {
                var pp = item.partPrice;

                self.anyPriceModified = true;
                pp.modified = true;
                pp.billedLineAmt = pp.billedQuantity * pp.billedUnitPrice;
                pp.expReimburseUnitPrice = pp.billedUnitPrice * (pp.expReimbursePct / 100);
                pp.expReimburseLineAmt = pp.billedQuantity * pp.expReimburseUnitPrice;

                calculatedHeaderValue();
                validateBilled();
                validateProfit();
            };

            function validateProfit() {
                if (!self.header.procedureResponsibility) return;

                self.negativeProfit = self.header.procedureResponsibility.profitAmount < 0 ||
                                     ((self.anyPriceModified || self.anyCostModified) &&
                                     (self.calculatedPartTotalExpBilled < self.calculatedPartTotalCost));

                self.profitInBandingReason = '';
                self.profitInBanding = false;

                if (self.header.procedureResponsibility && self.header.procedureResponsibility.approvalRequired && !self.header.procedureResponsibility.approved) {
                    var margin = self.header.procedureResponsibility.profitPct;

                    if (margin > self.header.primaryCarrier.bandingMaxProfitMargin) {
                        self.profitInBanding = true;
                        self.profitInBandingReason = "Profit is greater than " + self.header.primaryCarrier.bandingMaxProfitMargin + '%.';
                    } else if (margin < self.header.primaryCarrier.bandingMinProfitMargin) {
                        self.profitInBanding = true;
                        self.profitInBandingReason = "Profit is less than " + self.header.primaryCarrier.bandingMinProfitMargin + '%.';
                    }
                }
            }

            function validateBilled() {
                self.totalBilledInBandingReason = '';
                self.totalBilledInBanding = false;
                if (self.header.procedureResponsibility && self.header.procedureResponsibility.approvalRequired && !self.header.procedureResponsibility.approved) {
                    self.totalBilledInBanding = self.header.priceSummary.billedAmount > self.header.primaryCarrier.bandingMaxBilled;
                    if (self.totalBilledInBanding)
                        self.totalBilledInBandingReason = "Total billed is greater than $" + self.header.primaryCarrier.bandingMaxBilled + '.';
                }
            }

            function calculatedHeaderValue() {

                var partCostExists = _.some(self.parts, function(item) { return item.partCost != null; });
                var partPriceExists = _.some(self.parts, function(item) { return item.partPrice != null; });

                if (partCostExists) {
                    self.calculatedPartCost = self.anyCostModified ? _.sum(self.parts, 'partCost.poLineCost') : self.header.costSummary.partsCost;
                    self.calculatedPartTotalCost = self.anyCostModified ? _.sum(self.parts, 'partCost.poTotalLineCost') : self.header.costSummary.totalCost;
                }

                if (partPriceExists) {
                    self.calculatedPartTotalBilled = self.anyPriceModified ? _.sum(self.parts, 'partPrice.billedLineAmt') : self.header.priceSummary.billedAmount;
                    self.calculatedPartTotalExpBilled = self.anyPriceModified ? _.sum(self.parts, 'partPrice.expReimburseLineAmt') : self.header.priceSummary.estAllowedAmount;
                }

                if (partPriceExists && partCostExists) {
                    //Calculate profit
                    var netAllowed = self.calculatedPartTotalExpBilled + self.header.procedureResponsibility.patientWriteoffAmount + self.header.procedureResponsibility.carrierWriteoffAmount;
                    self.profitMargin = (netAllowed - self.calculatedPartTotalCost);
                    self.profitPct = ((self.profitMargin) / netAllowed) * 100;

                    //Calculate responsibility
                    var remainingDeductable = self.header.procedureBenefit.deductableMax - self.header.procedureBenefit.deductableMet;
                    self.calculatedPatientResponsibility = Math.min(remainingDeductable, self.calculatedPartTotalExpBilled);
                }
            }

            function calculateOldHeaderValue() {
                self.header.oldFinalCarResp = self.header.actualCarrierResp - self.header.carrierWriteOff;
                self.header.oldFinalMemResp = self.header.actualMemberResp - self.header.patientWriteOff;
                var netAllowed = self.header.oldFinalCarResp + self.header.oldFinalMemResp;
                self.header.oldProfitMargin = netAllowed - self.header.totalPoCost;
                self.header.oldProfitPct = (self.header.oldProfitMargin / netAllowed) * 100;
            }

            self.updatePartCost = function (item) {

                var pc = item.partCost;
                var pp = item.partPrice;

                self.anyCostModified = true;
                pc.modified = 1;
                pc.mfrDiscountUnitCost = pc.mfrDiscountUnitCost || 0;
                pc.enteredUnitCost = pc.enteredUnitCost || 0;
                pc.mfrDiscountUnitCost = pc.mfrDiscountUnitCost !== 0 ? pc.mfrDiscountUnitCost : pc.mfrListPrice;
                pc.estimatedUnitCost = pc.enteredUnitCost !== 0 ? pc.enteredUnitCost : pc.mfrDiscountUnitCost;
                // pc.poEstimatedLineTax = pc.enteredLineTax !== 0 ? pc.enteredLineTax : pc.calculatedLineTax;
                pc.poEstimatedLineShipping = pc.enteredLineShipping !== 0 ? pc.enteredLineShipping : pc.calculatedLineShipping;

                var maicUnitCost = 0;
                if (pc.maicIsEnabled && pc.payFacilityFlag) {
                    maicUnitCost = pc.maicUnitCost * (pc.maicReimbursePct / 100);
                }

                pc.poUnitCost = pc.estimatedUnitCost;

                if (pc.maicIsEnabled && maicUnitCost > 0 && maicUnitCost < pc.poUnitCost)
                    pc.poUnitCost = maicUnitCost;

                pc.poLineCost = pc.poUnitCost * pc.quantityUsed;
                pc.poLineCostTax = pc.poLineCost + pc.poEstimatedLineTax;
                pc.poTotalLineCost = pc.poLineCost + pc.poEstimatedLineTax +
                                     (pc.payFacilityFlag ? pc.poEstimatedLineShipping : 0);
                
                // update cost for part prices!
                pp.poUnitCost = pc.poUnitCost;
                pp.poTotalLineCost = pc.poTotalLineCost;

                calculatedHeaderValue();
                validateBilled();
                validateProfit();
            };


            // Saving the part costs triggers a reload of the case header and parts
            self.savePartCosts = function() {
                var url = partCostsUpdateUrl + self.ppId;

                var updatedParts = [];
                _(self.parts).forEach(function(item) {
                    if (item.partCost && item.partCost.modified) updatedParts.push(item);
                }).value();

                console.info("update parts price for case", updatedParts);

                return $http.post(url, updatedParts)
                    .success(function() {
                        self.loadCase();
                    }).error(function(e) {
                        console.error(e);
                    });

            };

            // Saving the part costs triggers a reload of the case header and parts
            self.savePartPrices = function() {

                var updatedParts = [];

                _(self.parts).forEach(function (item) {
                    if (item.partPrice && item.partPrice.modified) updatedParts.push(item);
                }).value();

                console.info("update parts for case", updatedParts);

                return $http.post(partPricesUpdateUrl + self.ppId, updatedParts)
                    .success(function (i) {
                        _.forEach(self.parts, function (value) {
                            value.partPrice.modified = false;
                        });
                        self.anyPriceModified = false;
                        self.loadCase();
                    }).error(function (e) {
                        console.error(e);
                    });
            };
        }
    ];

    
    angular.module('app').service(modelName, modelFunc);

})();