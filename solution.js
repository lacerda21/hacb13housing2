// Data variable
var data;

// For automatically playing the song
var index = 0;
var trigger = 0;
var autoplay = true;

// set a total length of 1 minute (60000 millis)
var total_length = 50000;
var tick;
var osc;

// min/max
var price_min;
var price_max;
var delinquent_min;
var delinquent_max;
var sold_min;
var sold_max;

function preload() {
  var url = 'data/housing_bubble.csv';
  data = loadTable(url, "csv", "header");
  
  drop = loadSound('data/drop.wav');
}

function setup() {
 // console.log(albums);
  
  //count the columns
  print(data.getRowCount() + " total rows in table");
  print(data.getColumnCount() + " total columns in table");

  // compute attributes of data for sonification
  tick = total_length / data.getRowCount();
  price_min = min(data.getColumn('house_price_index'));
  price_max = max(data.getColumn('house_price_index'));
  
  delinquent_min = min(data.getColumn('delinquency'));
  delinquent_max = max(data.getColumn('delinquency'));
  
  sold_min = min(data.getColumn('houses_sold'));
  sold_max = max(data.getColumn('houses_sold'));
 
  // debugging statements
  console.log('Total Duration: ' + tick);
  console.log('Price Min: ' + price_min);
  console.log('Price Max: ' + price_max);
  
  console.log('Delinquent Min: ' + delinquent_min);
  console.log('Delinquent Max: ' + delinquent_max);
  
  console.log('Sold Max: ' + sold_max);
  console.log('Sold Min: ' + sold_min);
 
  // A Sin oscillator
  osc1 = new p5.SinOsc();
  
  // A Saw oscillator
  osc2 = new p5.SawOsc();
  
  // Start the oscillators silent
  osc1.start();
  osc1.amp(0);
  osc2.start();
  osc2.amp(0);
}


// A function to play a note
function playNote(position, duration, osc, lower, upper) {
  midi = round(map(position, lower, upper, 57, 93));
  
  osc.freq(midiToFreq(midi));
  
  // Fade it in
  osc.fade(0.5,0.2);
  
  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}


function draw() {
  
  // If we are autoplaying and it's time for the next note
  if (autoplay && (millis() > trigger)){
    
    playNote(data.get(index, 'house_price_index'), 400, osc1, price_min, price_max);
    playNote(data.get(index, 'delinquency'), 400, osc2, delinquent_min, delinquent_max);

    var vol = map(data.get(index, 'houses_sold'), sold_min, sold_max, 0.1, 1.0);
    console.log(vol)
    masterVolume(vol);
    
    trigger = millis() + tick;
    
    if (index === 180) {
      console.log('DDDRRRRROOOOOPPPPPPPPP... the Economy!');
      drop.play();
    } 
    // Move to the next note
    index++;
  // We're at the end, stop autoplaying.
  } else if (index >= data.getRowCount()) {
    autoplay = false;
    osc1.stop()
    osc2.stop()
  }
}