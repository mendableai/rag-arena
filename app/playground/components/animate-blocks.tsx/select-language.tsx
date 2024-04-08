import { Download } from "lucide-react";

export default function SelectLanguage(props: any) {
  return (
    <div className="inline-block relative w-64 mb-2">
      <select
        {...props}
        value={props.value}
        className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        {props.options}
      </select>
      <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
        <Download className="fill-current h-4 w-4" />
      </div>
    </div>
  );
}
