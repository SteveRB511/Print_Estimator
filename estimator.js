// JavaScript Document

/******************************************************/
/*                       Rates                        */
/******************************************************/

	// paper types, cost per sq ft
	var rate_type_smooth      = 2.00;
	var rate_type_premium     = 2.50;
	var rate_type_photo       = 3.00;
	
	// paper size rates categories based on sq. ft
	var size_rate_area_1      = 1.3;      // sq ft, up to 11 x 17
	var size_rate_area_2      = 3.5; 	  // sq ft, larger than 11 x 17, up through 18 x 28
	var size_rate_area_3      = 7.5;      // sq ft, larger than 18 x 28, up through 27 x 40

	// large paper size rate based on area alone rather than a size category
	var rate_size_L           = 5.30;      // greater than size_rate_area_3
		
	// paper size costs per copy
	var rate_size_1           = 10.00;    // size_rate_area_1 or less  ($7.70/sq ft)
	var rate_size_2           = 20.00;    // size_rate_area_2 or less  ($5.71/sq ft)
	var rate_size_3           = 40.00;    // size_rate_area_3 or less  ($5.33/sq ft)

	
	// laminate sheet width, less a 1" upper border and lower borderborder
	var laminate_sheet_width  = 54 - 2;    // inches        2014-11-25

	// laminating rate is per linear foot and mounting rates are per sq ft
	var rate_laminate         = 1.00;
	var rate_mounting_1       = 5.00;      // 3/16 inch     2014-11-25
	var rate_mounting_2       = 7.00;      // 1/2 inch      2014-11-25
	
	// 11 x 17 proof
	var rate_proof            = 3.00;
	
	// labor rates per hour
	var rate_indirect         = 84.94;   //2014-11-25
	var rate_direct           = 123.96;  //2014-11-25
	var rate_machine          = 15.00;   //2014-11-25
	
	// check values             
	var paper_size_max        = 42;      // maximum short side in inches

/******************************************************/
/*                   Initial Values                   */
/******************************************************/

	var paper_type      = "smooth";
	var paper_type_cost = rate_type_smooth ;
	
	var paper_size      = "letter";
	var paper_size_cost = rate_size_1;
	var paper_area      = 8.5 * 11.0 / 144.0; // letter area in square feet


	var laminating      = "no";		// no
	var laminate_cost   = 0.00;

	var mounting        = "no";		// no
	var mounting_cost   = 0.00;

	var copies          = 1.0;		// 1 copy
	
	var proof           = "no";		// no
	var proof_cost      = 0.00;
	
	var labor_hours     = 1.00;
	var labor_funding   = rate_indirect;
	
	var machine_hours   = 1.00;
	
function setPaperSizeCost( shortSide, longSide, source ) {
	
	switch( source ) {
		case "dropDown": // dimensions from paper size dropDown menus -- fill in fields
						 document.getElementById("paperShortSide").value  = shortSide;
						 document.getElementById("paperLongSide").value   = longSide;
						 break;
		case "field":     // dimensions from paper size fields -- set standard options to "Custom"
						 document.getElementById('paperSize').selectedIndex = document.getElementById('paperSize').options.length - 1;
						 break;
		}
	
	// determine paper area and per page cost
	paper_area =  shortSide * longSide / 144.0;
	
	if( paper_area <= size_rate_area_1 ) {
		paper_size_cost = rate_size_1;
		} 
		else if( paper_area <= size_rate_area_2) {
		paper_size_cost = rate_size_2;
		} 
		else if( paper_area <= size_rate_area_3) {
		paper_size_cost = rate_size_3; 
		}
		else {
		paper_size_cost = rate_size_L * paper_area;
		}
	}

function laminationCost() {	
	
	var rows            = 1;
	var	laminate_length = 1; //minimum, 1 linear foot
	var copies_per_row  = Math.floor( laminate_sheet_width / document.getElementById("paperLongSide").value);
	
	if( copies_per_row <= copies ) { rows = Math.ceil( copies / copies_per_row ); }
		
	var laminate_length = Math.ceil( ( (rows * document.getElementById("paperShortSide").value) + 2 ) / 12 );
	
	laminate_cost = laminate_length * 1;
	}


function calculateEstimate(){
	
	var labor_total     = labor_hours * labor_funding;
	var machine_total   = machine_hours * rate_machine;
	var materials_total = copies * ( paper_size_cost + Math.ceil(paper_area) * (paper_type_cost + mounting_cost) ) + laminate_cost + proof_cost;
	var estimate_total  = materials_total + labor_total + machine_total;
	
	materials_total = parseFloat(Math.round(materials_total * 100)/100).toFixed(2);
	document.getElementById('materialsCharge').innerHTML = materials_total;
	
	labor_total = parseFloat(Math.round(labor_total * 100)/100).toFixed(2);
	document.getElementById('laborCharge').innerHTML = labor_total;
	
	machine_total = parseFloat(Math.round(machine_total * 100)/100).toFixed(2);
	document.getElementById('machineCharge').innerHTML = machine_total;

	estimate_total = parseFloat(Math.round(estimate_total * 100)/100).toFixed(2);
	document.getElementById('estimate').innerHTML = estimate_total;
	}
	
function updateEstimate( controlName, controlValue ) {
	
	switch( controlName ) {
		case "paperType":
			switch( controlValue ) { // paper_type_cost is per sq. ft
				case "smooth":    paper_type_cost = rate_type_smooth;  calculateEstimate(); break;
				case "premium":   paper_type_cost = rate_type_premium; calculateEstimate(); break;
				case "photobase": paper_type_cost = rate_type_photo;   calculateEstimate(); /*break*/;
				}; break;
		case "paperSize":
			var choice = document.getElementById("paperSize");
			var controlValue = choice.options[choice.selectedIndex].value;
			
			switch( controlValue ) { // paper_size_cost is per copy
				case "letter":    setPaperSizeCost(  8.5, 11.0, "dropDown" ); calculateEstimate(); break;
				case "tabloid_1": setPaperSizeCost( 11.0, 17.0, "dropDown" ); calculateEstimate(); break;
				case "poster_1":  setPaperSizeCost( 18.0, 24.0, "dropDown" ); calculateEstimate(); break;
				case "poster_2":  setPaperSizeCost( 24.0, 36.0, "dropDown" ); calculateEstimate(); break;
				default: alert( "Custom poster size." ); // Custom selection
				}; break;
		case "paperSizeFields":
				var shortSide = document.getElementById("paperShortSide").value; 
				
				// check to make sure that paper size does not exceed what we can handle
				if( shortSide > paper_size_max ) {
					alert("Short Side cannot exceed " + paper_size_max + " inches" );
					return;
				}
				
				// if paper size is good, continue with calculations
				var longSide  = document.getElementById("paperLongSide").value;
				setPaperSizeCost(  shortSide, longSide, "field" );
				calculateEstimate(); 
				break;
		case "laminate":
			switch( controlValue ) { // laminate_cost is per sq. ft
				case "no":  laminate_cost =  0.00;          calculateEstimate(); break;
				case "yes": laminationCost(); calculateEstimate(); 
				}; break;
		case "mounting":
			switch( controlValue ) { // mounting_cost is per sq. ft
				case 'no':     mounting_cost =  0.00;            calculateEstimate(); break; 
				case "medium": mounting_cost =  rate_mounting_1; calculateEstimate(); break;
				case "heavy":  mounting_cost =  rate_mounting_2; calculateEstimate(); 
				}; break;
		case "copies": copies = document.getElementById("copiesNeeded").value; calculateEstimate(); break;
		case "proof":
			switch( controlValue ) { // laminate_cost is per sq. ft
				case "no":  proof_cost =  0.00; calculateEstimate(); break;
				case "yes": proof_cost =  rate_proof; calculateEstimate(); 
				}; break;
		case "laborHours": labor_hours = document.getElementById("laborHours").value; calculateEstimate(); break;
		case "laborFunding":
			switch( controlValue ) { // laminate_cost is per sq. ft
				case "indirect": labor_funding = rate_indirect; calculateEstimate(); break;
				case "direct":   labor_funding = rate_direct;   calculateEstimate(); 
				}; break;
		case "machineHours": machine_hours = document.getElementById("machineHours").value; calculateEstimate(); break;
		default: alert( controlName + " ... " + controlValue );
		}
	
	}
