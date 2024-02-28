"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function DocumentPopUp() {
  // Initialize isVisible to false
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem("hideDocumentPopUpUntil");
    // If hideUntil is not set or the current time is past the hideUntil time, show the component
    if (!hideUntil || new Date(hideUntil) <= new Date()) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    const hideUntil = new Date();
    hideUntil.setHours(hideUntil.getHours() + 24); // Add 24 hours
    localStorage.setItem("hideDocumentPopUpUntil", hideUntil.toString());
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="w-[250px] dark:bg-[#8559f4] dark:bg-opacity-40 absolute bottom-10 left-10 text-center hover:scale-105">
      {/* <CardHeader>
        <Label className="mb-2">Article in Database: </Label>
        <CardTitle className="tracking-wide">&ldquo;Do things that don&lsquo;t scale&ldquo;</CardTitle>
        <CardDescription>by Paul Graham</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`https://www.ycombinator.com/library/96-do-things-that-don-t-scale`} target="_BLANK" className="hover:cursor-pointer">Read More</Link>
      </CardContent>
       */}
      <span
        onClick={handleClose}
        className="absolute top-0 right-0 -mt-5 -mr-2 hover:cursor-pointer text-2xl shadow-2xl"
      >
        x
      </span>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
      />
    </Card>
  );
}

const testimonials = [
  {
    title: '"Do things that don\'t scale"',
    author: "Paul Graham",
    link: "https://www.ycombinator.com/library/96-do-things-that-don-t-scale",
  },
  {
    title: '"YC\'s essential startup advice"',
    author: "Geoff Ralston, Michael Seibel",
    link: "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice",
  },
  {
    title: '"Default alive or default dead"',
    author: "Paul Graham",
    link: "https://www.ycombinator.com/library/95-default-alive-or-default-dead",
  },
  {
    title: '"How to convince investors"',
    author: "Paul Graham",
    link: "https://www.ycombinator.com/library/98-how-to-convince-investors",
  }
];
