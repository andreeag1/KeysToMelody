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
  const [staveMap, setStaveMap] = useState([]);
  const [newStaves, setNewStaves] = useState([]);
  const [rerenderStave, setRerenderStave] = useState(false);

  useEffect(() => {
    if (timeSig) {
      if (rendererRef.current == null || rerenderStave) {
        const myNode = document.getElementById("output");
        myNode.innerHTML = "";
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
        setStaves(newStaves);
        if (!rerenderStave) {
          setStaveMap([
            { stave: stave, currX: 0, currY: 0, width: staveWidth },
          ]);
        }
      }

      if (rerenderStave && staveMap.length > 1) {
        let i = 1;
        for (i = 1; i < staveMap.length; i++) {
          const stave = new Stave(
            staveMap[i].currX,
            staveMap[i].currY,
            staveMap[i].width
          );
          stave.setContext(context).draw();
        }
        setRerenderStave(false);
      }

      newStaves.forEach((notes, i) => {
        console.log("hello");
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
        Formatter.FormatAndDraw(context, staveMap[i].stave, processedNotes, {
          auto_beam: true,
        });
      });
      if (newStave && (staveLength - 1) % 3 != 0) {
        const newStave = new Stave(
          currX,
          currY,
          staveLength - 1 < 3 ? 210 : 230
        );
        setCurrX(currX + newStave.getWidth());
        newStave.setContext(context).draw();
        setStaveMap([
          ...staveMap,
          {
            stave: newStave,
            currX: currX,
            currY: currY,
            width: staveLength - 1 < 3 ? 210 : 230,
          },
        ]);
      } else if (newStave && (staveLength - 1) % 3 == 0) {
        const context = renderer.getContext();
        const newStave = new Stave(0, currY + 150, 230);
        setCurrX(230);
        setCurrY(currY + 150);
        newStave.setContext(context).draw();
        setStaveMap([
          ...staveMap,
          { stave: newStave, currX: 0, currY: currY + 150, width: 230 },
        ]);
      }
      setNewStave(false);
    }
  }, [newStaves, staves, newStave, timeSig, rerenderStave]);

  useEffect(() => {
    if (container.current && staveMap[0]) {
      container.current.addEventListener("mousemove", handleMouseMove);
      container.current.addEventListener("mousedown", handleMouseMove);

      return () => {
        container.current.removeEventListener("mousemove", handleMouseMove);
        container.current.removeEventListener("mousedown", handleMouseMove);
      };
    }
  }, [staves, staveMap]);

  const handleMouseMove = (event) => {
    const boundingRect = container && container.current.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;

    let hoveredStaveIndex = -1;
    // Loop through staveMap to find the stave that the mouse is hovering over
    for (let i = 0; i < staveMap.length; i++) {
      const { currX, currY, width } = staveMap[i];
      if (
        mouseX >= currX &&
        mouseX <= currX + width &&
        mouseY >= currY &&
        mouseY <= currY + staveMap[i].stave.getHeight()
      ) {
        hoveredStaveIndex = i;
        break;
      }
    }

    // Calculate the vertical position of the mouse relative to the stave
    const staffLineHeight = staveMap[0].stave.getSpacingBetweenLines();
    const staffLines = staveMap[0].stave.getYForLine(0);
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
    const beatWidth = staveMap[0].stave.getWidth() / beatsInBar; // Assuming equal spacing between beats
    const beatPositions = Array.from(
      { length: beatsInBar },
      (_, i) => i * beatWidth
    );

    let beatIndex = -1;
    if (lineHovered || spaceHovered) {
      const mouseX = event.clientX - boundingRect.left;
      for (let i = 0; i < beatPositions.length; i++) {
        const beatPosition = beatPositions[i];
        const nextBeatPosition =
          beatPositions[i + 1] || staveMap[0].stave.getWidth(); // For the last beat in the bar
        if (mouseX >= beatPosition && mouseX < nextBeatPosition) {
          beatIndex = i;
          break;
        }
      }
    }

    if (event.type == "mousedown") {
      handleSetNewNote(lineIndex, spaceIndex, beatIndex, hoveredStaveIndex);
    }
  };

  const handleSetNewNote = (
    lineIndex,
    spaceIndex,
    beatIndex,
    hoveredStaveIndex
  ) => {
    const newNote = checkHoverNote(lineIndex, spaceIndex);
    let newListArray = structuredClone(staves);
    let i = 0;
    let newStaveArray = newListArray[hoveredStaveIndex]
      ? newListArray[hoveredStaveIndex]
      : [];

    for (i = 0; i < timeSig[0]; i++) {
      if (i == beatIndex) {
        if (!newStaveArray) {
          newStaveArray.push(newNote);
        }
        newStaveArray[i] = newNote;
      } else if (!newStaveArray) {
        newStaveArray.push(["b/4", "qr"]);
      } else if (!newStaveArray[i]) {
        newStaveArray[i] = ["b/4", "qr"];
      }
      console.log(newStaveArray);
    }

    setRerenderStave(true);
    if (newListArray.length == 0) {
      newListArray = [newStaveArray];
    } else {
      i = 0;
      for (i = 0; i < newListArray.length; i++) {
        newListArray[hoveredStaveIndex] = newStaveArray;
      }
    }

    console.log(newListArray);
    setNewStaves(newListArray);
  };

  return <div ref={container} id="output" />;
}
