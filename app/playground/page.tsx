import Header from "@/components/theme/header";
import PlaygroundChat from "./components/chat";
import TextBox from "./components/text-box";
import TextSplitterBox from "./components/text-splitter-box";

export default function PlaygroundPage() {
  return (
    <>
      <Header />
      <div className="p-10">
        <div className="grid grid-cols-6 grid-rows-2 gap-4">
          <div className="col-span-2 row-span-1">
            <TextBox />
          </div>
          <div className="col-span-2 row-span-1">
            <TextSplitterBox />
          </div>
          <div className="col-span-2 row-span-2 min-h-max">
            <PlaygroundChat />
          </div>
          <div className="col-span-2 row-span-1">
            <TextSplitterBox />
          </div>
          
          <div className="col-span-2 row-span-1">
            <TextSplitterBox />
          </div>
         
        </div>
      </div>
    </>
  );
}
