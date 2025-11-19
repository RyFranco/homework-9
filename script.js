$(function () { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

  // Called function to update the name, happiness, and weight of our pet in our HTML
  checkAndUpdatePetInfoInHtml();

  // When each button is clicked, it will "call" function for that button (functions are below)
  $('.window-button').click(clickedWindowButton);
  $('.wake-button').click(clickedWakeButton);
  $('.fireplace-button').click(clickedFireplaceButton);
  $('.sleep-button').click(clickedSleepButton);

  setInterval(cycleRoomIdle, 750);
  setInterval(sleepIdle, 750);
  setInterval(updateStats, 2000);
  setInterval(animateHandDrop, 5000);

  setTimeout(function () {
    $('.window-button').off('click');
    $('.wake-button').off('click');
    $('.fireplace-button').off('click');
    $('.rest-button').off('click');


    alert("You woke up, your average sleep was: " + (overAllSleepQuality / 15));

  }, 30000)

})

// Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
var pet_info = { sleepQuality: 5, Temperture: 5 };
let overAllSleepQuality = 0;

const comments = {
  window: "Click...",
  wake: "👀",
  fireplace: "tss",
  rest: "Zzz",
  limit: "I can't do that right now!"
};


///////////////////
//Button functionality
//////////////////

//Window
let isWindowOpen = false;
const $windowImageElm = $(`#windowImg`);

function clickedWindowButton() {
  isWindowOpen = !isWindowOpen;

  if (isWindowOpen) {
    $windowImageElm.show(); 
  } else {
    $windowImageElm.hide(); 
  }

  checkAndUpdatePetInfoInHtml('window');
}

//Sleep and awaker buttons
let isAwake = false;
const $wakeImageElm = $(`#wakeImg`);
function clickedWakeButton() {
  isAwake = true;

  if (isAwake) {
    $wakeImageElm.show();
    $('.hand').stop(true, false).fadeOut(500, function () {
      $(this).remove();
    });
  }

  checkAndUpdatePetInfoInHtml('wake');
}

function clickedSleepButton() {
  isAwake = false;
  if (isAwake == false) {
    $wakeImageElm.hide();
    checkAndUpdatePetInfoInHtml('rest');
  }
}

//StartFirePlace
const $fireplaceImageElm = $(`#outFireplaceImg`);
let isFire = true;
function clickedFireplaceButton() {
  isFire = !isFire;

  if (isFire) {
    $fireplaceImageElm.hide();
  } else {
    $fireplaceImageElm.show();
  }

  checkAndUpdatePetInfoInHtml('fireplace');
}


//////////////////
//////////////////


function checkAndUpdatePetInfoInHtml(statusSource) {

  updatePetInfoInHtml();

  if (statusSource) {
    displayPetComment(comments[statusSource]);
  }
}

function updateStats() {

  pet_info.sleepQuality += isAwake ? -1 : 0.5;
  pet_info.Temperture += isFire ? 0.5 : -0.5;

  if (isWindowOpen) pet_info.Temperture += -2;

  if (pet_info.Temperture >= 9) {
    pet_info.sleepQuality += -2;
    console.log("too hot");
  } else if (pet_info.Temperture <= 2) {
    pet_info.sleepQuality += -2;
    console.log("too cold");
  }

  //tempeture clamp
  if (pet_info.Temperture > 10) {
    pet_info.Temperture = 10;
  } else if (pet_info.Temperture < 1) {
    pet_info.Temperture = 1;
  }

  //Sleep Quality clamp
  if (pet_info.sleepQuality > 10) {
    pet_info.sleepQuality = 10;
    console.log("clamped");
  } else if (pet_info.sleepQuality < 1) {
    pet_info.sleepQuality = 1;
    //console.log("clamped");
  }

  updatePetInfoInHtml()
  overAllSleepQuality += pet_info.sleepQuality;

}


// Updates your HTML with the current values in your pet_info object
function updatePetInfoInHtml() {
  $('.sleep_quality').text(pet_info.sleepQuality);
  $('.temperture').text(pet_info.Temperture);

}


function displayPetComment(message) {
  const $commentElement = $('.pet-comment');
  console.log(message);

  $commentElement.text(message);

  $commentElement.css('opacity', 1).fadeIn(200);
  $commentElement.fadeOut(1000);

}



//////////////////
//Animations
//////////////////

const idle_1 = "./images/idle1.png";
const idle_2 = "./images/idle2.png";
let isIdleFrame1 = true;
let isSleepIdleFrame1 = true;

function cycleRoomIdle() {
  const $roomImageElm = $(`#backgroundImg`);
  $roomImageElm.attr('src', isIdleFrame1 ? idle_2 : idle_1);
  isIdleFrame1 = !isIdleFrame1
}


const sleepIdle_1 = "./images/sleep1.png";
const sleepIdle_2 = "./images/sleep2.png";
function sleepIdle() {
  const $guyImageElm = $(`#guyImg`);
  $guyImageElm.attr('src', isSleepIdleFrame1 ? sleepIdle_2 : sleepIdle_1);
  isSleepIdleFrame1 = !isSleepIdleFrame1
}





function animateHandDrop() {
  if (isAwake) {
    return;
  }

  const $original = $('#handImg');
  const handPositions = ['3%', '47%', '86%'];
  const handDropHeights = ['-400px', '-300px', '-250px'];

  handPositions.forEach((pos, index) => {
    if (Math.random() < 0.3) return;
    const $newHand = $original.clone()
      .removeAttr('id')
      .addClass('hand')
      .css({
        position: 'absolute',
        left: pos,
        top: '-1000px',
        width: '15%',
        display: 'block',
        zIndex: 3
      })
      .data('dropIndex', index);

    $('.pet-image-container').append($newHand);
  });

  $('.hand').each(function () {
    const $hand = $(this);
    const index = $hand.data('dropIndex') ?? 0;
    const targetY = handDropHeights[index];

    $hand.animate({
      top: targetY,
      opacity: 1
    }, 10000).delay(1000).fadeOut(600, function () {
      console.log($hand.data('dropIndex'))
      switch ($hand.data('dropIndex')) {
        case 0:
          clickedWindowButton();
          console.log("Window");
          break;
        case 1:
          clickedWakeButton();
          console.log("man");
          break;
        case 2:
          clickedFireplaceButton()
          console.log("fire");
          break;

      }
      $(this).remove();
    });
  });
}

//////////////////
//////////////////