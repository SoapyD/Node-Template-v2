const mongoose = require("mongoose");


const dynamicRouteSchema = new mongoose.Schema({
	model: String //TYPE: Describes the model being used
	,description: String //DESCRIPTION: A description of the model that'll be published in the admin index
	,sort: String //SORT: a string that gets converted into JSON and passed to the ind process when the show route is run
	,editable: Boolean //EDITABLE: defines if the dataset can be editted, so will add an edit column and buttons for each record 
	,sub_data: [String] //SUB_DATA: an array which determines which model data sets are returned, which can then be used in edit select elements
	
	,index: [{
		column_width: Number //COLUMN WIDTH: sets the width of the data column on the "show" view
		,column_name: String //COLUMN NAME: the print name of the column in the "show" view
		,value: [String] //VALUE: Array that determines which field is returned and printed in the edit screen. Nested fields can be accessed by multiple items in the array Single select elements don't need a foreach loop, use the type field instead
		,foreach: [String] //FOREACH: Used in conjunction with the VALUE field to return multiple values and make them selectable in a multi-select element. 
		,sub_data: String //SUB_DATA: used in conunjction with the parent sub_data array, determines which dataset is used in the select statement generated
		,readonly: Boolean //READONLY: Determines if the field is set to read only in the edit screen. Won't be passed to the server when the record is saved 
		,element_type: String //TYPE: field type in the edit screen, determines the input type of the html generated.
		,header: String //HEADER: prints a header field on the edit screen
		,startrow: Boolean //STARTROW: creates a new row in the edit screen
		,endrow: Boolean //ENDROW: ends a row in the edit screen
	}]	
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("DynamicRoute", dynamicRouteSchema);
