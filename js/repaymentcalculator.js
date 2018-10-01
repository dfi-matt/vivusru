//Helper Functions

var moneyForm = wNumb({
	thousand: ' ',
	decimal: ',',
	decimals: 0
});

var moneyFormD = wNumb({
	thousand: ' ',
	decimal: ',',
	decimals: 2
});

//Set Up Sliders
var slideramount = document.getElementById('slideramount');
var sliderterm = document.getElementById('sliderterm');

var sliderAmountOptions = {
	start: 30000,
	step: 1000,
	min: 10000,
	max: 100000,
}

var sliderTermOptions = {
	start: 12,
	step: 2,
	min: 12,
	max: 52,
}


if(!!slideramount && !!sliderterm){

	noUiSlider.create(slideramount, {
		start: sliderAmountOptions.start,
		connect: [true, false],
		step: sliderAmountOptions.step,
		range: {
			'min': sliderAmountOptions.min,
			'max': sliderAmountOptions.max
		}
	});

	noUiSlider.create(sliderterm, {
		start: sliderTermOptions.start,
		connect: [true, false],
		step: sliderTermOptions.step,
		range: {
			'min': sliderTermOptions.min,
			'max': sliderTermOptions.max
		}
	});

	sliderterm.noUiSlider.on('update', function(){
		displayLoanInfo(false);
	});

	slideramount.noUiSlider.on('update', function(){
			displayLoanInfo(false);
	});
	
}

var schedule = "";


$(function(){

	$('#schedule-modal').on('shown.bs.modal', function () {
  		displayLoanInfo(true);
	});

	$(".slider-value-amount").on("focus", function(){
		$(this).select();
	});

	$("#loanamount_text").on("keyup", debounce(function() {
		value = $(this).val();
		if(value < sliderAmountOptions.min || value > sliderAmountOptions.max) {
			return false;
		} else {
			slideramount.noUiSlider.set(value);	
		}
	}, 200));


	$("#loanamount_text").on("change", function(){
		value = $(this).val();
		if(value < sliderAmountOptions.min){
			slideramount.noUiSlider.set(sliderAmountOptions.min);
		} else if(value > sliderAmountOptions.max) {
			slideramount.noUiSlider.set(sliderAmountOptions.max);
		} else {
			slideramount.noUiSlider.set(value);
		}
	});

	$("#loanterm_text").on("keyup", debounce(function(){
		value = $(this).val();
		if(value < sliderTermOptions.min || value > sliderTermOptions.max) {
			return false;
		} else {
			sliderterm.noUiSlider.set(value);	
		}
	}, 200));

	$("#loanterm_text").on("change", function(){
		value = $(this).val();
		if(value < sliderTermOptions.min){
			sliderterm.noUiSlider.set(sliderTermOptions.min);
		} else if(value > sliderTermOptions.max) {
			sliderterm.noUiSlider.set(sliderTermOptions.max);
		} else {
			sliderterm.noUiSlider.set(value);
		}
	});

});



function calculateRepayment(loan_term, loan_amount){


	//Set the variables
	//var annual_rate = 182.50;
	var annual_rate = loan_term < 24 ? 328.50 : 182.50;
	var periods = loan_term / 2;
	var rate = (annual_rate / periods) / 100;
	var fee = 0;
	//var rate = ( (1+182.50/26) ** (26/26) )-1;
	//rate = rate / 100;

	//Calculate interest rate - if less than 12 weeks = 0.9% else 0.5%
	//var interest_rate = loan_term_days <= 168 ? 0.009 : 0.005;




	//Calculate the repayment amount
	var x = Math.pow(1 + rate, periods);
	var payment_amount = (loan_amount * x * rate) / (x - 1);


	//Create the loan schedule
	$("#monthly").html(payment_amount.toFixed(2));


	var schedule = "";
	var interest_accrued = 0;
	var repayment_amount = 0;
	var balance = loan_amount;
	var principal = 0;

	//Calculate Repayment Date
	var dueDate = new Date();
	dueDate.setTime(dueDate.getTime() + loan_term * 24 * 60 * 60 * 1000);
	var repayment_date = dueDate.getDate() + " ";  
	repayment_date += getMonth(dueDate.getMonth());  


	//Calculate Start Date
    var startDate = new Date();
    var dueDate = new Date();

	for ( var i=0; i < periods; i++) { 

		interest_accrued = balance * rate;
		repayment_amount += payment_amount;
	  	principal = payment_amount - interest_accrued;
	  	balance = balance + interest_accrued - payment_amount;
	  	dueDate.setTime(dueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
	  	if(i == 0)
	  		var first_date = dueDate.getDate() + '.' + (dueDate.getMonth() + 1) + '.' + dueDate.getFullYear();


	  // Append a row to the table
		schedule += '<tr>';
		schedule += '<td>'+(i+1)+'</td>';
		schedule += '<td>'+ dueDate.getDate() + '.' + (dueDate.getMonth() + 1) + '.' + dueDate.getFullYear() + '</td>';
		schedule += '<td>'+ moneyFormD.to(payment_amount) +'</td>';
		schedule += '<td>'+ moneyFormD.to(interest_accrued) +'</td>';
		schedule += '<td>'+ moneyFormD.to(principal) +'</td>';
		schedule += '<td>'+ moneyFormD.to(balance) +'</td>';
		schedule += '</tr>';
	}


	payload = { 
		amount: loan_amount,
		term: loan_term,
		apr: annual_rate,
		interest: interest_accrued,
		fee: fee,
		repayment: repayment_amount,
		monthly_repayment: payment_amount,
		first_date: first_date,
		schedule: schedule
	};

	return payload;
}



function displayLoanInfo(schedule){

	//Get Term			
	var loan_term = parseFloat(sliderterm.noUiSlider.get());
	
	//Get Amount
	var loan_amount = parseFloat(slideramount.noUiSlider.get());

	//Get Payload
	var payload = calculateRepayment(loan_term, loan_amount);


	//Display Loan Amount
	$("#loanamount_text").val(moneyForm.to(payload.amount));
	$(".loan-amount-display").html(moneyForm.to(payload.amount));


	//Display Loan Term
	$("#loanterm_text").val(payload.term);
	$(".loan-term-display").html(payload.term);

	//Display Interest
	$(".loan-interest-display").html(moneyFormD.to(payload.interest));

	//Display Interest
	$(".loan-apr-display").html(moneyFormD.to(payload.apr));

	//Display Fee
	$(".loan-fee-display").html(moneyForm.to(payload.fee));

	$(".monthly-repayment-display").html(moneyForm.to(payload.monthly_repayment));

	//Display the Repayment Amount
	$(".loan-repayment-display").html(moneyForm.to(payload.repayment));

	$(".loan-firstdate-display").html(payload.first_date);

	if(schedule){
		$("#schedule").html(payload.schedule);	
	}
}





function getMonth(month){
	var monthNames = ["January", "February", "March", "Aprix", "May", "June", "July", "August", "September", "October", "November", "December"];
	var monthNamesAbr = ["Jan", "Feb ", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	var output = monthNamesAbr[month];
	return output;
}

function debounce(func, delay) {
	var inDebounce = void 0;
	return function () {
		var context = this;
		var args = arguments;
		clearTimeout(inDebounce);
		inDebounce = setTimeout(function () {return (
			func.apply(context, args));},
		delay);
	};
}



