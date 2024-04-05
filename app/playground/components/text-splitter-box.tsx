import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CustomPlaygroundIngestion from "./custom-ingestion";

export default function TextSplitterBox() {
  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-white"
      >
        1
      </Badge>
      <CardHeader>Text Splitter</CardHeader>
      <CardContent className="flex gap-4">
        <CustomPlaygroundIngestion />
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
