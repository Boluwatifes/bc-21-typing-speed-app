$(function(){
	$('body').on('click', '#submit', (e) => {
		e.preventDefault();
		$('body #error').hide();
		const name = $('body').find('#name').val();
		if(name.length < 3) {
			$('body .content').prepend('<div class="alert alert-danger" id="error">Name must be longer than 2 characters</div>')
		}else{
			sessionStorage.name = name;
			console.log(sessionStorage.name);
			window.location.href = '/test';
		}
	});

	let username = sessionStorage.name || 'Guest';

	$('#name-holder').prepend('<h3> Hi, <span class="green">' + username + ' </span></h3>');

	const typingText = $('#typingText');

	typingText.bind('copy cut paste', (e) => e.preventDefault());

	const calculateSpeed = {
		calcWPM(words){
			return Math.round(words.length / 5)
		},
		calcNET(words, typed){
			let wordArr = words.split('');
			let typedArr = typed.split('');
			var errors = 0;
			for(let i = 0; i < typedArr.length; i++){
				if(typedArr[i] !== words[i]){
					errors += 1;
				}
			}
			const result = Math.round((typed.length / 5) - errors);
			return JSON.parse(`{"result": ${result}, "errors": ${errors}}`);
		}
	};

	typingText.on('focus', () => {
		var num = 10;

		const processResults = () => {
			const textVal = typingText.val();
			console.log(textVal);
			const origText = "One day Jimmy Westfielder was walking home from school and saw a big, brown dog walking behind him. At first he was a bit startled at the fact that the dog was just calmly walking behind him. Jimmy stopped and turned around to face the dog. When Jimmy looked into the dog's eyes he became  Cognizant that the dog meant no harm at all. Jimmy bent down to the dog's level and put one of his hands out. As soon as Jimmy did so the dog began to lick  Jimmy's hand. Jimmy then checked to see if the dog had a collar, which he didn't, and when he didn't find a collar he then said, \"Hello my name is Jimmy.\"";
			const copyText = $('#copyText');
			const nameHolder = $('#name-holder p');
			typingText.fadeOut(1000, () => {
				copyText.fadeOut(1000);
				nameHolder.fadeOut(1000, () => {
					nameHolder.html('Your time is up! Your typing speed is been analyzed by our Algorithm');
					nameHolder.fadeIn(1000, () => {
						$('.loading').html('<img src="/images/cube.gif" class="img-responsive"/>').css({ 'display' : 'block' });
						if(textVal === ''){
							const returnText = `<div class="results"><p>Hey, it seems you didn't type anything into the textbox. Please try again!</p></div>`;
							$('.loading').hide();
							$('#name-holder').after(returnText);
						}else{
							const wpm = calculateSpeed.calcWPM(textVal);
							const nwpm = calculateSpeed.calcNET(origText, textVal);
							const accuracy = Math.floor(((textVal.length - nwpm.errors) / textVal.length) * 100);
							const netwpm = nwpm.result > 0 ? nwpm.result : 0;
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
							const data =  JSON.parse(`{"name": "${sessionStorage.name}", "wpm": ${wpm}, "accuracy": ${accuracy}, "nwpm": ${netwpm}, "errors": ${nwpm.errors}}`);
							console.log(data);
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
							$('.loading').hide();
							$('#name-holder').after(returnText);
						}
					});
				});
			});
		};

		var interval = setInterval(() => {
			let timeCont = $('#timer span');
			if(num !== 0){
				num -= 1;
				if(num > 20){
					timeCont.html((num) + 's');
				}else if(num < 20){
					timeCont.css({
						'color' : 'red'
					});
					timeCont.html((num) + 's');
				}
			}else if(num === 0){
				clearInterval(interval);
				processResults();
			}
		}, 1000);
	});
});