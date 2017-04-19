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
	typingText.on('focus', () => {
		var num = 60;
		var done;
		const removeNum = () => {
			let timeCont = $('#timer span');
			let copyText = $('#copyText');
			let nameHolder = $('#name-holder p');
			num = num === 0 ? 0 : num - 1;
			if(done === true) return
			if(num > 20){
				timeCont.html((num) + 's');
			}else if(num < 20 && num !== 0){
				timeCont.css({
					'color' : 'red'
				});
				timeCont.html((num) + 's');
			}else if(num === 0){
				done = true;
				typingText.fadeOut(1000);
				copyText.fadeOut(1000);
				nameHolder.fadeOut(1000, () => {
					nameHolder.html('Your time is up! Your typing speed is been analyzed by our Algorithm');
				})
				timeCont.html((num) + 's');
				nameHolder.fadeIn(1000, () => {
					$('#name-holder').after('<div class="loading"><img src="/images/cube.gif" class="img-responsive"/></div>');
				});
			}
		};
		setInterval(removeNum, 1000);
	});
});