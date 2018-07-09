//@ts-check
var myCapId = "PW-APZA-17-00035";  
var myCapId = "17-MOSF-00004";
var myCapId = "ENF-PMNT-18-000002-1";
//Parent License:  RRE-BRO-LIC-1362
var myUserId = "ADMIN";

/* ASA  */   //var eventName = "ApplicationSubmitAfter";

/* WTUA */  
var eventName = "WorkflowTaskUpdateAfter";  
var wfTask = "Frog";	  
var wfStatus = "Croak";  

//wfDateMMDDYYYY = "08/02/2016"; 
//wfComment = "";

/* IRSA */  //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Rejected"; inspComment = "Number of violations";  inspId="1878121";
/* ISA  */  //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */  //var eventName = "PaymentReceiveAfter";
/* CTRCA */	//var eventName = "ConvertToRealCAPAfter";

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = false; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

try {
    var showDebug = true;

    var jsonDATA = {};
    

    var testRecord = new TestRecord(capId);

    var assertArray = [];
    assertArray[0] = "Assert record status equals 'Open': " + testRecord.assertStatus("Open");
    assertArray[1] = "Assert record custom Id equals 'ENF-PMNT-18-000002-1': " + testRecord.assertCustomId("ENF-PMNT-18-000002-1");
    assertArray[2] = "Assert inspection type 'Enforcement Property Maintenance' exists on record: " + testRecord.assertInspectionExists("Enforcement Property Maintenance");
    assertArray[3] = "Assert custom field 'Reference Type' has value 'REFERENCE TYPE' on record: " + testRecord.assertCustomFieldValue("Reference Type", "REFERENCE TYPE");
    assertArray[4] = "Assert workflow task 'Investigation' has the status of 'Citation': " +testRecord.assertWorkflowTaskStatus("Investigation","Citation");
    assertArray[5] = "Assert workflow task 'Intake' is Active: " + testRecord.assertWorkflowTaskActive("Intake");

    logDebug("-------------------------------------------------------------");
    for (var i = 0; i < assertArray.length; i++) {
        logDebug(assertArray[i]);
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message);
}
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", debug);


