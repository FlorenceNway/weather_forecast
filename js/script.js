$(function() {

	function dateTime() {

		var d = new Date(),

			minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
			seconds = d.getSeconds().toString().length == 1 ? '0' + d.getSeconds() : d.getSeconds(),
			hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
			months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		$('#datetime').html(days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds);
		setInterval(dateTime, 1000);
	}

//----------Capitalize first letter of word----------

	function titleCase(str) {
		str = str.toLowerCase().split(' ');

		for (var i = 0; i < str.length; i++) {
			str[i] = str[i].split('');
			str[i][0] = str[i][0].toUpperCase();
			str[i] = str[i].join('');
		}
		return str.join(' ');
	}

//----------- show plain page at first load ------------
	$(".display_body").hide();


//----------- When user choose city -------------------------
	$('#my_select').change(function() {

		var section = $(this).val(); //console.log("section")

		if (section == " ") {
			$(".display_body").hide();
		} else {
			$(".display_body").show();


			event.preventDefault();

//-------------------Retrieve Data from json file -------------------------
			var xhttp;
			if (window.XMLHttpRequest) {
				xhttp = new XMLHttpRequest();
			} else {
				xhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}

			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var data = JSON.parse(this.responseText);
					var dataLength = data.length;

					for (i = 0; i < dataLength; i++) {
						let city = data[i]['city'];
						let description = data[i]['description'];
						let select_city = $('#my_select').val();

						if (city == select_city) {
							document.getElementById("cityname").innerHTML = city + ":";
							document.getElementById("description").innerHTML = description;

							//---------for map ------------------------------------
							let iframe = `<iframe width="100%" height="300" src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=${city}+(${city})&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=A&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
								<a href="https://www.maps.ie/create-google-map/">Google map generator</a></iframe>`
							document.getElementById("map").innerHTML = iframe;

							//----------for sample box / slideshow images------------
							let photo = document.getElementById('photo');
							let photo1 = document.getElementById('photo1');
							let photo2 = document.getElementById('photo2');

							photo.innerHTML = '';
							photo1.innerHTML = '';
							photo2.innerHTML = '';

							photo.innerHTML += `<img src="./image/${city}.jpg" alt="${city}">`;
							photo1.innerHTML += `<img src="./image/${city}1.jpg" alt="${city}">`;
							photo2.innerHTML += `<img src="./image/${city}2.jpg" alt="${city}">`;


						}

					}

				}
			};
			xhttp.open("GET", "js/cities.json", true);
			xhttp.send();


//-------------------Retrieve Data from API -------------------------

			var json = $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + section + "&APPID=4ce28cc8a3c4508b3d05089a9bae2779")

				.done(function(data) {

					$("#weather").empty();

					var temp = Math.round(data.main.temp - 273.15);
					var status = titleCase(data.weather[0].description);

					$('#weather').append('<h1 class="temp">' + temp + '&deg</h1>');
					$('#weather').append('<p class="status">' + status + '</p>');


					dateTime();


				}).fail(function() {
					$('#about').append("<li>Sorry, there was a problem, please try again</li>");
				})
		}
	});

});