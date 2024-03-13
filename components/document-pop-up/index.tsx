"use client";
 
import { Card } from "../ui/card";

export default function DocumentPopUp() {
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   const appStateRaw = localStorage.getItem("ragArenaAppState");
  //   const appState = appStateRaw ? JSON.parse(appStateRaw) : {};
  //   if (!appState.hideDocumentPopUpUntil || new Date(appState.hideDocumentPopUpUntil) <= new Date()) {
  //     setIsVisible(true);
  //   }
  // }, []);

  // const handleClose = () => {
  //   const hideUntil = new Date();
  //   hideUntil.setHours(hideUntil.getHours() + 24); 
  //   const appStateRaw = localStorage.getItem("ragArenaAppState");
  //   const appState = appStateRaw ? JSON.parse(appStateRaw) : {};
  //   appState.hideDocumentPopUpUntil = hideUntil.toString();
  //   localStorage.setItem("ragArenaAppState", JSON.stringify(appState));
  //   setIsVisible(false);
  // };

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <Card className="w-[250px] dark:bg-[#8559f4] dark:bg-opacity-40 absolute bottom-10 left-10 text-center hover:scale-105">
      <span
        // onClick={handleClose}
        className="hover:cursor-pointer text-sm shadow-2xl"
      >
        Sourced from <a href="https://paulgraham.com/articles.html" target="_blank" className="underline">Paul Grahams essays</a>
      </span>

      
      {/* <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
      /> */}
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
