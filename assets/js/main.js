// Starts jQuery 
$(function(){
	// Listen to click event on `#submit` and prepare session for a new user
	$('body').on('click', '#submit', (e) => {
		e.preventDefault();
		$('body #error').hide();
		const name = $('body').find('#name').val();
		if (name.length < 3) {
			$('body .content').prepend('<div class="alert alert-danger" id="error">Name must be longer than 2 characters</div>')
		} else {
			// Save user's name to the local sessionStorage
			sessionStorage.name = name;

			// Redirect user to test page
			window.location.href = '/test';
		}
	});

	// Assigns value to username variable
	let username = sessionStorage.name || 'Guest';

	// Prints the username to the page
	$('#name-holder').prepend('<h3> Hi, <span class="green">' + username + ' </span></h3>');

	const typingText = $('#typingText');

	// Prevents copy, cut and paste action in the user's textbox
	typingText.bind('copy cut paste', e => e.preventDefault());

	/** 
	 * @function
	 * @name calculateSpeed
	 * This function contains the functions that calculates the gross word per minute and the net word per minute
	 */
	const calculateSpeed = {

		/**
		 * Calculates the word per minute by dividing the total characters of the input string by 5
		 * @param {String} words
		 * @returns {Number}
		 */
		calcWPM(words) {
			return Math.round(words.length / 5)
		},

		/**
		 * Calculates the net word per minute by subtracting the total errors from the words typed
		 * @param {String} words
		 * @param {String} typed
		 * @returns {Object}
		 */
		calcNET(words, typed) {
			let wordArr = words.split('');
			let typedArr = typed.split('');
			var errors = 0;
			for (let i = 0; i < typedArr.length; i++) {
				if(typedArr[i] !== words[i]){
					errors += 1;
				}
			}

			// Calculate the Net Word Per Minute
			const result = Math.round((typed.length / 5) - errors);

			// Returns the result as json object
			return JSON.parse(`{ "result": ${result}, "errors": ${errors} }`);
		},
	};

	// Listen to `focus` event on `#typingText' and fire
	typingText.on('focus', () => {
		
		// Set default time to 60s
		var num = 60;

		/**
		 * Process the user's input
		 * Saves the data to database
		 * Manipulates the DOM
		 */
		const processResults = () => {

			// Captures the user's input
			const textVal = typingText.val();

			// Original Text
			const origText = "One day Jimmy Westfielder was walking home from school and saw a big, brown dog walking behind him. At first he was a bit startled at the fact that the dog was just calmly walking behind him. Jimmy stopped and turned around to face the dog. When Jimmy looked into the dog's eyes he became  Cognizant that the dog meant no harm at all. Jimmy bent down to the dog's level and put one of his hands out. As soon as Jimmy did so the dog began to lick  Jimmy's hand. Jimmy then checked to see if the dog had a collar, which he didn't, and when he didn't find a collar he then said, \"Hello my name is Jimmy.\"";
			const copyText = $('#copyText');
			const nameHolder = $('#name-holder p');

			// Fades out the User's input box
			typingText.fadeOut(1000, () => {

				// Fades out the Original text
				copyText.fadeOut(1000);

				// Fades out the introductory p element
				nameHolder.fadeOut(1000, () => {

					// Replace the introductory text
					nameHolder.html('Your time is up! Your typing speed is been analyzed by our Algorithm');
					
					// Display the introductory text with fade effect
					nameHolder.fadeIn(1000, () => {

						// Append a loading gif to the main content area
						$('.loading').html('<img src="/images/cube.gif" class="img-responsive"/>').css({ 'display' : 'block' });
						
						// Check to see if the user's input is empty
						if (textVal === '') {
							const returnText = `<div class="results"><p>Hey, it seems you didn't type anything into the textbox. Please try again!</p></div>`;
							$('.loading').hide();
							$('#name-holder').after(returnText);
						} else {

							// Call the calculateSpeed function earlier declared to get results
							const wpm = calculateSpeed.calcWPM(textVal);
							const nwpm = calculateSpeed.calcNET(origText, textVal);
							const accuracy = Math.floor(((textVal.length - nwpm.errors) / textVal.length) * 100);
							const netwpm = nwpm.result > 0 ? nwpm.result : 0;

							// Build results to display back to the user
							let returnText = `<div class="results">`;
							returnText += `<h2>Here is your result</h2>`;
							returnText += `<div class="col-md-6 col-sm-8 col-xs-8 text-right"><span> Gross Word Per Minute: </span></div>`;
							returnText += `<div class="col-md-6 col-sm-4 col-xs-4 text-left"><span> ${wpm} WPM </span></div>`;
							returnText += `<div class="col-md-6 col-sm-8 col-xs-8 text-right"><span> Net Word Per Minute : </span></div>`;
							returnText += `<div class="col-md-6 col-sm-4 col-xs-4 text-left"><span> ${netwpm} NET WPM</span></div>`;
							returnText += `<div class="col-md-6 col-sm-8 col-xs-8 text-right"><span> No. of Errors </span></div>`;
							returnText += `<div class="col-md-6 col-sm-4 col-xs-4 text-left"><span> ${nwpm.errors} </span></div>`;
							returnText += `<div class="col-md-6 col-sm-8 col-xs-8 text-right"><span> Typing Accuracy : </span></div>`;
							returnText += `<div class="col-md-6 col-sm-4 col-xs-4 text-left"><span> ${accuracy} %</span></div>`;
							returnText += `<div class="col-md-12" style="text-align: center; padding: 0; margin-top: 10px;">
								<span class="btn btn-primary"><a href="/test">Try again</a></span>
								<span class="btn btn-primary"><a href="/leaderboard">View Leaderboard</a></span>
								<div class="clear"></div>
								</div>`;
							returnText += `<div class="clear"></div>`;
							returnText += `</div>`;

							// Pass the user's results to the `saveUser` route for storage into the database
							const data = JSON.parse(`{ "name": "${sessionStorage.name}", "wpm": ${wpm}, "accuracy": ${accuracy}, "nwpm": ${netwpm}, "errors": ${nwpm.errors} }`);
							$.ajax({
								type: 'POST',
								url: '/saveUser',
								data: data,
								dataType: 'json',
								success: (result) => {
									console.log(result);
								},
								error: (error) => {
									console.log(error);
								}
							});

							// Display the results to the user
							$('.loading').hide();
							$('#name-holder').after(returnText);
						}
					});
				});
			});
		};

		// Start timer
		var interval = setInterval(() => {
			let timeCont = $('#timer span');
			if (num !== 0) {
				num -= 1;
				if (num > 20) {
					timeCont.html((num) + 's');
				} else if (num < 20) {
					timeCont.css({
						'color' : 'red'
					});
					timeCont.html((num) + 's');
				}
			} else if (num === 0) {

				// Stops the timer if num reaches 0
				clearInterval(interval);

				// Process the User's input
				processResults();
			}
		}, 1000);
	});
	
});