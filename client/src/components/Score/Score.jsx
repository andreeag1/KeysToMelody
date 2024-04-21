import React, { useRef, useEffect, useState } from "react";
import VexFlow from "vexflow";
import checkHoverNote from "../../utils/checkHoverNote";

const VF = VexFlow.Flow;
const { Formatter, Renderer, Stave, StaveNote, Voice } = VF;

const clefWidth = 30;
const timeWidth = 30;

export default function Score({
  newStave,
  setNewStave,
  staveLength,
  timeSig,
  clef = "treble",
  width,
  height,
}) {
  const container = useRef();
  const rendererRef = useRef();
  const [currX, setCurrX] = useState(270);
  const [currY, setCurrY] = useState(0);
  const [staves, setStaves] = useState([]);
  const [staveList, setStaveList] = useState([]);
  const [rerenderStave, setRerenderStave] = useState(false);

  useEffect(() => {
    console.log(staves);
  }, [staves]);

  useEffect(() => {
    if (timeSig) {
      if (rendererRef.current == null) {
        rendererRef.current = new Renderer(
          container.current,
          Renderer.Backends.SVG
        );
      }
      const renderer = rendererRef.current;
      renderer.resize(width, height);
      const context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
      const clefAndTimeWidth =
        (clef ? clefWidth : 0) + (timeSig ? timeWidth : 0);
      const staveWidth = 210;
      let currentX = 0;

      if (staves.length == 0 || rerenderStave) {
        const stave = new Stave(0, 0, staveWidth);
        stave.setWidth(staveWidth + clefAndTimeWidth);
        clef && stave.addClef(clef);
        timeSig && stave.addTimeSignature(timeSig);
        currentX += stave.getWidth();
        stave.setContext(context).draw();
        setStaveList([...staveList, stave]);
        container.current.addEventListener("mousemove", (e) =>
          handleMouseMove(e, stave, timeSig)
        );
        container.current.addEventListener("mousedown", (e) =>
          handleMouseMove(e, stave, timeSig)
        );
        setRerenderStave(false);
      }

      staves.forEach((notes, i) => {
        const processedNotes = notes
          .map((note) => (typeof note === "string" ? { key: note } : note))
          .map((note) =>
            Array.isArray(note) ? { key: note[0], duration: note[1] } : note
          )
          .map(({ key, ...rest }) =>
            typeof key === "string"
              ? {
                  key: key.includes("/") ? key : `${key[0]}/${key.slice(1)}`,
                  ...rest,
                }
              : rest
          )
          .map(
            ({ key, keys, duration = "q" }) =>
              new StaveNote({
                keys: key ? [key] : keys,
                duration: String(duration),
              })
          );
        Formatter.FormatAndDraw(context, staveList[i], processedNotes, {
          auto_beam: true,
        });
      });
      if (newStave && (staveLength - 1) % 3 != 0) {
        console.log("hello");
        console.log(currX);
        const newStave = new Stave(
          currX,
          currY,
          staveLength - 1 < 3 ? 210 : 230
        );
        setCurrX(currX + newStave.getWidth());
        newStave.setContext(context).draw();
        setStaveList([...staveList], newStave);

        container.current.addEventListener("mousemove", (e) =>
          handleMouseMove(e, newStave, timeSig)
        );
        container.current.addEventListener("mousedown", (e) =>
          handleMouseMove(e, newStave, timeSig)
        );
      } else if (newStave && (staveLength - 1) % 3 == 0) {
        console.log("hello1");
        const context = renderer.getContext();
        const newStave = new Stave(0, currY + 150, 230);
        setCurrX(230);
        setCurrY(currY + 150);
        newStave.setContext(context).draw();
        setStaveList([...staveList], newStave);
        container.current.addEventListener("mousemove", (e) =>
          handleMouseMove(e, newStave, timeSig)
        );
        container.current.addEventListener("mousedown", (e) =>
          handleMouseMove(e, newStave, timeSig)
        );
      }
      setNewStave(false);
    }
  }, [staves, newStave, timeSig]);

  const handleMouseMove = (event, stave, timeSig) => {
    const boundingRect = container && container.current.getBoundingClientRect();

    // Calculate the vertical position of the mouse relative to the stave
    const mouseY = event.clientY - boundingRect.top;
    const staffLineHeight = stave.getSpacingBetweenLines();
    const staffLines = stave.getYForLine(0);
    const relativeY = mouseY - staffLines;
    let lineIndex = relativeY / staffLineHeight;

    // Calculate the space height (distance between lines)
    const numSpacesBetweenLines = 4; // Assuming 4 spaces between each line
    const spaceHeight = staffLineHeight / numSpacesBetweenLines;
    const relativeSpaceY = relativeY % staffLineHeight;
    let lineHovered = false;
    let spaceHovered = false;

    // Check if the relative space Y position is closer to the space or the line
    if (
      relativeSpaceY < spaceHeight / 2 ||
      relativeSpaceY > staffLineHeight - spaceHeight / 2
    ) {
      lineHovered = true;
    } else {
      spaceHovered = true;
    }

    let spaceIndex = undefined;
    // Update display or perform any other actions based on lineHovered or spaceHovered
    if (lineHovered) {
      lineIndex = Math.round(lineIndex);
    } else if (spaceHovered) {
      spaceIndex = Math.floor(relativeY / spaceHeight);
      lineIndex = undefined;
    }

    // Determine the position of each beat in the bar
    const timeSigArray = timeSig.split("/");
    const beatsInBar = timeSigArray[0]; // Assuming 4 beats per bar
    const beatWidth = stave.getWidth() / beatsInBar; // Assuming equal spacing between beats
    const beatPositions = Array.from(
      { length: beatsInBar },
      (_, i) => i * beatWidth
    );

    let beatIndex = -1;
    if (lineHovered || spaceHovered) {
      const mouseX = event.clientX - boundingRect.left;
      for (let i = 0; i < beatPositions.length; i++) {
        const beatPosition = beatPositions[i];
        const nextBeatPosition = beatPositions[i + 1] || stave.getWidth(); // For the last beat in the bar
        if (mouseX >= beatPosition && mouseX < nextBeatPosition) {
          beatIndex = i;
          break;
        }
      }
    }

    if (event.type == "mousedown") {
      const newNote = checkHoverNote(lineIndex, spaceIndex);
      console.log(staves);
      let newListArray = structuredClone(staves);
      let i = 0;
      let newStaveArray = [newListArray[0]];
      for (i = 0; i < timeSig[0]; i++) {
        if (i == beatIndex) {
          newStaveArray[i] = newNote;
        } else {
          if (!newStaveArray[i]) {
            newStaveArray[i] = ["b/4", "qr"];
          }
        }
      }
      newListArray = [...newListArray, newStaveArray];
      console.log(newListArray);
      setStaves(newListArray);
    }
  };

  return <div ref={container} id="output" />;
}
