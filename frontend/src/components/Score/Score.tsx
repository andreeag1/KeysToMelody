import React, { useRef, useEffect } from "react";
import VexFlow, { StemmableNote, Voice } from "vexflow";

const VF = VexFlow.Flow;
const { Formatter, Renderer, Stave, StaveNote } = VF;

const clefWidth = 30;
const timeWidth = 30;

const Score = ({
  staves = [],
  clef = "treble",
  timeSignature = "4/4",
  width = 450,
  height = 150,
}) => {
  const div = document.getElementById("output") as HTMLDivElement;

  useEffect(() => {
    const renderer = new Renderer(div as HTMLDivElement, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    const stave = new Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    const notes = [
      // A quarter-note C.
      new StaveNote({ keys: ["c/4"], duration: "q" }),

      // A quarter-note D.
      new StaveNote({ keys: ["d/4"], duration: "q" }),

      // A quarter-note rest. Note that the key (b/4) specifies the vertical
      // position of the rest.
      new StaveNote({ keys: ["b/4"], duration: "qr" }),

      // A C-Major chord.
      new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
    ];
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([voice]).format([voice], 350);

    // Render voice
    voice.draw(context, stave);
  }, []);

  return <div id="output" />;
};

export default Score;
