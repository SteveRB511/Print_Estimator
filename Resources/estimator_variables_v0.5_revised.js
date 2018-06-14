// JavaScript Document


// >>> denotes areas to fix or check

//var printObject = {
//	material:		stdPaper	prePaper	phoPaper	noritsu		canvas		vinyl
//	laminate:		yes				yes				yes				no				no				no,
//	mount:			yes				yes				yes				yes				no				no,
//	costBasis:	area			area			area			noritsu	length		area,		  
//	note:				paperNote	paperNote	paperNote	norNote 	canNote		vinNote
//	}

//update printObject
//	printObject.material	= materialType;
//	printObject.laminate	= canlaminate;
//	printObject.mount			= canMount;
//	printObject.pricing		= costBasis;
//	printObject.note			= materialNote;


/******************************************************/
/*                       Rates                        */
/******************************************************/

	// Canvas is per linear foot, all others are per sq. ft. Noritsu is just a placeholder
	// Non-Noritsu prints:  smooth    premium   photo   canvas   Noritsu  vinyl
	var gPaperPrices   =   [  2.00,     2.50,     3.00,   25.00,   0.00,    1.00  ];

	// Price: per print. Area: sq. ft. rounded up to next .01 for any mounting	
	// Noritsu Photo prints:  3x5    5x7    8x10    11x14    11x17    12x18
	var gNoritsuPrices =   [  2.00,  3.00,  4.00,   5.00,    6.00,    7.00  ];
	var gNoritsuArea   =	 [  0.11,  0.25,  0.56,   1.07,    1.30,    1.50  ]; 
	
	// paper size rates categories based on sq. ft
	var g_size_rate_area_1      = 1.3;    // sq ft, up to 11 x 17
	var g_size_rate_area_2      = 3.5; 	  // sq ft, larger than 11 x 17, up through 18 x 28
	var g_size_rate_area_3      = 7.5;    // sq ft, larger than 18 x 28, up through 27 x 40

	// large paper size rate based on area alone rather than a size category
	var g_rate_size_L           = 5.30;      // greater than g_size_rate_area_3
		
	// paper size costs per copy
	var g_rate_size_1           = 10.00;    // g_size_rate_area_1 or less  ($7.70/sq ft)
	var g_rate_size_2           = 20.00;    // g_size_rate_area_2 or less  ($5.71/sq ft)
	var g_rate_size_3           = 40.00;    // g_size_rate_area_3 or less  ($5.33/sq ft)

	// laminating rate is per linear foot and mounting rates are per sq ft
	var g_rate_laminate         = 1.00;
	var g_rate_mounting_1       = 5.00;      // 3/16 inch     2014-11-25
	var g_rate_mounting_2       = 7.00;      // 1/2 inch      2014-11-25
	
	// 11 x 17 proof
	var g_rate_proof            = 3.00;
	
	// labor rates per hour
	var g_rate_indirect         = 84.94;   	//2014-11-25
	var g_rate_direct           = 123.96;  	//2014-11-25
	
	// check roll width values             
	var g_max_canvas_roll_width		= 36;			// less a 1" upper border and lower border
	var g_max_paper_roll_width		= 42;			// maximum paper roll width in inches
 	var g_max_laminate_roll_width	= 54 - 2;	// less a 1" upper and lower trim


/******************************************************/
/*                   Initial Values                   */
/******************************************************/

	var g_paper_type_cost = gPaperPrices[ 0 ]; // smooth
	
	//Letter size in sq. ft, rounded up to nearest .01
	var g_paper_size_cost = g_rate_size_1;
	var g_paper_area      = 0.65;

	var	g_laminate_length = 8.5;		
	var g_laminate_cost   = 0.00;
	var g_mounting_cost   = 0.00;

	var g_copies          = 1.0;		// 1 copy
	
	var g_proof_cost      = 0.00;
	
	var g_labor_hours     = 1.00;
	var g_labor_funding   = g_rate_indirect;

	var g_short_side			= 8.5;    // used to restore last paperShortSide when canvas is deselected

/******************************************************/
/*                 Notes and Alerts                   */
/******************************************************/

var gCanNote			= "Cost based on length of roll used";
var gNorNote			=	"";
var gPaperNote		=	"";
var gVinNote	  	=	"";

var gWidthAlert		= "Minimum dimension cannot exceed 42 inches";
var gNoritsuAlert	= "Verify correct Noritsu print size to avoid estimate error!";


/******************************************************/
/*                    Functions                       */
/******************************************************/	
	

function ShowHideOptions( costBasis, canLaminate, canMount, materialNote ){
	'use strict';	
	// size controls
	
	var g_short_side; /* stores disabled material short side/height when length is the basis for pricing */
	
	if( costBasis === "noritsu" ){
		//Show needed controls
		document.getElementById("NORITSUSIZE").style.display  = "block";
		
		//Hide unneeded controls
		document.getElementById("SELECTSIZE").style.display 	= "none";
		document.getElementById("FIELDSIZES").style.display   = "none";
		}
	else if( costBasis === "area" ){
		//Show needed controls
		document.getElementById("SELECTSIZE").style.display 	= "block";
		document.getElementById("FIELDSIZES").style.display   = "block";
		
		//Hide unneeded controls
		document.getElementById("NORITSUSIZE").style.display  = "none";
		
		//Restore previous paper Short Side value and enable control
		document.getElementById("paperShortSide").value			= g_short_side;
		document.getElementById("paperShortSide").disabled	= false;

		}
	else { /* printBasis is length (Canvas) */
		//Show needed controls
			document.getElementById("FIELDSIZES").style.display	= "block";
	
		//Hide unneeded controls
		document.getElementById("NORITSUSIZE").style.display  = "none";
		document.getElementById("SELECTSIZE").style.display 	= "none";
		
		//set short Side to canvas roll width and disable user input
		// store short side for reuse when pricing basis is chnaged to area
		g_short_side = document.getElementById("paperShortSide").value; //store value for reuse with different paper selection
		document.getElementById("paperShortSide").value		= 36;
		document.getElementById("paperShortSide").disabled	= true;
		}
	
	//lamination and mounting controls	
	if( canLaminate === true ){
		document.getElementById("LAMINATE").style.visibility  = "visible";
		}
	else{
		document.getElementById("LAMINATE").style.visibility  = "hidden";
		}
	
	if( canMount === true ){
		document.getElementById("MOUNTING").style.visibility  = "visible";
		}
	else{
		document.getElementById("MOUNTING").style.visibility  = "hidden";
		}
		
	// set Note text
	var noteText = "<h3>Note:</h3><p>" + materialNote + "</p>";
	document.getElementById("NOTES").innerHTML = noteText;
	
}

function UpdatePaperSizeCost( shortSide, longSide, sizeSource ) {
	'use strict';	

	switch( sizeSource ) {
		case "dropDown": // dimensions from paper size dropDown menus -- fill in fields
						 document.getElementById("paperShortSide").value  = shortSide;
						 document.getElementById("paperLongSide").value   = longSide;
						 break;
						 
		case "field":     // dimensions from paper size fields -- set standard options to "Custom"
						 document.getElementById('printSelectSize').selectedIndex = document.getElementById('printSelectSize').options.length - 1;
						 break;
		}
	
	// determine paper area and per page cost
	g_paper_area =  shortSide * longSide / 144.0;
	
	if( g_paper_area <= g_size_rate_area_1 ) {
		g_paper_size_cost = g_rate_size_1;
		} 
	else if( g_paper_area <= g_size_rate_area_2) {
		g_paper_size_cost = g_rate_size_2;
		} 
	else if( g_paper_area <= g_size_rate_area_3) {
		g_paper_size_cost = g_rate_size_3; 
		}
	else {
		g_paper_size_cost = g_rate_size_L * g_paper_area;
		}
	}

function UpdateMaterialEstimate( materialType, costBasis, canLaminate, canMount ){
	'use strict';	
	
	var baseCost;
	var laminatingCost;
	var mountingCost;
	var laminateColumns;
	var	SHORTSIDE; //placeholder for now
	var	LONGSIDE;  //placeholder for now
	
	//check to see if print size exceeds allowable row size for chosen material
		
	// calculate base material cost
	if( costBasis === "area" || costBasis === "noritsu"){
		baseCost = g_copies * g_paper_size_cost + Math.ceil(g_paper_area) * g_paper_type_cost;
		}
	
	// calculate mounting cost
	if( canMount === true){
		mountingCost = g_copies * Math.ceil(g_paper_area) * g_mounting_cost;
		}
	else{ mountingCost = 0; } 
	
	// calculate laminating cost >>> Should be based on length <<<
	if( canLaminate === true ){
		
		if( SHORTSIDE <= g_max_laminate_roll_width ){
			
			if(SHORTSIDE <= 0.5 * g_max_paper_roll_width ){
				laminateColumns = parseInt( g_max_paper_roll_width / SHORTSIDE );
				g_laminate_length = SHORTSIDE * Math.ceil( g_copies/laminateColumns) + 2; //add 2" trim to length
				}
			else{ 
				g_laminate_length = LONGSIDE * g_copies + 2; //add 2" trim to length
				}
			}
		else{ alert("max laminate roll width exceeded");}
		
		laminatingCost = g_laminate_length * g_laminate_cost;

		}
	
	return( baseCost + mountingCost + laminatingCost);
	
	}


function UpdateMaterial( materialType, canLaminate, canMount, costBasis, materialNote ) {
	'use strict';	
	
	// Alert user to check size if changing to Noritsu print
	if( materialType === "Noritsu" ) alert( gNoritsuAlert );
		
	//show hide options and notes
	ShowHideOptions( costBasis, canLaminate, canMount, materialNote );
	
	var materialCost = UpdateMaterialEstimate( materialType, costBasis, canLaminate, canMount );
	
	}

function UpdateSize( shortSide, longSide, sizeSource ){
	'use strict';	
	
	// check for size restrictions
	
	UpdatePaperSizeCost( shortSide, longSide, sizeSource );
	
	}

// This function insures that the Short Side field is enabled if 
// the page is reloaded after the Short Side field has been 
// disabled by selecting the canvas option
function initializeForm (){

	document.getElementById("paperShortSide").disabled	= false;
	calculateEstimate();
	}