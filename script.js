function ump()
{
	if
	(
		!(ik1 = document.getElementById("ump-ik1").value) ||
		!(ik2 = document.getElementById("ump-ik2").value) ||
		!(ik3 = document.getElementById("ump-ik3").value) ||
		!(ok1 = document.getElementById("ump-ok1").value) ||
		!(ok2 = document.getElementById("ump-ok2").value) ||
		!(ok3 = document.getElementById("ump-ok3").value) ||
		!(ok4 = document.getElementById("ump-ok4").value) ||
		!(nl1 = document.getElementById("ump-nl1").value) ||
		!(nl2 = document.getElementById("ump-nl2").value) ||
		!(nl3 = document.getElementById("ump-nl3").value) ||
		!(nl4 = document.getElementById("ump-nl4").value)
	)
	{
		return;
	}

	let intervalKeys = [];
	let octaveKeys   = [];
	let notes        = [];

	intervalKeys.push(ik1, ik2, ik3);
	octaveKeys.push(ok1, ok2, ok3, ok4);
	notes.push(nl1, nl2, nl3, nl4);

	let cipher = new Cipher(intervalKeys, octaveKeys, notes);
	
	cipher.decrypt();
}

class Cipher
{
	constructor(intervalKeys, octaveKeys, notes)
	{
		this.intervalKeys	= intervalKeys;
		this.octaveKeys		= octaveKeys;
		this.notes		= notes;
		this.intervals		= [];
		this.indices		= [];

		for (var i = 0; i < 10; i++)
		{
			this.indices.push({Index: i, Interval: null});
		}
	}

	decrypt()
	{
		this.setIntervals();
		this.setNotes();
		this.setIntervalIndices();
		this.getCipher();
	}

	setIntervals()
	{
		let piano = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
		let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

		let i1 = piano.slice(this.intervalKeys[0]).concat(piano.slice(0, this.intervalKeys[0]));
		let i2 = i1.slice(this.intervalKeys[1]).concat(i1.slice(0, this.intervalKeys[1]));
		let i3 = i1.slice(this.intervalKeys[2]).concat(i1.slice(0, this.intervalKeys[2]));

		i1.forEach((e, i) =>
		{
			i1[i] = {Note: e, Value: alphabet[i]};
		});

		i2.forEach((e, i) =>
		{
			i2[i] = {Note: e, Value: alphabet[i+12]};
		});

		i3.forEach((e, i) =>
		{
			i3[i] = {Note: e, Value: alphabet[i+24]};
		});

		this.intervals.push(i1, i2, i3);
	}

	setNotes()
	{
		this.notes.forEach((e, i) =>
		{
			this.notes[i] = e.match(/C#|D#|F#|G#|A#|Db|Eb|Gb|Ab|Bb|C|D|E|F|G|A|B|\s/g);

			this.notes[i].forEach((n, j) => 
			{
				if (this.notes[i][j].match(/Db/g))
				{
					this.notes[i][j] = "C#";
				}
				else if (this.notes[i][j].match(/Eb/g))
				{
					this.notes[i][j] = "D#";
				}
				else if (this.notes[i][j].match(/Gb/g))
				{
					this.notes[i][j] = "F#";
				}
				else if (this.notes[i][j].match(/Ab/g))
				{
					this.notes[i][j] = "G#";
				}
				else if (this.notes[i][j].match(/Bb/g))
				{
					this.notes[i][j] = "A#";
				}
			});
		});

		this.notes.forEach((l, i) =>
		{
			let counter = 0;

			this.notes[i].forEach((n, j) =>
			{
				if (n != " ")
				{
					this.notes[i][j] = {Note: n, Octave: parseInt(this.octaveKeys[i][counter+3])};
					counter++;
				}
			});
		});
	}

	setIntervalIndices()
	{
		for (var i = 0; i < 3; i++)
		{
			this.indices.find(x => x.Index == parseInt(this.octaveKeys[0][i])).Interval = i;
		}

		this.indices.forEach((x, i) =>
		{
			if (x.Interval == null)
			{
				if (i == 0)
				{
					x.Interval = this.indices[9].Interval;
				}
				else
				{
					x.Interval = this.indices[i-1].Interval;
				}
			}
		});
	}

	getCipher()
	{
		let result = [];

		for (var i = 0; i < this.notes.length; i++)
		{
			let line = "";

			this.notes[i].forEach(n =>
			{
				if (!isNaN(n.Octave))
				{
					line += this.intervals[this.indices.find(e => e.Index == n.Octave).Interval].find(e => e.Note == n.Note).Value;
				}
				else
				{
					if (n == " ")
					{
						line += " ";
					}
					else
					{
						line += "_";
					}
				}
			});

			result.push(line);
		}

		document.getElementById("output1").innerText = result[0];
		document.getElementById("output2").innerText = result[1];
		document.getElementById("output3").innerText = result[2];
		document.getElementById("output4").innerText = result[3];
	}
}
