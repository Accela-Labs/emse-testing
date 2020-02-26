//@ts-check
/*===========================================

Title: INCLUDES_EMSETESTING

Purpose: Library of functions for EMSE unit and functional testing

Author: Chris Hansen

Functional Area: EMSE

Description: Library of functions for EMSE unit and functional testing

Reviewed By:

Script Type: (EMSE, EB, Pageflow, Batch) : EMSE

General Purpose/Client Specific: General Purpose

Parameters: varies depend on function

=========================================== */

/**
 * Creates a record from the provided JSON object. 
 * 
 * @param {JSON} recordTypeJSON 
 * @returns record object
 */
function MockupRecord(recordTypeJSON) {
    var functTitle = "MockupRecord: ";

    if (typeof (recordTypeJSON) == "undefined" || recordTypeJSON == null) {
        logDebug(functTitle + "JSON parameter is undefined or null");
        return "";
    }

    var recordType = recordTypeJSON.recordType || "";
    var applicationName = recordTypeJSON.applicationName || "";
    var description = recordTypeJSON.description || "";
    if (recordType == "") {
        logDebug(functTitle + "Record type is blank or null");
        return "";
    }

    var recordObj = createCap(recordType, applicationName);

    var recObj = new Record(recordObj);

    //add addresses
    var addresses = recordTypeJSON.addresses || "";
    if (addresses != "") {
        addresses.forEach(function (address) {
            recObj.addAddress(address);
        });
    }

    //add contacts
    var contacts = recordTypeJSON.contacts || "";
    if (contacts != "") {
        contacts.forEach(function (contact) {
            recObj.addContact(contact);
        });
    }

    //add professionals
    var professionals = recordTypeJSON.licenseProfessionals || "";
    if (professionals != "") {
        professionals.forEach(function (professional) {
            recObj.addProfessional(professional);
        });
    }

    //add custom fields
    var customFields = recordTypeJSON.customFields || "";
    if (customFields != "") {
        customFields.forEach(function (customField) {
            recObj.addCustomField(customField);
        });
    }

    return recordObj;
}

/**
 * Constructor function for the TestRecord prototypes.
 * 
 * @memberof TestRecord
 * @param {string or object} Record id string or record object
 */
function TestRecord(id) {
    var functTitle = ((this.constructor == null) ? "undefined" : this.constructor.name) + ": ";

    if (typeof id == "undefined") {
        throw functTitle + "id parameter is undefined.";
    }
    if (id == null || id == "") {
        throw functTitle + "id parameter can't be null or blank when initialized.";
    }
    if (id.getClass && id.getClass().getName().equals("com.accela.aa.aamain.cap.CapIDModel")) {
        this.recordObj = id;
        this.altIdObj = id.getCustomID();
        if (!this.altIdObj) {
            this.recordObj = aa.cap.getCapID(id.getID1(), id.getID2(), id.getID3()).getOutput();
            this.altIdObj = this.recordObj.getCustomID();
        }
    } else {
        id = id + "";
        this.altIdObj = id;
        this.recordObj = aa.cap.getCapID(id).getOutput();
    }
    if (this.recordObj == null) {
        throw functTitle + "record with ID " + id + " does not exist";
    }
    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "initialized test record " + this.altIdObj);
}

/**
 * Verifies that the record status matches the parameter
 * @param {string} statusString status to test against the record.
 * @memberof TestRecord
 * @returns {boolean} True if matched, false if not.
 */
TestRecord.prototype.assertStatus = function (statusString) {
    var functTitle = ".assertStatus: ";

    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "Assert Record Status ");

    var assertRetVal = false;
    var recordObj = aa.cap.getCap(this.recordObj).getOutput();
    var existingStatusString = recordObj.getCapStatus();

    logDebug(functTitle + "** Expected Record Status: " + statusString);
    logDebug(functTitle + "** Existing Record Status: " + existingStatusString);

    if (existingStatusString == statusString) {
        logDebug(functTitle + "** TRUE: existing Record Status = asserted Record Status.");
        assertRetVal = true;
    } else {
        logDebug(functTitle + "** FALSE: existing Record Status != asserted Record Status.");
    }

    return assertRetVal;
};

/**
 * [[DESCRIPTION]]
 * @param {*} [[OPTIONAL/REQUIRED]]. [[DESCRIPTION]].
 * @memberof TestRecord
 * @returns {*} [[DESCRIPTION]].
 */
TestRecord.prototype.assertCustomId = function (customIdString) {
    var functTitle = ".assertCustomId: ";

    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "Assert Record Custom Id ");

    var assertRetVal = false;

    logDebug(functTitle + "** Expected Record Custom Id: " + customIdString);
    logDebug(functTitle + "** Existing Record Custom Id: " + this.recordObj.customID);

    if (customIdString == this.recordObj.customID) {
        logDebug(functTitle + "** TRUE: existing Record Custom Id = asserted Record Custom Id.");
        assertRetVal = true;
    } else {
        logDebug(functTitle + "** FALSE: existing Record Custom Id != asserted Record Custom Id.");
    }

    return assertRetVal;
};

/**
 * [[DESCRIPTION]]
 * @param {*} [[OPTIONAL/REQUIRED]]. [[DESCRIPTION]].
 * @memberof TestRecord
 * @returns {*} [[DESCRIPTION]].
 */
TestRecord.prototype.assertInspectionExists = function (inspectionTypeString) {
    var functTitle = ".assertInspectionExists: ";

    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "Assert Inspection Type Exists");

    var assertRetVal = false;
    var inspResultObj = aa.inspection.getInspections(this.recordObj);

    if (inspResultObj.getSuccess()) {
        var inspectionList = inspResultObj.getOutput();
        if (inspectionList.length > 0) {

            logDebug(functTitle + "** Expected Inspection Type on Record: " + inspectionTypeString);

            for (var i = 0; i < inspectionList.length; i++) {
                var existingInspection = inspectionList[i];

                logDebug(functTitle + "** Existing Inspection Type on Record: " + inspectionList[i].inspectionType);

                if (inspectionTypeString == inspectionList[i].inspectionType) {
                    logDebug(functTitle + "** TRUE: inspection type '" + inspectionTypeString + "' exists as an inspection on the record.");
                    assertRetVal = true;
                }
            }
            if (!assertRetVal) {
                logDebug(functTitle + "** FALSE: inspection type '" + inspectionTypeString + "' doesn't exist as an inspection on the record.");
            }
        } else {
            logDebug(functTitle + "** FALSE: No inspections found on the record.");
        }
    }

    return assertRetVal;
};

/**
 * [[DESCRIPTION]]
 * @param {*} [[OPTIONAL/REQUIRED]]. [[DESCRIPTION]].
 * @memberof TestRecord
 * @returns {*} [[DESCRIPTION]].
 */
TestRecord.prototype.assertCustomFieldValue = function (customFieldNameString, customFieldValueString) {
    var functTitle = ".assertCustomFieldValue: ";

    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "Assert Custom Field has specific value");

    var assertRetVal = false;
    var existingCustomFieldValue = getAppSpecific(customFieldNameString, this.recordObj);

    logDebug(functTitle + "** Expected Custom Field Value for '" + customFieldNameString + "' on Record: " + customFieldValueString);
    logDebug(functTitle + "** Existing Custom Field Value for '" + customFieldNameString + "' on Record: " + existingCustomFieldValue);

    if (customFieldValueString == existingCustomFieldValue) {
        logDebug(functTitle + "** TRUE: existing Custom Field Value = asserted Custom Field Value.");
        assertRetVal = true;
    } else {
        logDebug(functTitle + "** FALSE: existing Custom Field Value != asserted Custom Field Value.");
    }

    return assertRetVal;
};

/**
 * [[DESCRIPTION]]
 * @param {*} [[OPTIONAL/REQUIRED]]. [[DESCRIPTION]].
 * @memberof TestRecord
 * @returns {*} [[DESCRIPTION]].
 */
TestRecord.prototype.assertWorkflowTaskStatus = function (workflowTaskString, workflowTaskStatusString) {
    var functTitle = ".assertWorkflowTaskStatus: ";

    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "Assert Workflow Task has specific status");

    var assertRetVal = false;
    var existingWorkflowTaskStatus = taskStatus(workflowTaskString, "", this.recordObj);

    logDebug(functTitle + "** Expected Workflow Status for '" + workflowTaskString + "' on Record: " + workflowTaskStatusString);
    logDebug(functTitle + "** Existing Custom Field Value for '" + workflowTaskString + "' on Record: " + existingWorkflowTaskStatus);

    if (workflowTaskStatusString == existingWorkflowTaskStatus) {
        logDebug(functTitle + "** TRUE: existing Workflow Task Status = asserted Workflow Task Status.");
        assertRetVal = true;
    } else {
        logDebug(functTitle + "** FALSE: existing Workflow Task Status != asserted Workflow Task Status.");
    }

    return assertRetVal;
};

/**
 * [[DESCRIPTION]]
 * @param {*} [[OPTIONAL/REQUIRED]]. [[DESCRIPTION]].
 * @memberof TestRecord
 * @returns {*} [[DESCRIPTION]].
 */
TestRecord.prototype.assertWorkflowTaskActive = function (workflowTaskString) {
    var functTitle = ".assertWorkflowTaskActive: ";

    logDebug(functTitle + "-------------------------------------------------------------");
    logDebug(functTitle + "Assert Workflow Task is active");

    var assertRetVal = false;



    return assertRetVal;
};