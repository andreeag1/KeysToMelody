import React, { useRef, useEffect, useState } from "react";
import VexFlow from "vexflow";

const VF = VexFlow.Flow;
const { Formatter, Renderer, Stave, StaveNote } = VF;

const clefWidth = 30;
const timeWidth = 30;

export default function Score({
  newStave,
  setNewStave,
  staveLength = 2,
  staves = [],
  clef = "treble",
  timeSignature = "4/4",
  width,
  height,
}) {
  const container = useRef();
  const rendererRef = useRef();
  const [currX, setCurrX] = useState(480);
  const [currY, setCurrY] = useState(0);

  useEffect(() => {
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
      (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
    const staveWidth = 210;
    let currentX = 0;

    staves.forEach((notes, i) => {
      const stave = new Stave(currentX, 0, staveWidth);
      if (i === 0) {
        stave.setWidth(staveWidth + clefAndTimeWidth);
        clef && stave.addClef(clef);
        timeSignature && stave.addTimeSignature(timeSignature);
      }
      currentX += stave.getWidth();
      stave.setContext(context).draw();

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
      Formatter.FormatAndDraw(context, stave, processedNotes, {
        auto_beam: true,
      });

      const handleMouseMove = (event) => {
        const boundingRect =
          container && container.current.getBoundingClientRect();
        const mouseY = event.clientY - boundingRect.top;
        // Calculate which line is being hovered over
        const staffLineHeight = stave.getSpacingBetweenLines();
        const staffLines = stave.getYForLine(0); // Y coordinate of the first line
        const relativeY = mouseY - staffLines;
        const hoveredLineIndex = Math.round(relativeY / staffLineHeight);
        console.log(hoveredLineIndex);
      };

      container.current.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.current.removeEventListener("mousemove", handleMouseMove);
      };
    });
    if (newStave && (staveLength - 1) % 3 != 0) {
      const newStave = new Stave(currX, currY, staveLength - 1 < 3 ? 210 : 230);
      setCurrX(currX + newStave.getWidth());
      newStave.setContext(context).draw();
    } else if (newStave && (staveLength - 1) % 3 == 0) {
      const context = renderer.getContext();
      const newStave = new Stave(0, currY + 150, 230);
      setCurrX(230);
      setCurrY(currY + 150);
      newStave.setContext(context).draw();
    }
    setNewStave(false);
  }, [staves, newStave]);

  return <div ref={container} />;
}
