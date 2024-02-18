import { toast } from "sonner";

export default function aplyToast(message: string) {
  toast(message, {
    description: new Date().toLocaleString(),
    action: {
      label: "Close",
      onClick: () => null,
    },
  });
  return;
}
