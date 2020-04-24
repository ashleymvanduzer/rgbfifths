/**
 * degreesToRadians
 *
 * @param {number} degrees
 * @returns {number}  radians
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/**
 * generateColorWheel
 *
 * @param {number} [size=400]
 * @param {string} [centerColor="white"]
 * @returns {HTMLCanvasElement}
 */
function generateColorWheel(size, centerColor) {
    if (size === void 0) { size = 400; }
    if (centerColor === void 0) { centerColor = "white"; }
    //Generate main canvas to return
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.height = size;
    //Generate canvas clone to draw increments on
    var canvasClone = document.createElement("canvas");
    canvasClone.width = canvasClone.height = size;
    var canvasCloneCtx = canvasClone.getContext("2d");
    //Initiate variables
    var angle = -90;
    var hexCode = [255, 0, 0];
    var pivotPointer = 0;
    var colorOffsetByDegree = 4.322;
    //For each degree in circle, perform operation
    while (angle++ < 360) {

        //find index immediately before and after our pivot
        var pivotPointerbefore = (pivotPointer + 3 - 1) % 3;
        var pivotPointerAfter = (pivotPointer + 3 + 1) % 3;
        //Modify colors
        if (hexCode[pivotPointer] < 255) {
            //If main points isn't full, add to main pointer
            hexCode[pivotPointer] = (hexCode[pivotPointer] + colorOffsetByDegree > 255 ? 255 : hexCode[pivotPointer] + colorOffsetByDegree);
        }
        else if (hexCode[pivotPointerbefore] > 0) {
            //If color before main isn't zero, subtract
            hexCode[pivotPointerbefore] = (hexCode[pivotPointerbefore] > colorOffsetByDegree ? hexCode[pivotPointerbefore] - colorOffsetByDegree : 0);
        }
        else if (hexCode[pivotPointer] >= 255) {
            //If main color is full, move pivot
            hexCode[pivotPointer] = 255;
            pivotPointer = (pivotPointer + 1) % 3;
        }
        //clear clone
        canvasCloneCtx.clearRect(0, 0, size, size);
        //Generate gradient and set as fillstyle
        var grad = canvasCloneCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        // grad.addColorStop(0, centerColor);
        grad.addColorStop(1, "rgb(" + hexCode.map(function (h) { return Math.floor(h); }).join(",") + ")");
        canvasCloneCtx.fillStyle = grad;
        //draw full circle with new gradient
        canvasCloneCtx.globalCompositeOperation = "source-over";
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Switch to "Erase mode"
        canvasCloneCtx.globalCompositeOperation = "destination-out";
        //Carve out the piece of the circle we need for this angle
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Draw carved-put piece on main canvas

        ctx.drawImage(canvasClone, 0, 0);
    }
    //return main canvas

    return canvas;

}
//TEST
//Get color wheel canvas
var colorWheel = generateColorWheel(500);
//Add color wheel canvas to document
let main = document.getElementById('main');
document.getElementById('main').appendChild(colorWheel);
//Add ouput field
var p = document.body.appendChild(document.createElement("p"));
var p2 = document.body.appendChild(document.createElement("p"));
/**
 * colorWheelMouse
 *
 * @param {MouseEvent} evt
 */
// function rotateWheel() {
//     let canvas = document.getElementById('canvas');
//     let centerX = 250; let centerY = 250;
//     let rotateAngle = 36 * Math.PI / 180;
//     if(canvas.getContext) {
//         let ctx = canvas.getContext('2d');
//         ctx.translate(centerX, centerY);
//         ctx.rotate(rotateAngle);
//         ctx.translate(-centerX, -centerY);
//         generateColorWheel();
//     }
// }

let oscTone = 62;
let note;
let flat = '\u266D';
let toneNote;


let masterTempo;
let octave = 2;
let attackLevel;
let intervalLength;
let list;
let changedState = false;

function newTone(evt) {

    let synth = new Tone.Synth();
    
    synth.toDestination();
    synth.volume.value = -12;

    let loop = new Tone.Loop(function(time) {
        synth.triggerAttackRelease(toneNote, "16n", time);
        }, intervalLength).start(0);
    // loop.start(0).stop('8m');
    Tone.Transport.bpm.value = masterTempo;
    Tone.Transport.start();
}


var dropDown = new Nexus.Select('#select', {
    'size': [100, 40],
    'options': ['Major','Minor'],
})

var tempoDial = new Nexus.Dial('#tempo', {
    'min': 0,
    'max': 360,
    'step': 1,
    'value': 90
});

var tempoNumber = new Nexus.Number('#currentTempo');
tempoNumber.link(tempoDial);

// var delayDial = new Nexus.Dial('#delay', {
//     'min': 0,
//     'max': 1,
//     'step': .01,
//     'value': 1
// });

var octaveDial = new Nexus.Dial('#octave', {
    'min': 1,
    'max': 5,
    'step': 1,
    'value': 2
})

var octaveNumber = new Nexus.Number('#octaveNum');
octaveNumber.link(octaveDial);

// var distDial = new Nexus.Dial('#distortion', {
//     'min': 0,
//     'max': 2,
//     'step': 0.1,
//     'value': 0
// })

var trigDial = new Nexus.Dial('#intervalLength', {
    'min': 0.01,
    'max': 2,
    'step': 0.01,
    'value': 0.5 
})
let lengthOfLoop = new Nexus.Number('#loopNum');
lengthOfLoop.link(trigDial);


// var attackSlider = new Nexus.Slider('#attack', {
//     'min': 0.01,
//     'max': 1,
//     'step': 0.01,
//     'value': 0.01,
//     'size': [20, 80]

// })

var stopButton = new Nexus.TextButton('#stop', {
    'size': [100, 40],
    'state': false,
    'text': 'Stop',
})

dropDown.on('change', function(v) {
    if(dropDown.value === 'Major') {
        changedState = false;
        majorSelect(redTone, greenTone, blueTone);
    }
    if(dropDown.value === 'Minor') {
        changedState = true;
        minorSelect(redTone, greenTone, blueTone);
    }

})


masterTempo = 30;

stopButton.on('change', function(v) {
    stopButton.state === true;
    Tone.Transport.stop();
    Tone.Transport.cancel();

})

tempoDial.on('change', function(v) {
    masterTempo = tempoDial.value;
})

// delayDial.on('change', function(v) {
//     masterDelay = delayDial.value;
// })

octaveDial.on('change', function(v) {
    octave = octaveDial.value;
})

// distDial.on('change', function(v) {
//     distortion = distDial.value;
    
// })

trigDial.on('change', function(v) {
    intervalLength = trigDial.value;
})


// attackSlider.on('change', function(v) {
//     attackLevel = attackSlider.value;
// })

function scalePicker(redTone, greenTone, blueTone) {
    if(changedState === true) {
        minorSelect(redTone, greenTone, blueTone)
    } else {
        majorSelect(redTone, greenTone, blueTone)
    }
}

function minorSelect(redTone, greenTone, blueTone) {
    if(redTone === 255) {
        if(blueTone > 128 && blueTone >= greenTone) {
            oscTone = 233.08;
            note = "g"+flat;
            toneNote = `G${octave}`;
            //bflat
        }
        if(blueTone < 128 && blueTone >= greenTone) {
            oscTone = 174.61;
            note = "d";
            toneNote = `D${octave}`;
            //f
        }
        if(greenTone < 128 && greenTone >= blueTone) {
            oscTone = 130.81;
            note = "a";
            toneNote = `A${octave}`;
            //c
        }
        if(greenTone > 128 && greenTone >= blueTone) {
            oscTone = 196.00;
            note = "e";
            toneNote = `E${octave}`;
            //g
        }
    }
    if(greenTone === 255) {
        if(redTone > 128 && redTone >= blueTone) {
            oscTone = 146.83;
            note = "b";
            toneNote = `B${octave}`;
            //d
        }
        if(redTone < 128 && redTone >= blueTone) {
            oscTone = 220.00;
            note = "f#";
            toneNote = `F#${octave}`;
            //a
        }
        if(blueTone < 128 && blueTone >= redTone) {
            oscTone = 164.81;
            note = "c#";
            toneNote = `C#${octave}`;
            //e
        }
        if(blueTone > 128 && blueTone >= redTone) {
            oscTone = 246.94;
            note = "g#";
            toneNote = `G#${octave}`;
            //b
        }
    }
    if(blueTone === 255) {
        if(greenTone > 128 && greenTone >= redTone) {
            oscTone = 185.00 ;
            note = "d#/e"+flat;
            toneNote = `D#${octave}`;
            //gflat
        }
        if(greenTone < 128 && greenTone >= redTone) {
            oscTone = 138.59;
            note = "b"+flat;
            toneNote = `A#${octave}`;
            //dflat
        }
        if(redTone < 128 && redTone >= greenTone) {
            oscTone = 207.65;
            note = "f";
            toneNote = `F${octave}`;
            //aflat
        }
        if(redTone > 128 && redTone >= greenTone) {
            oscTone = 155.56;
            note = "c";
            toneNote = `c${octave}`;
            //eflat **investigate 311 ranch me bro!
        }
    }

}

function majorSelect(redTone, greenTone, blueTone) {
    if(redTone === 0 && greenTone === 0 && blueTone === 0) {
             oscTone = 65.406;
             note = "";
    }

    if(redTone === 255) {
        if(blueTone > 128 && blueTone >= greenTone) {
            oscTone = 233.08;
            note = "B"+flat;
            toneNote = `A#${octave}`;
            //bflat
        }
        if(blueTone < 128 && blueTone >= greenTone) {
            oscTone = 174.61;
            note = "F";
            toneNote = `F${octave}`;
            //f
        }
        if(greenTone < 128 && greenTone >= blueTone) {
            oscTone = 130.81;
            note = "C";
            toneNote = `C${octave}`;
            //c
        }
        if(greenTone > 128 && greenTone >= blueTone) {
            oscTone = 196.00;
            note = "G";
            toneNote = `G${octave}`;
            //g
        }
    }
    if(greenTone === 255) {
        if(redTone > 128 && redTone >= blueTone) {
            oscTone = 146.83;
            note = "D";
            toneNote = `D${octave}`;
            //d
        }
        if(redTone < 128 && redTone >= blueTone) {
            oscTone = 220.00;
            note = "A";
            toneNote = `A${octave}`;
            //a
        }
        if(blueTone < 128 && blueTone >= redTone) {
            oscTone = 164.81;
            note = "E";
            toneNote = `E${octave}`;
            //e
        }
        if(blueTone > 128 && blueTone >= redTone) {
            oscTone = 246.94;
            note = "B";
            toneNote = `B${octave}`;
            //b
        }
    }
    if(blueTone === 255) {
        if(greenTone > 128 && greenTone >= redTone) {
            oscTone = 185.00 ;
            note = "G"+flat;
            toneNote = `F#${octave}`;
            //gflat
        }
        if(greenTone < 128 && greenTone >= redTone) {
            oscTone = 138.59;
            note = "D"+flat;
            toneNote = `C#${octave}`;
            //dflat
        }
        if(redTone < 128 && redTone >= greenTone) {
            oscTone = 207.65;
            note = "A"+flat;
            toneNote = `G#${octave}`;
            //aflat
        }
        if(redTone > 128 && redTone >= greenTone) {
            oscTone = 155.56;
            note = "E"+flat;
            toneNote = `D#${octave}`;
            //eflat **investigate 311 ranch me bro!
        }
    }

}

function colorWheelMouse(evt) {
    var ctx = colorWheel.getContext("2d");
    var data = ctx.getImageData(evt.offsetX, evt.offsetY, 1, 1);
    usableData = data;
    
    p.innerHTML = "RGB: " + data.data.slice(0, 3).join(',');
    p2.innerHTML = `Note: ${note}`;

    // console.log(data.data)
    redTone = data.data[0];
    greenTone = data.data[1];
    blueTone = data.data[2];

    scalePicker(redTone, greenTone, blueTone);

}
//Bind mouse event
colorWheel.onmousemove = colorWheelMouse;
colorWheel.onmousedown = newTone;

// rotateWheel();

